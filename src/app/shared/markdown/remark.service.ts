import { Injectable } from '@angular/core';

//import * as remark from 'remark';
import * as unified from 'unified';
import * as parse from 'remark-parse';
import * as align  from 'remark-align';
//import * as stringify from 'remark-stringify';
import * as subsup from 'remark-sub-super';
//import * as emoji from 'remark-emoji';
//import * as emoticons from 'remark-emoticons';

@Injectable({
  providedIn: 'root'
})
export class RemarkService {

  private remark;
  private options = { 
    commonmark : true,
    pedantic   : true,
    footnotes  : true
  };

  constructor() { 

    //this.remark = remark.default()
    this.remark = unified.default()
      .use( parse.default, this.options )
      .use( align.default )
      .use( subsup.default )
      //.use( stringify )
      .freeze();
  }

  public setOptions(options: any) {
    this.options = options;
  }

  public parse(source: string): any[] {
    return this.remark.parse(source);
  }
}
