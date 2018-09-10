import { DatabaseDocument, DistributedCounter, dbCommon } from '../database/database.service';
import { wmUser } from '../user/user-profile.service';
import { ProjectService } from './project.service';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

export type wmProjectStatus = 'submitted' | 'evaluation' | 'accepted' | 'rejected' | 'completed' | 'draft' | 'deleted';

export interface wmProject extends dbCommon {
  
  name         : string,
  pitch?       : string,
  status?      : wmProjectStatus,
  owner?       : string,
  cover?       : string,
  color?       : string,
  document?    : string, // markdown formatted business plan description
  
  //team?        : string[] | wmUser[], collection of users
  //development? : wmDevelopment,
}
/*
export interface wmDevelopment {

  repositoryLink?: string,
  productionLink?: string,
  webLink?       : string
}

export interface wmProjectLog {

  status : wmProjectStatus,
  comment: string,
  user   : string,
  time   : any
}
*/
export class Project extends DatabaseDocument<wmProject> {

  // Contains wmProject data
  public data: wmProject = <wmProject>{};

  // Extends wmProject
  public owner$ : Observable<wmUser>;
  public likes  : DistributedCounter;
  
  constructor(private ps: ProjectService, source: wmProject) {
    super(ps.db, '/projects', source.id);
    this.assing(source);
  }

  public assing(source: wmProject): Project {
    // Assigns the document id first 
    this.id = source.id;
    // Copies the wmProject data
    this.data = source;
    // Resolve the owner profile as an observable
    this.owner$ = this.resolveOwner();
    // Creates/connects to the ikes counter
    this.likes = this.counter('likes');
    return this;
  }

  public get isMine(): boolean {
    return this.ps.isProjectMine(this.data);
  }

  public resolveOwner(): Observable<wmUser> {
    return this.ps.resolveOwner(this.data);
  }

  public getProject(): Observable<Project> {
    return this.get()
      .pipe( map( project => {
        return new Project(this.ps, project);
      }));
  }

  public streamProject(): Observable<Project> {
    return this.stream()
      .pipe( map( project => { 
        return new Project(this.ps, project); 
      }));
  }

  // Forces the data to be fully reloaded from the database
  public reload(): Observable<Project> {
    return this.get()
      .pipe( map( project => {
        return this.assing(project);
      }));
  }

  // Updates the database contents making sure to update the buffered copy as well
  public update(data: wmProject): Promise<void> {

    // Sanitizes the new data
    const sanitized = this.ps.sanitizeData(data);

    // Updates the local buffered copy
    this.data = { ...this.data, ...sanitized };

    // Updates the database
    return super.update( sanitized );
  }

  public delete(): Promise<void> {

    this.data = null;

    return super.delete()
      .then(() => this.likes.wipe() );
  }
}