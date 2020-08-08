import { Observable, Subject, forkJoin, of, from, defer, concat, empty } from 'rxjs';
import { DatabaseService } from '@wizdm/connect/database';
import { DatabaseBatch } from '@wizdm/connect/database/document';
import { StorageService, StorageRef } from '@wizdm/connect/storage';
import { FunctionsClient } from '@wizdm/connect/functions/client';
import { UserProfile, UserData } from 'app/utils/user';
import { map, scan, tap, switchMap } from 'rxjs/operators';
import { animationFrameScheduler } from 'rxjs';
import { UserRecord } from '../admin-types';
import { Component } from '@angular/core';
import { append } from '@wizdm/rxjs';

/** Users Analysis Report */
export interface UserReport {

  // Input data
  users: UserRecord[];
  profiles: UserData[];
  folders: StorageRef[];

  // Users vs profiles comparison
  missing?: UserRecord[];
  orphans?: UserData[];

  // Profile inconsistencies
  userNameMissing: UserData[];
  fullNameMissing: UserData[];
  searchIndexMissing: UserData[];
  
  // Status report
  currentId?: string;
  currentIndex?: number;
  errorsCount?: number;
  done?: boolean;
}

@Component({
  selector: 'wm-profile-fixer',
  templateUrl: './profile-fixer.component.html',
  styleUrls: ['./profile-fixer.component.scss']
})
export class ProfileFixerComponent {

  readonly report$: Observable<UserReport>;
  readonly run$ = new Subject<void>();
  
  /** WriteBatch collecting all the fixes to be applied over the database */
  public batch: DatabaseBatch;

  /** The DatabaseService */
  private get db(): DatabaseService { return this.users.db; }

  constructor(private client: FunctionsClient, private users: UserProfile, private st: StorageService ) { 

    // Builds the report observable to emit each step of the analysis
    this.report$ = this.run$.pipe( 

      // Starts by resetting the WriteBatch, if any.
      tap( () => { this.batch = null; }),
      
      // Concatenates two tasks
      switchMap( () => concat( 
        
        // First task simply emits an empty report to display the 'Fetchind data' message while loading data from the server
        of({} as UserReport), 
        
        // Second task starts by loading all the data from the server
        forkJoin( this.listAllUsers(), this.listAllProfiles(), this.listAllFolders() ).pipe( 

          // Collects the results to initialize the repoprt with the input data
          map( ([users, profiles, folders]) => ({ 

            users, profiles, folders, missing: [], orphans: [], currentId: '', errorsCount: 0 

          } as UserReport) ),

          // Runs every UserRecord by the animationScheduler
          switchMap( report => from(report.users, animationFrameScheduler).pipe(

            // Analyze each record building up the resulting report
            scan( (report, user, index) => {

              // Keeps track of the pregress
              report.currentId = user.uid;
              report.currentIndex = index;

              // Gets the profile supposidely matching the UserRecord. Note that both UserRecord[] and 
              // UserData[] arrays are purposely sorted in ascending uid order server side
              const profile = report.profiles[index - report.missing.length + report.orphans.length];
              
              // Matches the UserRecord with the profile:
              // 1. Accounts for missing profiles (the user exists without a profile)
              if(!profile || profile.id > user.uid) { 
      
                report.missing.push( user ); 
                report.errorsCount++;
              }
              // 2. Accounts for orphan profiles (the profile exists without a user)
              else if(profile.id < user.uid) { 
          
                report.orphans.push( profile ); 
                report.errorsCount++;
              }

              // Verifies the user has a storage folder
              const folderIndex = report.folders.findIndex( folder => folder.name === user.uid);
              if(folderIndex >= 0) { report.folders.splice(folderIndex, 1); }

              // Analyzes the profile for inconsistencies
              this.analyzeProfile(profile, report);

              // Emits the current report
              return report;

            }, report),

            // Once every UserRecord as being analyzed, lets check for orphan profiles
            append( report => {

              // Computes the starting position accounting for missing and already discovered orphan profiles
              const start = report.users.length - report.missing.length + report.orphans.length;

              // Completes if there's nothing left to do
              if(start >= report.profiles.length) { return empty(); }

              // Runs every profile left otherwise
              return from( report.profiles.slice(start), animationFrameScheduler).pipe(

                // Analyze each orhpan profile
                scan( (report, profile) => {

                  // Keeps track of the progress
                  report.currentId = profile.id;
                  report.currentIndex++;

                  // Collects the orphans 
                  report.orphans.push( profile );
                  report.errorsCount++;

                  // Emits the report
                  return report;

                }, report)
              );
            }, report),

            // Done
            append( report => of({ ...report, done: true }))
          ))
        )
      ))
    );
  }

  /** List all users returning them in ascending order sorted by uid */
  private listAllUsers(): Observable<UserRecord[]> {

    return this.client.get<UserRecord[]>('users');
  }

  /** List all user's profile ordered by id */
  private listAllProfiles(): Observable<UserData[]> {

    return defer( () => this.users.get( qf => qf.orderBy(this.db.sentinelId) ));
  }

  /** Deletes a storage folder from the default bucket */
  private deleteFolder(prefix: string): Observable<void> {

    return this.client.delete<void>(`folders/${prefix}`);
  }

