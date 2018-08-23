import { Injectable, Inject } from '@angular/core';
import { DatabaseService, QueryFn } from '../database/database.service';
import { USER_PROFILE, wmUser, wmProject } from '../core-data';
import { Observable, of } from 'rxjs';
import { map, take, debounceTime, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(@Inject(USER_PROFILE) 
              private profile  : wmUser,
              private database : DatabaseService) {
  }

  public get userId(): string { return this.profile.id; }

  public isProjectMine(project: wmProject) : boolean {
    return typeof project.owner === 'string' ?
      project.owner === this.userId :
        project.owner.id === this.userId;
  }

  public listProjects(queryFn? : QueryFn): Observable<wmProject[]> {
    return this.database.colWithIds$<wmProject>('/projects', queryFn);
  }

  public listOwnProjects(queryFn? : QueryFn): Observable<wmProject[]> {
    return this.listProjects( ref => 
      queryFn ? queryFn( ref.where('owner', '==', this.userId) ): 
                         ref.where('owner', '==', this.userId) );
  }

  public doesProjectExists(name: string): Promise<boolean> {
    
    // Query the projects collection searching for a matching lowerCaseName
    return this.database.col$<wmProject>('projects', ref => {
        return ref.where('lowerCaseName', '==', name.trim().toLowerCase());
      } 
    ).pipe(
      debounceTime(500),
      take(1),
      map(arr => arr.length > 0),
    ).toPromise();
  }

  // Helper to snitize the Project's data payload
  private sanitizeData(data: any): any {

    // Trims the name and creates a lower case version of it for searching purposes 
    if(data.name) {
      data.name = data.name.trim();
      data['lowerCaseName'] = data.name.toLowerCase();
    }

    // Makes sure data payload always specifies the owner as a string
    // Note that queryProject fills the owner field with the wmUser
    // object, so, this ensure eventual updates do not corrupt the db
    return { ...data, owner: this.userId };
  }

  public addProject(data: wmProject): Promise<string> {

    // Adds a new project returning the corresponding id 
    return this.database.add<wmProject>('/projects', this.sanitizeData(data) );
  }

  public updateProject(data: wmProject): Promise<void> {

    // Updates the existing project
    return data.id ? 
      this.database.merge<wmProject>(`/projects/${data.id}`, this.sanitizeData(data) ) :
        Promise.reject('project/invalidId');
  }

  public queryProject(id: string): Observable<wmProject> {

    // Query for the project coming with the requested id
    return id ? this.database.docWithId$<wmProject>(`/projects/${id}`).pipe(

      // Query for the project owner too
      mergeMap( project => 
        this.database.docWithId$<wmUser>(`/users/${project.owner}`).pipe( 
          map( owner => { return { ...project, owner } as wmProject;})
        )
      )
    ) : of(null);
  }

  public deleteProject(ref: string | wmProject): Promise<void> {

    let id = typeof ref === 'string' ? ref : ref.id;
    
    // Deletes the project coming with the requested id
    return id ? this.database.delete(`/projects/${id}`) :
      Promise.reject('project/invalidId');
  }
}
