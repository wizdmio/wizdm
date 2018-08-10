import { Injectable } from '@angular/core';
import { AuthService, wmUser } from '../auth/auth.service';
import { DatabaseService, dbDocument, QueryFn, Timestamp } from '../database/database.service';
import { wmProject, wmApplication, wmDevelopment } from './data-model';
export { wmProject, wmApplication, wmDevelopment } from './data-model';

import { Observable, of } from 'rxjs';
import { filter, map, tap, take, debounceTime, switchMap, mergeMap } from 'rxjs/operators';
/*
import * as moment from 'moment';

export class WMProject {
  
  constructor(public data: wmProject, private factory: ProjectService) { }

  // Internal timestamp conversion helpers
  private tsToNumber(ts: Timestamp) { return ts ? ts.toMillis() : 0;}
  private tsToDate(ts: Timestamp) { return ts ? ts.toDate() : new Date(null);}
  private tsToMoment(ts: Timestamp): moment.Moment { return ts ? moment( ts.toDate() ) : moment();}

  // Ownership helper
  get isMine(): boolean { return this.data.owner === this.factory.userId;}

  // Timestamp helpers
  get created()   : Date { return this.tsToDate(this.data.created);}
  get createdN()  : number { return this.tsToNumber(this.data.created);}
  get createdM()  : moment.Moment { return this.tsToMoment(this.data.created);}
  get modified()  : Date { return this.tsToDate(this.data.updated);}
  get modifiedN() : number { return this.tsToNumber(this.data.updated);}
  get modifiedM() : moment.Moment { return this.tsToMoment(this.data.updated);}

  // Project management functions
  public delete() : Promise<void> { return this.factory.deleteProject(this.data.id);}
}
*/
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  public currentId: string = null;

  constructor(private auth: AuthService,
              private db:   DatabaseService) {
  }

  public get userId(): string { return this.auth.userId;}

  public isProjectMine(project: wmProject) : boolean {
    return typeof project.owner === 'string' ?
      project.owner === this.userId :
        project.owner.id === this.userId;
  }

  public listProjects(queryFn? : QueryFn): Observable<wmProject[]> {
    return this.db.colWithIds$<wmProject>('/projects', queryFn);/*.pipe( 
      map( a => a.map( w => new WMProject(w, this) ))
    );*/
  }

  public listOwnProjects(queryFn? : QueryFn): Observable<wmProject[]> {
    return this.listProjects( ref => 
      queryFn ? queryFn( ref.where('owner', '==', this.userId) ): 
                         ref.where('owner', '==', this.userId) );
  }

  public doesProjectExists(name: string): Promise<boolean> {
    
    // Query the projects collection searching for a matching lowerCaseName
    return this.db.col$<wmProject>('projects', ref => {
        return ref.where('lowerCaseName', '==', name.toLowerCase());
      } 
    ).pipe(
      debounceTime(500),
      take(1),
      map(arr => arr.length > 0),
    ).toPromise();
  }

  // Helper to formst the data payload
  private formatData(data: any): any {

    // Trims the name and creates a lower case version of it for searching purposes 
    if(data.name) {
      data.name = data.name.trim();
      data['lowerCaseName'] = data.name.toLowerCase();
    }

    // Makes sure data payload always specifies the owner
    return { ...data, owner: this.userId };
  }

  public addProject(data: wmProject): Promise<void> {

    // Adds a new project
    return this.db.add<wmProject>('/projects', this.formatData(data) )
      // Updates the current id
      .then( ref => { this.currentId = ref && ref.ref && ref.ref.id;});
  }

  public updateProject(data: wmProject): Promise<void> {

    // Updates the existing project
    return this.currentId !== null ? 
      this.db.merge<wmProject>(`/projects/${this.currentId}`, this.formatData(data) ) :
        Promise.reject("currentId is null or invalid");
  }

  public queryProject(id?: string): Observable<wmProject> {

    if(id || this.currentId) {

      // Query for the project coming with the requested id
      return this.db.docWithId$<wmProject>(`/projects/${id || this.currentId}`).pipe(

        // Query for the project owner too
        mergeMap( project => 
          this.db.docWithId$<wmUser>(`/users/${project.owner}`).pipe( 
            map( owner => { return { ...project, owner } as wmProject;})
          )
        ),

        // Updates the current id
        tap( project => { this.currentId = project.id;})
      );
    }

    return of(null);
  }

  public deleteProject(id?: string): Promise<void> {
    
    // Deletes the project coming with the requested id
    return id || this.currentId ?
      this.db.delete(`/projects/${id || this.currentId}`)
        .then( () => { this.currentId = null; }) :
          Promise.reject('both id and currentId as null or invalid');
  }
}