  /** List all storage folders */
  private listAllFolders(): Observable<StorageRef[]> {

    return this.st.reference('/').listAll().pipe( map( result => result.prefixes ) );
  }

  /** Analyzes a profile serching for inconsistencies */
  private analyzeProfile(profile: UserData, report: UserReport) {

    // Skips when no profile is given
    if(!profile) { return report; }

    // Checks for user names. Required for user profile navigation
    if(!profile.userName) { 
        
      report.userNameMissing = (report['userNameMissing'] || []).concat(profile); 
      report.errorsCount++;
    }

    // Checks for full names. Required for user sorting
    if(!profile.fullName) { 
        
      report.fullNameMissing = (report['fullNameMissing'] || []).concat(profile); 
      report.errorsCount++;
    } 

    // Checks for search indexes. Required for user searching
    if(!profile.searchIndex) { 
      
      report.searchIndexMissing = (report['searchIndexMissing'] || []).concat(profile); 
      report.errorsCount++;
    }
    else {

      // Computes a new search index to compare the profile with 
      const { searchIndex } = this.users.formatData({ lastName: '', ...profile });

      // Compare the search indexes for equality
      if(searchIndex.length !== profile.searchIndex.length || searchIndex.some( (value, index) => value !== profile.searchIndex[index])) {

        report.searchIndexMissing = (report['searchIndexMissing'] || []).concat(profile); 
        report.errorsCount++;
      }
    }

    return report;
  }

  /** Creates a new profile from the user record (BatchWrite) */
  public createMissingProfile(user: UserRecord, report: UserReport) {

    const index = report.missing.findIndex( missing => missing === user);
    if(index >= 0) { 

      const batch = this.batch || ( this.batch = this.db.batch() );

      batch.set(this.users.ref.doc(user.uid), this.users.userData(user as any));

      report.missing.splice(index, 1); 
      report.errorsCount--;
    }
  }

  /** Deletes the orphan profile (WriteBatch) */
  public deleteOrphanProfile(profile: UserData, report: UserReport) {

    const index = report.orphans.findIndex(orphan => orphan === profile);
    if(index >= 0) { 

      const batch = this.batch || ( this.batch = this.db.batch() );

      batch.delete(this.users.ref.doc(profile.id));

      report.orphans.splice(index, 1);
      report.errorsCount--;
    }
  }

  /** Deletes the orphan folder immediately */
  public deleteOrphanFolder(folder: StorageRef, report: UserReport) {

    const index = report.folders.findIndex(orphan => orphan === folder);
    if(index >= 0) { 

      this.deleteFolder(folder.name).subscribe( () => {

        report.folders.splice(index, 1);
        report.errorsCount--;

      });
    }
  }

  /** Guesse a user nick-name (WriteBatch) */
  public guessMissingUserNames(profiles: UserData[], report: UserReport) {

    if(!profiles) { return; }

    const batch = this.batch || ( this.batch = this.db.batch() );

    const guesses: string[] = [];

    Promise.all( profiles.map( profile => {

      const { fullName } = this.users.formatData({ lastName: '', ...profile });

      return this.users.guessUserName(fullName).then( userName => {

        while(guesses.find( guess => guess === userName )) { userName = userName.concat('z'); }

        console.log("Guessing", userName);

        batch.update(this.users.ref.doc(profile.id), { userName });

        guesses.push(userName);

        report.errorsCount--;
      });

    })).then( () => delete report.userNameMissing );
  }

  /** Guesses a user's fullName (WriteBatch) */
  public guessMissingFullNames(profiles: UserData[], report: UserReport) {

    if(!profiles) { return; }

    const batch = this.batch || ( this.batch = this.db.batch() );

    profiles.forEach( profile => {

      const { fullName } = this.users.formatData({ lastName: '', ...profile });

      batch.update(this.users.ref.doc(profile.id), { fullName });
      
      report.errorsCount--;

    });

    delete report.userNameMissing;
  }

  /** Coputes the search index (WriteBatch) */
  public computeMissingSearchIndex(profiles: UserData[], report: UserReport) {

    if(!profiles) { return; }

    const batch = this.batch || ( this.batch = this.db.batch() );

    profiles.forEach( profile => {

      const { searchIndex } = this.users.formatData({ lastName: '', ...profile });

      batch.update(this.users.ref.doc(profile.id), { searchIndex });

      report.errorsCount--;

    });

    delete report.searchIndexMissing;
  }

  /**  */
  public fixAllAnomalies(report: UserReport) {

    report.missing?.forEach( user => this.createMissingProfile(user, report) );

    report.orphans?.forEach( profile => this.deleteOrphanProfile(profile, report) );

    this.guessMissingUserNames(report.userNameMissing, report);

    this.computeMissingSearchIndex(report.searchIndexMissing, report);
  }

  public applyAllFixes(report: UserReport) {

    if(!report) { return; }

    forkJoin( 
      
      from( this.batch ? this.batch.commit() : empty() ),

      from( report.folders || [] ).pipe( switchMap( folder => this.deleteFolder(folder.name) ) )  
      
    ).toPromise().then( () => this.batch = null );
  }
}
