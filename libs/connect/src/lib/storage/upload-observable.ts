import { UploadTask, UploadTaskSnapshot } from './storage.service';
import { shareReplay } from 'rxjs/operators';
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';

export class UploadObservable extends Observable<UploadTaskSnapshot> {

  private _inner$: Observable<UploadTaskSnapshot>;
  private _task: UploadTask;

  /** Returns the task reference creating it when necessary */
  public get task(): UploadTask {
    return !this._task ? ( this._task = this.factory() ) : this._task; 
  }

  /** Returns teh current state's snapshot */
  public get snapshot(): UploadTaskSnapshot {
    return this.task.snapshot;
  }

  /** Constructs an UploadTask cold observable */
  constructor(private factory: () => UploadTask, readonly zone: NgZone) {
    // Builds the uploading observable subscribing to the inner observer
    super( subscriber => this._inner$.subscribe(subscriber) );

    // Builds the inner observable hooking on the 'state_changed' observer. 
    // Since task creation is delegated to the factory function this result being 
    // a cold observable (upload starts upon subscription)
    this._inner$ = new Observable<UploadTaskSnapshot>(subscriber => this.task.on('state_changed',
      // Runs the observable within the Angular's zone
      snap => zone.run( () => subscriber.next(snap) ),
      // Runs the observable within the Angular's zone
      error => zone.run( () => subscriber.error(error) ), 
      // Runs the observable within the Angular's zone
      () => zone.run( () => subscriber.complete() )
      // Shares the same observable to all subscribers replaying the latest value
      // for everyone to likely get a meaingful value no matter how late they subscribe
    )).pipe( shareReplay(1) );

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