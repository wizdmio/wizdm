import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ContentService } from '../core';

@Component({
  selector: 'wm-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']
})
export class NavComponent implements OnInit {

  public msgs: any = null;
  
  constructor(private content: ContentService, 
              private title: Title,
              private meta: Meta) { }

  ngOnInit() { 

    // Gets the localized content
    this.msgs = this.content.select("navigator");
   
    // Sets the app title when defined 
    if(this.msgs.title) {
      this.title.setTitle(this.msgs.title);}

    // Update the description meta-tag
    if(this.msgs.description) {
      this.meta.updateTag({content: this.msgs.description}, "name='description'");
    }
  }
}
