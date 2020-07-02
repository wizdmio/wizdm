import { PagedCollection } from '@wizdm/connect/database/paged-collection';
import { UserProfile } from 'app/utils/user-profile';
import { DatabaseService } from '@wizdm/connect/database';
import { map, take, debounceTime } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends PagedCollection<any> {

  constructor(db: DatabaseService, readonly user: UserProfile) {
    super(db, db.col('/projects'));
  }

  // Current user id
  public get userId(): string { return this.user.id; }

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

  public project(id: string): this {
    return null;//new ProjectWrapper(this, id);
  }

  public addProject(data: any): Promise<string> {
    return this.add( this.sanitizeData(data) )
      .then( doc => doc.id );
  }

  public getProject(id: string): Promise<any> {
    return this.document(id).get();
  }
}
