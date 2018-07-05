import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DatabaseService, dbDocument, QueryFn } from '../database/database.service';
import { wmProject, wmApplication, wmDevelopment } from './data-model';
export { wmProject, wmApplication, wmDevelopment } from './data-model';

import { Observable, of } from 'rxjs';
import { filter, map, tap, take, debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private currentRef: dbDocument<wmProject> = null;
  private currentId:  string = null;

  constructor(private auth: AuthService,
              private db:   DatabaseService) {
  }

  get owner() {
    return this.auth.userId;
  }

  public listProjects(queryFn? : QueryFn): Observable<wmProject[]> {
    return this.db.colWithIds$<wmProject>('/projects', queryFn);
  }

  public doesProjectExists(name: string): Promise<boolean> {
    
    // Query the projects collection searching for a matching name
    // excluding the currentId to avoid false positive
    return this.db.col$<wmProject>('projects', ref => {
        return ref.where('name', '==', name.toLowerCase())
                  //.where(this.db.sentinelId, '<', this.currentId)
                  //.where(this.db.sentinelId, '>', this.currentId)
      } 
    ).pipe(
      debounceTime(500),
      take(1),
      map(arr => arr.length > 0),
    ).toPromise();
  }

  public addProject(data: wmProject): Promise<boolean> {

    const owner = this.auth.userId;
    return this.db.add<wmProject>('/projects', { ...data, owner })
      .then( ref => {
        this.currentId = (ref ? (ref.ref ? ref.ref.id : null) : null);
        return (this.currentRef = ref) != null;
      });
  }

  public updateProject(data: wmProject): Promise<void> {

    if(this.currentRef === null) {
      return Promise.reject('ref == null');
    }

    return this.db.merge<wmProject>(this.currentRef, data);
  }

  public updateApplication(data: wmApplication): Promise<void> {
    return this.updateProject({ application: {...data} } as wmProject);
  }

  public renameProject(name: string): Promise<void> {
    return this.updateProject({ name: name } as wmProject);
  }

  public queryProject(ref?: string): Observable<wmProject> {

    if(ref || this.currentId) {

      return this.db.docWithId$<wmProject>(ref = `/projects/${ref || this.currentId}`).pipe(
        tap( doc => {
          this.currentId = doc.id;
          this.currentRef = ref;
        })
      );
    }

    return of(null);
  }

  public deleteProject(): Promise<void> {
    
    if(this.currentRef === null) {
      return Promise.reject('ref == null');
    }

    return this.db.delete(this.currentRef)
      .then( () => this.currentId = null);
  }
}
