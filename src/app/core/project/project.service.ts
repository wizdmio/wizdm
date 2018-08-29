import { Injectable, Inject } from '@angular/core';
import { DatabaseService, QueryFn } from '../database/database.service';
import { PagedCollection } from '../database/database-page.class';
import { USER_PROFILE, wmUser, wmProject } from '../interfaces';
import { Observable, BehaviorSubject, of, merge, forkJoin } from 'rxjs';
import { tap, map, take, filter, debounceTime, switchMap, mergeMap } from 'rxjs/operators';

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

  constructor(@Inject(USER_PROFILE) 
              private profile  : wmUser,
              private database : DatabaseService) {

    // Initialize the private paged collection for internal use
    this._projects$ = this.database.pagedCollection$('projects');

    // Combines the pagination loading status with the local one
    this.loading$ = merge(
      // Paged collection sets the loading (resets are filtered)
      this._projects$.loading$.pipe( filter( value => value ) ),
      // Project local subject resets the loading status
      this._loading$.asObservable()
    );

    // Created the projects as a paged observable including owners
    this.projects$ = this._projects$.data$
      .pipe( 
        // Query for the projects' owners  
        mergeMap( projects => 
          // Runs the owner's requests in parallel
          forkJoin( projects.map( project => 
            this.database.document$<wmUser>(`/users/${project.owner}`).pipe(
              // Inner map to merge the owner into the project
              map( owner => { return { ...project, owner } as wmProject; }), 
              take(1) // Gets a single snapshot of the user
            )
          ))
        ),
        // Resets the loading status when completed
        tap( () => this._loading$.next(false) )
      );
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
    return typeof project.owner === 'string' ?
      project.owner === this.profile.id :
        project.owner.id === this.profile.id;
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
    return id ? this.database.document$<wmProject>(`/projects/${id}`)
      // Query for the project owner too
      .pipe( switchMap( project => 
        this.database.document$<wmUser>(`/users/${project.owner}`).pipe( 
          // Inner map to merge the owner into the project
          map( owner => { return { ...project, owner } as wmProject;})
        )
      )
    ) : of(null);
  }

  private get myOwmProjects(): QueryFn {
    return ref => ref.where('owner', '==', this.profile.id);
  }

  public queryOwnProjects(): Observable<wmProject[]> {
    
    // Sets the loading status
    this._loading$.next(true);

    // Query for all the project with the owner corresponding to the current user
    return this.database.collection$<wmProject>('/projects', this.myOwmProjects )
      .pipe(
        // Fill-up the oner with the current user profile
        map( projects => 
          projects.map( project => { 
            return { ...project, owner: this.profile }; 
          }) 
        ), 
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
