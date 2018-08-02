import { Injectable } from '@angular/core';

//import * as remark from 'remark';
import * as unified from 'unified';
import * as parse from 'remark-parse';
//import * as stringify from 'remark-stringify';
import * as subSuper from 'remark-sub-super';
//import * as emoji from 'remark-emoji';
//import * as emoticons from 'remark-emoticons';

@Injectable({
  providedIn: 'root'
})
export class RemarkService {

  private remark;

  constructor() { 

    //this.remark = remark.default()
    this.remark = unified.default()
      .use( parse )
      .use( subSuper )
      //.use( stringify )
      .freeze();
  }

  public parse(source: string) {
    return this.remark.parse(source);
  }
}
