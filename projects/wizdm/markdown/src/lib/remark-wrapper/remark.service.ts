import { Injectable } from '@angular/core';
import * as unified from 'unified';
import * as parse from 'remark-parse';
import * as align  from 'remark-align';
import * as subsup from 'remark-sub-super';

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
      .freeze();
  }

  public setOptions(options: any) {
    this.options = options;
  }

  public parse(source: string): any[] {
    return this.remark.parse(source);
  }
}
