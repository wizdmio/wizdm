import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ContentService, AuthService } from 'app/core';

@Component({
  selector: 'wm-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']/*,
  host: {
    '[style.top.px]' : 'top'
  }*/
})
export class NavComponent implements OnInit {

  @ViewChild('content', { read: ElementRef })
  private ctRef: ElementRef;
  private msgs: any = null;
  private divider: boolean = false;
  
  constructor(private content: ContentService, 
              private auth: AuthService,
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

  get signedIn() {
    return this.auth.authenticated;
  }

  //@HostListener('window:scroll', ['$event']) 
  private onScroll(event: Event) : void {
    
    let ofs = this.ctRef.nativeElement.scrollTop || 0;

    // Triggers the appeareance of the toolbar's divider on scroll
    this.divider = ofs > 20;

    //console.log("scroll: " + ofs);
  }
}
