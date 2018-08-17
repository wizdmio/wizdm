import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import { ContentService, AuthService, wmUserFile } from 'app/core';
import { ToolbarService, ActionEnabler } from 'app/navigator';
import { OpenFileComponent, PopupService } from 'app/shared';
import { Observable } from 'rxjs';
import { filter, take, map, tap } from 'rxjs/operators';

interface UploadTask {
  
  id:       number;
  snapshot: Observable<any>;
  //progress: Observable<number>;
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
  public tasks: UploadTask[] = [];
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
      // Disposes completed upload tasks on list change
      .pipe( tap( files => this.disposeTasks() ));

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

  // Disposes all the tasks marked as done
  private disposeTasks(): void {

    this.tasks = this.tasks.filter( task => {

      if(task.done){
        delete task.snapshot;
        return false;
      }
      return true;
    });
  }

  // Marks a task as completed
  private completeTask(id: number): void {
    let index = this.tasks.findIndex( value => value.id === id );
    if( index >= 0 ) {
      this.tasks[index].done = true;
    }
  }

  // Helper to computes snapshot progression
  public progress(s: wmUserFile): number {
    return s.xfer / s.size * 100;
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

    // Gets the next task id
    let id = this.tasks.length;

     // Snapshot (subscription happens in the view and triggers the transfer)
    let snapshot = this.auth.uploadUserFile(file).pipe( 
      tap( file => {
        // Intercepts the upload completion and mark the task for disposal
        if( file.xfer === file.size ) {
          this.completeTask(id);
        }
      })
    );

    // Pushes the task into the stack for upload execution
    this.tasks.push({ snapshot, id, done: false });
  }

  // Files deletion list
  private deletingFiles: wmUserFile[] = [];

  // Helper to check if a file is in the deletion list
  public isFileDeleting(file: wmUserFile): boolean {
    return this.deletingFiles.findIndex( f => f.fullName === file.fullName) >=0;
  }

  // Helper to remove a file from the deletion list 
  public fileDeleted(file: wmUserFile): void {
    this.deletingFiles = this.deletingFiles.filter( f => f.fullName !== file.fullName );
  }

  private deleteSelection(): void {

    if(this.fileList && this.fileList.selectedOptions.hasValue()) {

      // Gets the list of selected files, the list will be used to mark the list item as disabled
      // while deletion is in progress
      this.deletingFiles = this.fileList.selectedOptions.selected
        .map( option => option.value );

      // Deletes the selected files
      this.deletingFiles.forEach( file => {
        
        // Once deleted, removes the file from the deletion list 
        this.auth.deleteUserFile(file.id)
          .then( () => this.fileDeleted(file) );
      });

      // Disables the delete action
      this.enableDelete$.enable(false);
    }
  }
}
