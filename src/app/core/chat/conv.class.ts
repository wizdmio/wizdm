
import { wmUser, wmConversation, wmMessage, DatabaseService } from 'app/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, tap, take, zip, mergeMap } from 'rxjs/operators';

class Conversation {
  
  constructor(private data: wmConversation, private dbase: DatabaseService) { }

  private machSender(sender: string | wmUser): wmUser {

    if(typeof sender === 'string') {
      return (sender === (<wmUser>this.data.from).id ? 
        this.data.from : sender === (<wmUser>this.data.to).id ?
          this.data.to : {} ) as wmUser;
    }

    return sender;
  }

  queryMessages(): Observable<wmMessage[]> {
    return this.dbase.colWithIds$<wmMessage>(`conversations/${this.data.id}/messages`)
      .pipe( map( msgs => 
        msgs.map( msg => 
          { return { 
            ...msg, 
            sender:  this.machSender(msg) 
          }; 
        })
      ));
  }

  sendMessage(sender: string, content: string): Promise<string> {
    return this.dbase.add<wmMessage>(`conversations/${this.data.id}/messages`, {
      sender, content 
    });
  }
}