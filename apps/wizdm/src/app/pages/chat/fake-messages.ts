import { Injectable } from '@angular/core';
import { delay, shareReplay, startWith, map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Message } from 'app/core/chat';
import moment from 'moment';
import * as faker from 'faker';

@Injectable({
  providedIn: 'root'
})
export class FakeMessages {

  readonly messages$: Observable<Message[]>;
  private _send$ = new Subject<Message>();

  private _messages = this.history(10);

  constructor() {

    this.messages$ = this._send$.pipe( map( msg => {

      this._messages.push(msg);
      
      return this._messages; 
    
    }), shareReplay(1), delay(10), startWith(this._messages) );

  }

  public send(msg: Message): Message {

    const timestamp = moment().format('x');
    return this._send$.next(msg = {...msg, timestamp }), msg;
  }

  public message(sender: string, time?: string): Message {

    const timestamp = time || moment().format('x');
    const body = faker.lorem.sentence();
    return { timestamp, sender, body } as Message;
  }

  public history(n: number): Message[] {

    let now = moment().format('x');

    return Array(n).fill('').map( (_, index) => {

      const sender = faker.random.boolean() ? 'me' : 'whoever';
      return this.message(sender, (+now - (n - index) * 100000).toString() );
    });
  }

  public receive() {

    const delay = () => Math.floor(5000 + Math.random() * 10000);

    const loop = () => {

      this.send( this.message('whoever') );

      setTimeout( loop , delay() );
    };

    loop();
  } 
}