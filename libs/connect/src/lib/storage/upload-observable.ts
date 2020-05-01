import { UploadTask, UploadTaskSnapshot } from './storage.service';
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';

export class UploadObservable extends Observable<UploadTaskSnapshot> {

  private _task: UploadTask;

  /** Returns the task reference creating it when necessary */
  public get task(): UploadTask {
    return !this._task ? ( this._task = this.factory() ) : this._task; 
  }

  /** Constructs an UploadTask cold observable */
  constructor(private factory: () => UploadTask, zone: NgZone) {
    // Builds the uploading observable hooking on the 'state_changed' observer. Since task creation is delegated to the 
    // factory function this result being a cold observable (upload starts upon subscription)
    super( sub => this.task.on('state_changed',
      // Runs the observable within the Angular's zone
      snap => zone.run( () => sub.next(snap) ),
      // Runs the observable within the Angular's zone
      error => zone.run( () => sub.error(error) ), 
      // Runs the observable within the Angular's zone
      () => zone.run( () => sub.complete() )
    ));

    if(typeof factory !== "function") { 
      throw new Error('The UploadObservable task factory must be a function'); 
    };
  }

  /** Pauses the task */
  public pause(): boolean { return this.task.pause(); }
  /** Resumes the task */
  public resume(): boolean { return this.task.resume(); }
  /** Cancels the task */
  public cancel(): boolean { return this.task.cancel(); }

  /** Promise-like then */
  public then(fulfilled?: ((s: UploadTaskSnapshot) => any) | null, rejected?: ((e: Error) => any) | null): Promise<any> {
    return this.task.then(fulfilled, rejected);
  }
  /** Promise-like catch */
  public catch(rejected: (e: Error) => any): Promise<any> {
    return this.task.catch(rejected);
  }
}