import { wmUser, wmProject, wmProjectStatus } from '../interfaces';
import { dbTimestamp, DistributedCounter } from '../database/database.service';
import { ProjectService } from './project.service';
import { Observable, of } from 'rxjs';

export class Project implements wmProject {

  // Implements wmProject
  public id        : string;
  public name      : string;
  public pitch     : string;
  public status    : wmProjectStatus;
  public owner     : string;
  public cover     : string;
  public color     : string;
  public document  : string; // markdown formatted business plan description
  public created   : dbTimestamp;
  public updated   : dbTimestamp;

  // Extends wmProject
  public owner$ : Observable<wmUser>;
  public likes  : DistributedCounter;
  
  constructor(private db: ProjectService, source: wmProject) {
  
    // Copies the wmProject properties first
    Object.assign(this, source);

    // Load the owner info as an observable
    this.owner$ = this.db.loadOwner(source);

    // Creates/connects to the share
    this.likes = this.db.likesCounter(source);
  }

  public get isMine(): boolean {
    return this.db.isProjectMine(this);
  }

  public update(data: wmProject): Promise<void> {
    return this.db.updateProject({ ...data, id: this.id });
  }

  public delete(data: wmProject): Promise<void> {
    return this.db.deleteProject({ ...data, id: this.id });
  }
}