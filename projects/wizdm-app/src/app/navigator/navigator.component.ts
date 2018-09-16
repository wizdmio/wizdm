import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ContentManager } from '@wizdm/content';

@Component({
  selector: 'wm-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']
})
export class NavComponent implements OnInit {

  public msgs: any = null;
  
  constructor(private content: ContentManager, 
              private title: Title,
              private meta: Meta) {

    // Gets the localized content
    this.msgs = this.content.select("navigator"); 
  }

  ngOnInit() { 

    // Sets the app title when defined 
    if(this.msgs.title) {
      this.title.setTitle(this.msgs.title);}

    // Update the description meta-tag
    if(this.msgs.description) {
      this.meta.updateTag({content: this.msgs.description}, "name='description'");
    }
  }
}
