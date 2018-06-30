import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DatabaseService, dbDocument } from '../database/database.service';
import { wmProject, wmApplication, wmDevelopment } from './data-model';
export { wmProject, wmApplication, wmDevelopment } from './data-model';

import { Observable, of } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private ref: dbDocument<wmProject> = null;

  constructor(private auth: AuthService,
              private db: DatabaseService) {
  }

  public doesProjectExists(name: string): Promise<boolean> {
    
    // Query the projects collection searching for a matching name
      return this.db.col<wmProject>('projects', ref => ref.where('name', '==', name.toLowerCase()) ) 
      .valueChanges().pipe(
        //debounceTime(500),
        take(1),
        map(arr => arr.length > 0),
      ).toPromise();
  }

  public addProject(data: wmProject): Promise<boolean> {

    const owner = this.auth.userId;
    return this.db.add<wmProject>('/projects', { ...data, owner })
      .then( ref => {
        return (this.ref = ref) != null;
      });
  }

  public updateProject(data: wmProject): Promise<void> {

    if(this.ref === null) {
      return Promise.reject('ref == null');
    }

    return this.db.merge<wmProject>(this.ref, data);
  }

  public renameProject(name: string): Promise<void> {
    return this.updateProject({ name: name } as wmProject);
  }

  public queryProject(ref: string | dbDocument<wmProject>): Observable<wmProject> {

    return this.db.docWithId$(ref).pipe(
      tap( () => this.ref = ref)
    );
  }
}
