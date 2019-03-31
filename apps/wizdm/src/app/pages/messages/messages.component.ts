import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import { ContentManager } from '@wizdm/content';
import { PopupService } from '@wizdm/elements';
import { ToolbarService } from '../../navigator';
import { ChatService, wmConversation, wmMessage } from '../../utils';
import { Observable, of } from 'rxjs';
import { filter, take, map, tap } from 'rxjs/operators';

/*
// DEBUG TEST
const $messages: wmMessage[] = [
  { from: { name: "Lucio" }, about: { name: "winzdm.io" }, last: { content: "Hi, your project sounds amazing. I'd love being a part of it.", unread: true } },
  { from: { name: "Alena" }, about: { name: "Veganizer.app" }, last: { content: "Hello, I believe you may be interested in joining Veganizer.app.", unread: true } },
  { from: { name: "Ita"   }, about: { name: "wizdm.io" }, last: { content: "Hi, I'm planning to submit a project myself, can you help?", unread: true } }
];
*/

@Component({
  selector: 'wm-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  @ViewChild(MatSelectionList) msgList: MatSelectionList;

  public messages$: Observable<wmConversation[]>;
  public msgs;

  constructor(private content : ContentManager, 
              private toolbar : ToolbarService,
              //private auth    : AuthService,
              private chat    : ChatService,
              private popup   : PopupService) {

    // Gets the localized content
    this.msgs = this.content.select('messages');
  }

  ngOnInit() {

    // Gets the user uploads observable
    //this.messages$ = this.chat.queryMyMessages();
    //this.messages$ = of($messages);// DEBUG
      
    // Activates the toolbar actions
    //this.toolbar.activateActions(this.msgs.actions)
    //  .subscribe( code => this.executeAction(code) );

    // Gets the action enabler for 'delete' action code
    //this.enableDelete$ = this.toolbar.actionEnabler('delete');
    //this.enableDelete$.enable(false);
  }
/*
  public selectionChange(change: MatSelectionListChange): void {

    // Enables / disables the delete action upon list selection
    //this.enableDelete$.enable( change.source.selectedOptions.hasValue() );
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
  private deletingMsgs: wmMessage[] = [];


  // Helper to check if a message is in the deletion list
  public isMsgDeleting(msg: wmMessage): boolean {
    return this.deletingMsgs.findIndex( m => m.id === msg.id) >=0;
  }

  // Helper to remove a file from the deletion list 
  public fileDeleted(msg: wmMessage): void {
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
      //this.enableDelete$.enable(false);
    }
  }
*/
}
