import { Component } from '@angular/core';
import { StorageService, StorageFile } from '@wizdm/connect/storage';
import { AuthService } from '@wizdm/connect/auth';
import { map, flatMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'wm-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss'],
  host: { 'class': 'padding-top-toolbar' }
})
export class FolderComponent {
  
  readonly files$: Observable<StorageFile[]>;
  
  constructor(private auth: AuthService, private store: StorageService) {

    this.files$ = this.auth.user$.pipe(

      map( user => !!user ? this.store.ref(user.uid) : null), 
      
      flatMap(ref =>  !!ref ? ref.listAll() : of(null)),

      map( result => !!result ? result.items : []),

      map( items => items.map( item => this.store.file( item ) ) )
    );

  }

  public uploadFiles(list: FileList, start: number = 0): void {
    /*
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
    /*let snapshot = this.profile.uploads.upload(file).pipe( 
      tap( file => {
        // Intercepts the upload completion and mark the task for disposal
        if( file.xfer === file.size ) {
          this.completeTask(id);
        }
      })
    );*/

    // Pushes the task into the stack for upload execution
    //this.tasks.push({ snapshot, id, done: false });
  }

  public deleteFiles() {

  }
}
