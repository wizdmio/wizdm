import { Injectable } from '@angular/core';
import { wmUser, wmProject } from '../interfaces';
import { DatabaseService, QueryFn } from '../database/database.service';
import { UserProfile } from '../user/user-profile.service';
import { PagedCollection } from '../database/database-page.class';
import { Observable, BehaviorSubject, of, merge } from 'rxjs';
import { tap, map, take, filter, debounceTime } from 'rxjs/operators';
import { Project } from './project.class';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  // The full collection of projects (paged)
  private _projects$: PagedCollection<wmProject>;

  // Public observable exposing the full list of projects
  public projects$: Observable<wmProject[]>;

  // Private loading subject
  private _loading$ = new BehaviorSubject<boolean>(false);

  // Public loading observable to display loading status
  public loading$: Observable<boolean>;

  constructor(private profile  : UserProfile,
              private database : DatabaseService) {

    // Initialize the private paged collection for internal use
    this._projects$ = this.database.pagedCollection$('projects', { 
      // Pass along the postProcess operator to resolve owners while paging projects
      postProcess: this.resolveOwners.bind(this)
    });

    // Combines the pagination loading status with the local one
    this.loading$ = merge(
      // Paged collection sets the loading (resets are filtered)
      this._projects$.loading$.pipe( filter( value => value ) ),
      // Project local subject resets the loading status
      this._loading$.asObservable()
    );

    // Created the projects as a paged observable resolving owners
    this.projects$ = this._projects$.data$;
  }

  // Pagination support
  public more(): void { this._projects$.more();}
  public reset(): void { this._projects$.reset();}

  // Current user id
  public get userId(): string { return this.profile.id; }

  /**
   * Checks if a specific projects belong to the current user
   * @param project the project to verify
   */
  public isProjectMine(project: wmProject) : boolean {
    return project.owner === this.profile.id;
  }

  /**
   * Verifies if a project with the specified name already exists
   * @param name name of the project
   */
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

  // Adds a new project returning the corresponding id 
  public addProject(data: wmProject): Promise<string> {
    return this.database.add<wmProject>('/projects', this.sanitizeData(data) );
  }

  // Updates the existing project
  public updateProject(data: wmProject): Promise<void> {
    return data.id ? 
      this.database.merge<wmProject>(`/projects/${data.id}`, this.sanitizeData(data) ) :
        Promise.reject('project/invalidId');
  }

  // Load the owner corresponding to the specified project
  public loadOwner(project: wmProject): Observable<wmUser> {
    return !this.isProjectMine(project) 
      ? this.database.document$<wmUser>(`/users/${project.owner}`)
        .pipe( take(1) )
          : of(this.profile);
  }

  // Quesy for a single specific project
  public queryProject(ref: string | wmProject): Observable<Project> {

    let id = typeof ref === 'string' ? ref : ref.id;

    // Query for the project coming with the requested id
    return id ? this.database.document$<wmProject>(`/projects/${id}`)
      // Turns it into a Project object extending wmProject
      .pipe( map( project => new Project(this, project) ))
        : of(null);
  }

  // rxjs operator to resolve owners on a Observable<wmProject[]> stream
  private resolveOwners(): (input: Observable<wmProject[]>) => Observable<Project[]> {
    return map( projects => projects.map( project => new Project(this, project) ));
  }

  // Query function to filter my own projects only
  private get myOwmProjects(): QueryFn {
    return ref => ref.where('owner', '==', this.profile.id);
  }

  public queryOwnProjects(): Observable<Project[]> {
    
    // Sets the loading status
    this._loading$.next(true);

    // Query for all the project with the owner corresponding to the current user
    return this.database.collection$<wmProject>('/projects', this.myOwmProjects )
      .pipe( 
        
        // Resolve the project owners
        this.resolveOwners(), 
        
        // Resets the loading status
        tap( () => this._loading$.next(false) ) 
      );
  }

  public deleteProject(ref: string | wmProject): Promise<void> {

    let id = typeof ref === 'string' ? ref : ref.id;
    
    // Deletes the project coming with the requested id
    return id ? this.database.delete(`/projects/${id}`) :
      Promise.reject('project/invalidId');
  }
}
