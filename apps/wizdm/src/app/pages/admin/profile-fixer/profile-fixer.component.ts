import { Users, UserData } from 'app/navigator/providers/user-profile';
import { Observable, Subject, forkJoin, of, from, defer, concat, empty } from 'rxjs';
import { AdminService, UserRecord } from '@wizdm/admin';
import { map, scan, tap, switchMap } from 'rxjs/operators';
import { WriteBatch } from '@wizdm/connect/database';
import { animationFrameScheduler } from 'rxjs';
import { Component } from '@angular/core';
import { append } from 'app/utils/rxjs';

export interface UserReport {

  users: UserRecord[];
  profiles: UserData[];

  missing?: UserRecord[];
  orphans?: UserData[];

  incongruencies?: {
    
    userNameMissing: UserData[];
    fullNameMissing: UserData[];
    searchIndexMissing: UserData[];
  };
  
  currentId?: string;
  currentIndex?: number;
  errorsCount?: number;
}

@Component({
  selector: 'wm-profile-fixer',
  templateUrl: './profile-fixer.component.html',
  styleUrls: ['./profile-fixer.component.scss']
})
export class ProfileFixerComponent {

  readonly report$: Observable<UserReport>;
  readonly run$ = new Subject<void>();
  
  public batch: WriteBatch;

  constructor(private admin: AdminService, private users: Users) { 

    this.report$ = this.run$.pipe( 

      tap( () => { this.batch = null; }),
      
      switchMap( () => concat( 
        
        of({} as UserReport), 
        
        forkJoin( this.admin.listAllUsers(), this.loadAllProfiles() ).pipe( 

          map( ([users, profiles]) => ({ users, profiles, missing: [], orphans: [], currentId: '', errorsCount: 0 } as UserReport) ),

          switchMap( report => from(report.users, animationFrameScheduler).pipe(

            scan( (report, user, index) => {

              const profile = report.profiles[index - report.missing.length + report.orphans.length];

              report.currentId = user.uid;
              report.currentIndex = index;
              
              if(!profile || profile.id > user.uid) { 
                
                report.missing.push( user ); 
                report.errorsCount++;
              }
            
              else if(profile.id < user.uid) { 

                report.orphans.push( profile ); 
                report.errorsCount++;
              }

              if(profile) { this.analyzeProfile(profile, report); }

              return report;

            }, report),

            append( report => {

              const start = report.users.length - report.missing.length + report.orphans.length;

              if(start >= report.profiles.length) { return empty(); }

              return from( report.profiles.slice(start), animationFrameScheduler).pipe(

                scan( (report, profile) => {

                  report.currentId = profile.id;

                  report.orphans.push( profile );
                  report.currentIndex++;
                  report.errorsCount++;

                  this.analyzeProfile(profile, report);

                  return report;

                }, report)
              );
            }, report)
          ))
        )
      ))
    );
  }

  private loadAllProfiles(): Observable<UserData[]> {

    return defer( () => this.users.get( qf => qf.orderBy(this.users.db.sentinelId) ));
  }

  private fullName(profile: UserData) {

    const { fullName } = this.users.me.formatData({ lastName: '', ...profile });

    return fullName;
  }

  private searchIndex(profile: UserData) {

    const { searchIndex } = this.users.me.formatData({ lastName: '', ...profile });

    return searchIndex;
  }

  private analyzeProfile(profile: UserData, report: UserReport) {

    const incongruencies = report.incongruencies || (report['incongruencies'] = {} as any);

    if(!profile.userName) { 
        
      incongruencies.userNameMissing = (incongruencies['userNameMissing'] || []).concat(profile); 
      report.errorsCount++;
    }

    if(!profile.fullName) { 
        
      incongruencies.fullNameMissing = (incongruencies['fullNameMissing'] || []).concat(profile); 
      report.errorsCount++;
    } 

    if(!profile.searchIndex) { 
      
      incongruencies.searchIndexMissing = (incongruencies['searchIndexMissing'] || []).concat(profile); 
      report.errorsCount++;
    }
    else {

      const searchIndex = this.searchIndex(profile);

      if(searchIndex.length !== profile.searchIndex.length || searchIndex.some( (value, index) => value !== profile.searchIndex[index])) {

        incongruencies.searchIndexMissing = (incongruencies['searchIndexMissing'] || []).concat(profile); 
        report.errorsCount++;
      }
    }

    return report;
  }

  public createMissingProfile(user: UserRecord, report: UserReport) {

    const index = report.missing.findIndex( missing => missing === user);

    if(index >= 0) { 

      const batch = this.batch || ( this.batch = this.users.db.batch() );

      batch.set(this.users.ref.doc(user.uid), this.users.me.userData(user as any));

      report.missing.splice(index, 1); 

      report.errorsCount--;
    }
  }

  public deleteOrphanProfile(profile: UserData, report: UserReport) {

    const index = report.orphans.findIndex(orphan => orphan === profile);

    if(index >= 0) { 

      const batch = this.batch || ( this.batch = this.users.db.batch() );

      batch.delete(this.users.ref.doc(profile.id));

      report.orphans.splice(index, 1);

      report.errorsCount--;
    }
  }

  public guessMissingUserNames(profiles: UserData[], report: UserReport) {

    if(!profiles) { return; }

    const batch = this.batch || ( this.batch = this.users.db.batch() );

    profiles.forEach( profile => {

      
      report.errorsCount--;

    });

    delete report.incongruencies.userNameMissing;
  }

  public guessMissingFullNames(profiles: UserData[], report: UserReport) {

    if(!profiles) { return; }

    const batch = this.batch || ( this.batch = this.users.db.batch() );

    profiles.forEach( profile => {

      const fullName = this.fullName(profile);

      batch.update(this.users.ref.doc(profile.id), { fullName });
      
      report.errorsCount--;

    });

    delete report.incongruencies.userNameMissing;
  }

  public computeMissingSearchIndex(profiles: UserData[], report: UserReport) {

    if(!profiles) { return; }

    const batch = this.batch || ( this.batch = this.users.db.batch() );

    profiles.forEach( profile => {

      const searchIndex = this.searchIndex(profile);

      batch.update(this.users.ref.doc(profile.id), { searchIndex });

      report.errorsCount--;

    });

    delete report.incongruencies.searchIndexMissing;
  }

  public fixAllAnomalies(report: UserReport) {

    report.missing?.forEach( user => this.createMissingProfile(user, report) );

    report.orphans?.forEach( profile => this.deleteOrphanProfile(profile, report) );

    this.guessMissingUserNames(report.incongruencies?.userNameMissing, report);

    this.computeMissingSearchIndex(report.incongruencies?.searchIndexMissing, report);
  }

  public applyAllFixes() {

    if(this.batch) {

      this.batch.commit().then( () => this.batch = null );
    }
  }
}
