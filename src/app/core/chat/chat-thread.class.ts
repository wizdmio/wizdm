
import { wmUser, wmConversation, wmMessage, ChatService } from 'app/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, tap, take, zip, mergeMap } from 'rxjs/operators';

class ChatThread {
  
  constructor(private data: wmConversation, private chat: ChatService) { }

  public get recipient$(): Observable<wmUser> {
    return this.chat.retriveRecipient(this.data);
  }

  public get messages$(): Observable<wmMessage[]> {
    return this.chat.retriveMessages(this.data);
  }
}