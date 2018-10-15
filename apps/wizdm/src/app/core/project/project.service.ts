import { Injectable } from '@angular/core';
import { ContentManager } from '@wizdm/content';
import { DatabaseService, PagedCollection, PageConfig, dbStreamFn, UserProfile, wmUser } from '@wizdm/connect';
import { Observable, BehaviorSubject, of, from, merge } from 'rxjs';
import { tap, map, take, filter, debounceTime } from 'rxjs/operators';
import { Project, wmProject } from './project';
export { Project, wmProject } from './project';

export interface wmApplication {

  name?          : string, // Application name
  pitch?         : string, // Elevator pitch
  description?   : string, // Background description
  revenues?      : string, // Revenue streams
  players?       : string, // Other similar players
  differences?   : string, // Uniquenesses
  users?         : string, // Target users
  target?        : string, // Target market (geo, ...)
  comments?      : string  // Additional comments
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends PagedCollection<wmProject> {

  private userUnknown: wmUser;

  constructor(db: DatabaseService, private content: ContentManager, readonly profile: UserProfile) {
    super(db, '/projects');

    // Loads the localized unknown user object
    this.userUnknown = this.content.select('project.userUnknown');
  }

  // Current user id
  public get userId(): string { return this.profile.id; }

  /**
   * Checks if a specific projects belong to the current user
   * @param project the project to verify
   */
  public isProjectMine(project: wmProject): boolean {
    return project.owner === this.profile.id;
  }

  public resolveOwner(project: wmProject): Observable<wmUser> {
    
    // Short-circuit in case the owner is the current user
    if( project.owner === this.profile.id ) {
      return of(this.profile.data);
    }

    // Load the owner otherwise filling up the content with an 'unkown' user when missing
    return this.db.document<wmUser>('/users', project.owner)
      .get().pipe( map( data => data || this.userUnknown ) );
  }

  /**
   * Verifies if a project with the specified name already exists
   * @param name name of the project
   */
  public doesProjectExists(name: string): Promise<boolean> {
    
    // Query the projects collection searching for a matching lowerCaseName
    return this.stream(ref => {
        return ref.where('lowerCaseName', '==', name.trim().toLowerCase());
    }).pipe(
      debounceTime(500),
      take(1),
      map(arr => arr.length > 0),
    ).toPromise();
  }

  // Helper to snitize the Project's data payload
  public sanitizeData(data: any): any {

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

  public project(id: string): Project {
    return new Project(this, { id } as wmProject);
  }

  public addProject(data: wmProject): Promise<Project> {
    return super.add( this.sanitizeData(data) )
      .then( doc => {
        return this.project(doc.id);
      });
  }

  public browseAll(opts?: PageConfig): Observable<Project[]> {

    // Re-initzialize the page configuration
    if(!!opts) { this.config = this.init(opts);}

    // Returns a paged stream mapping the output to Project[]
    return this.streamPage<Project>(
      map( (projects: wmProject[]) => {
        return projects.map( project => {
          return new Project(this, project);
        }); 
      })
    );
  }

  // Query function to filter my own projects only
  private get myOwmProjects(): dbStreamFn {
    return ref => ref.where('owner', '==', this.profile.id);
  }

  public loadMine(): Observable<Project[]> {

    return this.get(this.myOwmProjects)
      .pipe( map( projects => {
        return projects.map( project => {
          return new Project(this, project);
        });
      }));
  }

  // Creates a project instance starting from the given application context
  public apply(application: wmApplication, template: any, comments?: any): Promise<Project> {

    // Build a context object combining the given application, 
    // containing the user answers given during the application 
    // proces, and optional additional comments (localized)
    const context = { ...comments, application };

    // Store a new project creating the content from the applicaton
    return this.addProject( {

      status: 'draft',
      // Project name inherited from the applciation
      name: application.name,
      // Elevator pitch inherited from the applciation
      pitch: application.pitch,
      // Document created from the template and the given application 
      document: template.replace(/<\s*([\w.]+)\s*>/g, (_, selector) => {
        // Replaces the <comma.separated.selectors> found into the template 
        // with the content coming from the context object
        return (selector.select(context) || selector).interpolate(context);
      })

    } as wmProject );
  }
}
