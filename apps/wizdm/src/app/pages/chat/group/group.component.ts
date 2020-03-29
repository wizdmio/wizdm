import { Component, OnInit, Input } from '@angular/core';
import { Group, User, Message, ChatService } from 'app/core/chat'; 
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import moment from 'moment';

interface GroupData extends Group {
  sender: User;
  last: Message;
  unread: number;
}

@Component({
  selector: 'wm-chat-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class ChatGroup  {

  private input$ = new BehaviorSubject<Group>(undefined);
  readonly data$: Observable<GroupData>;
  
  constructor(private chat: ChatService) {

    this.data$ = this.input$.pipe(

      switchMap( conv => {

        const sender = conv && conv.recipients.find(id => id !== 'me');

        const lastRead = conv && conv.lastRead['me'];
        
        return chat.recipient( sender ).pipe(

          switchMap( sender => chat.thread(conv.id).pipe(

            map( thread => {

              const count = thread && thread.length || 0;

              const last = thread && thread[count - 1];

              const received = thread && thread.filter( msg => msg.sender !== 'me' );

              const receiveCount = received && received.length || 0;

              const lastReceived = received[receiveCount-1];

              const lastIndex = received && received.findIndex( msg => msg.id === lastRead ) || -1;

              const unread = lastIndex >= 0 ? (receiveCount - lastIndex - 1) : receiveCount;
                            
              return {...conv, sender, last, unread };
            })
          ))
        )
      })
    );  
  }

  @Input() set conv(conv: Group) {
    this.input$.next(conv);
  }

  time(timestamp: string) {
    return moment(timestamp, 'x').format("HH:mm");
  }
}
