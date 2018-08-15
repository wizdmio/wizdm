import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import { ContentService, AuthService } from 'app/core';
import { ToolbarService, ActionEnabler } from 'app/navigator';
import { OpenFileComponent, PopupService } from 'app/shared';
import { Observable } from 'rxjs';
import { filter, take, map, tap } from 'rxjs/operators';

interface task {
  
  id:       number;
  snapshot: Observable<any>;
  progress: Observable<number>;
  done:     boolean;
}

@Component({
  selector: 'wm-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  @ViewChild(OpenFileComponent) openFile: OpenFileComponent;
  @ViewChild(MatSelectionList) fileList: MatSelectionList;

  private enableDelete$: ActionEnabler;
  public uploads: Observable<any[]>;
  public tasks: task[] = [];

  //public progress: Observable<number>;
  //public snapshot: Observable<any>;
  
  public msgs;
  
  constructor(private content : ContentService, 
              private toolbar : ToolbarService,
              private auth    : AuthService,
              private popup   : PopupService) {

    // Gets the localized content
    this.msgs = this.content.select('upload');
  }

  ngOnInit() {

    // Gets the user uploads observable
    this.uploads = this.auth.getUserUploads( ref => ref.orderBy('created') )
      // Disposes completes upload tasks on list change
      .pipe( tap( () => this.disposeTasks() ));

    // Activates the toolbar actions
    this.toolbar.activateActions(this.msgs.actions)
      .subscribe( code => this.executeAction(code) );

    // Gets the action enabler for 'delete' action code
    this.enableDelete$ = this.toolbar.actionEnabler('delete');
    this.enableDelete$.enable(false);
  }

  public selectionChange(change: MatSelectionListChange): void {

    // Enables / disables the delete action upon list selection
    this.enableDelete$.enable( change.source.selectedOptions.hasValue() );
  }

  private executeAction(code: string): void {
    
    switch(code) {

      case 'upload':
      this.openFile.show();
      break;

      case 'delete':
      // Ask for confirmation prior to start deleting
      this.popup.confirmPopup(this.msgs.canDelete)
        .subscribe( () => this.deleteSelection() );
      break;
    }
  }

  private disposeTasks(): void {

    this.tasks = this.tasks.filter( task => {

      if(task.done){
        delete task.progress;
        delete task.snapshot;
        return false;
      }
      return true;
    });
  }

  private completeTask(id: number): void {

    let index = this.tasks.findIndex( value => value.id === id);
    if( index >= 0 ) {
      this.tasks[index].done = true;
    }
  }
 
  public upload(list: FileList, start: number = 0): void {
    
    // The File object
    const file = list.item(start);
    
    // Check for file type
    if(file.type.split('/')[0] !== 'image') { 
      console.error('Unsupported file type')
      return;
    }

    // Recurs with the next file in the list when needed
    if(start < list.length - 1) {
      this.upload(list, start + 1);
    }

    // Create the upload task 
    let task = this.auth.uploadUserFile(file);

    // Progress monitoring (subscription happens in the view)
    let progress = task.percentageChanges();

    // Snapshot (subscription happens in the view) patched with the original file name
    let snapshot = task.snapshotChanges().pipe( map( snap => { return { ...snap, fileName: file.name };}) );

    // Pushes the task into the stack
    let id = this.tasks.push({ progress, snapshot, id: this.tasks.length, done: false }) - 1;

    // Intercepts the upload completion and mark the task for disposal
    snapshot.pipe( filter( snap => snap.bytesTransferred === snap.totalBytes ), take(1) )
      .subscribe( () => this.completeTask(id) );
  }

  private deleteSelection(): void {

    if(this.fileList && this.fileList.selectedOptions.hasValue()) {

      // Gets the list of selected files
      let list = this.fileList.selectedOptions.selected;

      // Deletes the selected files
      list.forEach( file => this.auth.deleteUserFile(file.value.id) );

      // Disables the delete action
      this.enableDelete$.enable(false);
    }
  }
}
