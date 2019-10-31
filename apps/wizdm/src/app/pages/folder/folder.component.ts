import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { UserProfile, wmFile } from '@wizdm/connect';
import { ContentStreamer } from '@wizdm/content';
import { ToolbarService } from '../../navigator';
import { OpenFileComponent } from '../../elements/openfile';
import { PopupService } from '../../elements/popup';
import { Observable, Subscription } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

interface UploadTask {
  snapshot: Observable<any>;
  done:     boolean;
  id:       number;
}

@Component({
  selector: 'wm-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss'],
  host: { 'class': 'wm-page adjust-top' },
  providers: [ ContentStreamer ]
})
export class FolderComponent implements OnInit, OnDestroy {

  @ViewChild(OpenFileComponent, { static: true }) openFile: OpenFileComponent;
  @ViewChild(MatSelectionList, { static: false }) fileList: MatSelectionList;

  private sub: Subscription;
  public msgs: any = {};
  
  public uploads$: Observable<any[]>;
  public tasks: UploadTask[] = [];
  
  constructor(private content: ContentStreamer, 
              private toolbar: ToolbarService,
              private profile: UserProfile, 
              private popup: PopupService) {}

  ngOnInit() {

    // Initialize the page content
    this.sub = this.content.stream('folder')
      .pipe( switchMap( msgs => {
        // Keeps a snapshot of the localized content for internal use
        this.msgs = msgs;
        // Activates the toolbar actions
        const actions = this.toolbar.activateActions(msgs.actions);
        // Disables the delete action
        this.toolbar.enableAction('delete', false);

        return actions;
      })
    // Subscrbes to execute the actions
    ).subscribe( code => this.executeAction(code) );
  
    // Gets the user uploads observable
    this.uploads$ = this.profile.uploads.stream( ref => ref.orderBy('created') )
      // Disposes completed upload tasks on list change
      .pipe( tap( files => this.disposeTasks() ));
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

  public selectionChange(change: MatSelectionListChange): void {

    // Enables / disables the delete action upon list selection
    const hasValue = change.source.selectedOptions.hasValue();
    this.toolbar.enableAction('delete', hasValue );
  }

  private executeAction(code: string): void {
    
    switch(code) {

      case 'upload':
      this.openFile.open();
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
  public progress(s: wmFile): number {
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
    let snapshot = this.profile.uploads.upload(file).pipe( 
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
  private deletingFiles: wmFile[] = [];

  // Helper to check if a file is in the deletion list
  public isFileDeleting(file: wmFile): boolean {
    return this.deletingFiles.findIndex( f => f.fullName === file.fullName) >=0;
  }

  // Helper to remove a file from the deletion list 
  public fileDeleted(file: wmFile): void {
    this.deletingFiles = this.deletingFiles.filter( f => f.fullName !== file.fullName );
  }

  private clearWhenUserImage(file: wmFile): void {

    // Resets the img url in user profile when deleting the releted image
    if(file.url === this.profile.data.img) {
      this.profile.update({ img: null });
    }
  }

  private deleteSelection(): void {

    if(this.fileList && this.fileList.selectedOptions.hasValue()) {

      // Gets the list of selected files, the list will be used to mark the list item as disabled
      // while deletion is in progress
      this.deletingFiles = this.fileList.selectedOptions.selected
        .map( option => option.value );

      // Deletes the selected files
      this.deletingFiles.forEach( file => {

        // Check if the specified file was used as user image and clears it
        this.clearWhenUserImage(file);
        
        // Once deleted, removes the file from the deletion list 
        this.profile.uploads.delete(file.id)
          .then( () => this.fileDeleted(file) );
      });

      // Disables the delete action
      this.toolbar.enableAction('delete', false);
    }
  }
}
