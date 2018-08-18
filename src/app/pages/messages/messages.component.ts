import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import { ContentService, AuthService, wmUserMessage } from 'app/core';
import { ToolbarService, ActionEnabler } from 'app/navigator';
import { PopupService } from 'app/shared';
import { Observable, of } from 'rxjs';
import { filter, take, map, tap } from 'rxjs/operators';

// DEBUG TEST
const $messages = [
  { from: { name: "Lucio" }, subject: "Join wizdm.io team", content: "Hi, your project sounds amazing. I'd love being a part of it." },
  { from: { name: "Alena" }, subject: "Come to Veganizer.app", content: "Hello, I believe you may be interested in joining Veganizer.app." },
  { from: { name: "Ita"   }, subject: "Need advice", content: "Hi, I'm planning to submit a project myself, can you help?" }
];

@Component({
  selector: 'wm-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  @ViewChild(MatSelectionList) msgList: MatSelectionList;

  private enableDelete$: ActionEnabler;
  public messages$ = of($messages);
  public msgs;

  constructor(private content : ContentService, 
              private toolbar : ToolbarService,
              private auth    : AuthService,
              private popup   : PopupService) {

    // Gets the localized content
    this.msgs = this.content.select('messages');
  }

  ngOnInit() {

    // Gets the user uploads observable
    //this.messages$ = this.auth.getUserUploads( ref => ref.orderBy('created') );
      
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

      case 'delete':
      // Ask for confirmation prior to start deleting
      this.popup.confirmPopup(this.msgs.canDelete)
        .subscribe( () => this.deleteSelection() );
      break;
    }
  }

  // Messages deletion list
  private deletingMsgs: wmUserMessage[] = [];


  // Helper to check if a message is in the deletion list
  public isMsgDeleting(msg: wmUserMessage): boolean {
    return this.deletingMsgs.findIndex( m => m.id === msg.id) >=0;
  }

  // Helper to remove a file from the deletion list 
  public fileDeleted(msg: wmUserMessage): void {
    this.deletingMsgs = this.deletingMsgs.filter( m => m.id !== msg.id );
  }

  private deleteSelection(): void {

    if(this.msgList && this.msgList.selectedOptions.hasValue()) {

      // Gets the list of selected messages, the list will be used to mark the list item as disabled
      // while deletion is in progress
      this.deletingMsgs = this.msgList.selectedOptions.selected
        .map( option => option.value );

      // Deletes the selected message
      this.deletingMsgs.forEach( msg => {
        
        // Once deleted, removes the file from the deletion list 
        //this.auth.deleteUserFile(file.id)
        //  .then( () => this.fileDeleted(file) );
      });

      // Disables the delete action
      this.enableDelete$.enable(false);
    }
  }

}
