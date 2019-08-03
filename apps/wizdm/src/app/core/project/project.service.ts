import { Injectable } from '@angular/core';
import { DatabaseService, PagedCollection, UserProfile } from '@wizdm/connect';
import { map, take, debounceTime } from 'rxjs/operators';
import { ProjectWrapper, wmProject } from './project-wrapper';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends PagedCollection<wmProject> {

  constructor(db: DatabaseService, readonly profile: UserProfile) {
    super(db, '/projects');
  }

  // Current user id
  public get userId(): string { return this.profile.id; }

  /**
   * Verifies if a project with the specified name already exists
   * @param name name of the project
   */
  public doesProjectExists(name: string): Promise<boolean> {
    // Query the projects collection searching for a matching lowerCaseName
    return this.stream(ref => ref.where('lowerCaseName', '==', name.trim().toLowerCase()) )
      .pipe(
        debounceTime(500),
        take(1),
        map(arr => arr.length > 0),
      ).toPromise();
  }

  // Helper to sanitize the Project's data payload
  public sanitizeData(data: any): any {
    // Trims the name and creates a lower case version of it for searching purposes 
    if(!!data.name) {
      data.name = data.name.trim();
      data.lowerCaseName = data.name.toLowerCase();
    }
    // Makes sure the data payload always specifies the author
    data.author = this.userId;
    // Returns the very same object instance
    return data;
  }

  public project(id: string): ProjectWrapper {
    return new ProjectWrapper(this, id);
  }

  public addProject(data: wmProject): Promise<string> {
    return this.add( this.sanitizeData(data) )
      .then( doc => doc.id );
  }

  public getProject(id: string): Promise<wmProject> {
    return this.document(id).get().toPromise();
  }
}
