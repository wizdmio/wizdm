import { Component, OnInit, Input } from '@angular/core';
import { RemarkService } from './remark.service';

@Component({
  selector: 'wm-markdown, [wm-markdown]',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss']/*,
  preserveWhitespaces: true*/
})
export class MarkdownComponent {

  public root;
  
  constructor(private remark: RemarkService) { }

  @Input('source') set setSource(source: string){

    this.root = this.remark.parse(source);
    console.log(this.root);
  }
}
