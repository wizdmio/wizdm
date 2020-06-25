import { Users, UserData } from 'app/navigator/providers/user-profile';
import { Observable, Subject, forkJoin, of, from, defer, concat, empty } from 'rxjs';
import { AdminService, UserRecord } from '@wizdm/admin';
import { map, scan, switchMap } from 'rxjs/operators';
import { animationFrameScheduler } from 'rxjs';
import { Component } from '@angular/core';
import { append } from 'app/utils/rxjs';

export interface UserReport {

  users: UserRecord[];
  profiles: UserData[];

  missing?: UserRecord[];
  orphans?: UserData[];

  incongruencies?: any;
  
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

  constructor(private admin: AdminService, private users: Users) { 

    this.report$ = this.run$.pipe( switchMap( () => concat( 
        
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

            // TODO: analyze profile
            if(profile) { }

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

                // TODO: analyze profile

                return report;

              }, report)
            );
          }, report)
        ))
      )
    )));
  }

  private loadAllProfiles(): Observable<UserData[]> {

    return defer( () => this.users.get( qf => qf.orderBy(this.users.db.sentinelId) ));
  }
/*
  private compareUsersVsProfiles(users: any[], profiles: UserData[]): UserReport {

    let errorsCount = 0;

    const orphans = [];
    const missing = [];

    users.forEach( (user, index) => {

      const profile = profiles[index - missing.length + orphans.length];

      // Detects incongruencies
      if( user.uid !== profile?.id ) {

        errorsCount++;

        console.log("User vs profile incongruency", errorsCount);

        if(!profile || profile.id > user.uid) {

          // Tracks the user with a missing profile
          missing.push( user );

          console.log("User " + user.uid + " does not have a profile");

        } else if(profile.id < user.uid ) {

          // Tracks the profile without a user
          orphans.push( profile );

          console.log("Profile " + profile.id + " does not match any user");
        }
      }
    });

    for(let i = users.length - missing.length + orphans.length; i < profiles.length; i++) {
      errorsCount++; orphans.push( profiles[i] );
    }

    return { users, missing, profiles, orphans, errorsCount };
  }
*/
  private analyzeProfiles(report: UserReport) {

    const incongruencies: { [key:string]: number } = report['incongruencies'] = {};

    report.profiles.forEach( profile => {

      if(!profile.userName) { 
        
        incongruencies.userName = (incongruencies['userName'] || 0) + 1; 
        report.errorsCount++;
      }

      if(!profile.name) { 
        
        incongruencies.name = (incongruencies['name'] || 0) + 1; 
        report.errorsCount++;
      }

      if(!profile.searchIndex) { 
        
        incongruencies.searchIndex = (incongruencies['searchIndex'] || 0) + 1; 
        report.errorsCount++;
      }
      else {

        const { searchIndex } = this.users.me.formatData({ lastName: '', ...profile });

        if(searchIndex.length !== profile.searchIndex.length || searchIndex.some( (value, index) => value !== profile.searchIndex[index])) {

          incongruencies.searchIndexMismatch = (incongruencies['searchIndexMismatch'] || 0) + 1; 
          report.errorsCount++;
        }
      }

      if(profile.motto && !profile.bio) {

        incongruencies.bio = (incongruencies['bio'] || 0) + 1; 
        report.errorsCount++;
      }
    });

    return report;
  }

  public createMissingProfile(user: any, report: UserReport) {

    const index = report.missing.findIndex( missing => missing === user);
    if(index < 0) { return Promise.resolve(); }

    return this.users.document(user.uid).set( this.users.me.userData(user) ).then( () => { 

      report.missing.splice(index, 1); 
    });
  }

  public deleteOrphanProfile(profile: UserData, report: UserReport) {

    const index = report.orphans.findIndex(orphan => orphan === profile);
    if(index < 0) { return Promise.resolve(); }

    return this.users.document(profile.id).delete().then(() => {

      report.orphans.splice(index, 1); 
    });
  }

  public fixProfileInconguencies

  public fixAllAnomalies(report: UserReport) {

    if(report.missing?.length > 0) {

      const createMissingProfiles = (report: UserReport) => {

        if(report.missing.length <= 0 ) { return; }

          this.createMissingProfile(report.missing[0], report)
            .then( () => createMissingProfiles(report) );
      }

      createMissingProfiles(report);
    }

    if(report.orphans?.length > 0) {

      const deleteOrhpanProfiles = (report: UserReport) => {

        if(report.orphans.length <= 0 ) { return; }

          this.deleteOrphanProfile(report.orphans[0], report)
            .then( () => deleteOrhpanProfiles(report) );
      }

      deleteOrhpanProfiles(report);
    }
  }
}
