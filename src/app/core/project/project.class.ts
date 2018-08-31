import { wmUser, wmProject, wmProjectStatus } from '../interfaces';
import { dbDocument, Timestamp } from '../database/database.service';
import { ProjectService } from './project.service';
import { Observable } from 'rxjs';

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
  public created   : Timestamp;
  public updated   : Timestamp;

  // Extends wmProject
  public owner$ : Observable<wmUser>;
  
  constructor(private db: ProjectService, source: wmProject) {
    
    Object.assign(this, source);

    this.owner$ = db.loadOwner(source);
  }

  public isMine(): boolean {
    return this.db.isProjectMine(this);
  }

  public update(data: wmProject): Promise<void> {
    return this.db.updateProject({ ...data, id: this.id });
  }

  public delete(data: wmProject): Promise<void> {
    return this.db.deleteProject({ ...data, id: this.id });
  }
}