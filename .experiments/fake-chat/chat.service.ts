import { first, delay, map, tap, switchMap } from 'rxjs/operators';
import { DocumentData } from '@wizdm/connect/database/document';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import moment from 'moment';
import * as faker from 'faker';

export interface User {
  id: string;
  name: string;
  img: string;
}

export interface dbMessage  extends DocumentData {
  body: string;
  sender: string;
  timestamp?: string;
}

export interface dbConversation extends DocumentData {
  recipients: string[];
  lastRead?: LastRead;
  thread$: BehaviorSubject<dbMessage[]>;
}

export interface LastRead {
  [recipient:string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private _conversations$: BehaviorSubject<dbConversation[]>;
  readonly conversations$: Observable<dbConversation[]>;
  readonly users$: Observable<User[]>;
  private users: User[] = [];
  
  constructor() {

     this._conversations$ = new BehaviorSubject<dbConversation[]>( this.history(5) );

    this.conversations$ = this._conversations$.asObservable();

    this.users$ = of( this.users );
  }

  public conversation(convId: string): Observable<dbConversation> {

    return this.conversations$.pipe( map( convs => convs.find( conv => conv.id === convId )) );
  } 

  public recipient(id: string): Observable<User> {
    
    return this.users$.pipe( map( users => users.find( user => user.id === id ) ) );
  }

  public thread(convId: string): Observable<dbMessage[]> {

    return this.conversation(convId).pipe( 
      switchMap( conv => conv && conv.thread$ || of([]) )
    );
  }

  public lastRead(convId: string, recipient: string, msg: any) {

    const convs = this._conversations$.value;

    const conv = convs[convId];

    if(!conv || conv.recipients.findIndex( id => id === recipient ) < 0) { return; }

    //conv.lastRead[recipient] = msg.id;

    convs[convId] = {
      ...conv,
      lastRead: {
        ...conv.lastRead,
        [recipient]: msg.id
      }
    }

    this._conversations$.next(convs);
  }

  public receive() {

    this.conversations$.pipe( 

      delay( Math.floor(5000 + Math.random() * 10000) ), 
      
      map( convs => convs[ Math.floor(Math.random() * convs.length) ] ),

      tap( conv => {

        const sender = conv.recipients.find( sender => sender !== 'me');

        const thread = conv.thread$.value || [];

        conv.thread$.next( thread.concat( { ...this.createMessage( sender ) } ) );
      }),

      first()

    ).subscribe( () => this.receive() );
  }

  public send(msg: dbMessage, convId: string) {

    this.conversations$.pipe( tap( convs => {

      const conv = convs.find( conv => conv.id === convId );

      const thread = conv && conv.thread$.value || [];

      const timestamp = moment().format('x');

      conv.thread$.next( thread.concat({ ...msg, timestamp }) );
        
    }), first() ).subscribe();
  }

  private history(n: number): dbConversation[] {

    return Array(n).fill(0).map( (_,i) => {

      const conv = this.createGroup(i.toString());

      conv.recipients.filter( sender => sender !== 'me' ).forEach( sender => {
        this.users.push( this.createUser(sender) );
      });

      return conv;
    });
  }

  private createUser(id: string): User {
    
    const name = faker.name.findName();
    
    const img = faker.image.avatar();
    
    return { id, name, img };
  }

  private createGroup(id: string): dbConversation {

    const userId = faker.random.uuid();

    const len = Math.floor( 3 + Math.random() * 7 );

    const thread = this.messageHistory( userId, len );

    const lastRead = thread[len-1].id;

    const thread$ = new BehaviorSubject(thread);
    
    return { id, recipients: ['me', userId], thread$, lastRead: { 'me': lastRead } };
  }

  private createMessage(sender: string, time?: string): dbMessage {

    const id = faker.random.uuid();
    
    const timestamp = time || moment().format('x');
    
    const body = faker.lorem.sentence();
    
    return { id, timestamp, sender, body };
  }

  private messageHistory(sender: string, n: number): dbMessage[] {

    let now = moment().format('x');

    return Array(n).fill('').map( (_, index) => {

      //const sender = faker.random.boolean() ? 'me' : user;
      return this.createMessage(sender, (+now - (n - index) * 100000).toString() );
    });
  }
}