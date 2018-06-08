import { Component, OnInit, AfterViewInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ContentManager } from 'app/content';

@Component({
  selector: 'wm-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']/*,
  host: {
    '[style.top.px]' : 'top'
  }*/
})
export class NavComponent implements OnInit {//, AfterViewInit {

  @ViewChild('content', { read: ElementRef })
  private ctRef: ElementRef;

  private msgs: any = null;
  private divider = false;
  
  constructor(private content: ContentManager, 
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

  //@HostListener('window:scroll', ['$event']) 
  private onScroll(event: Event) : void {
    
    let ofs = this.ctRef.nativeElement.scrollTop || 0;

    // Triggers the appeareance of the toolbar's divider on scroll
    this.divider = ofs > 20;//this.top / 2;

    //console.log("scroll: " + ofs);
  }

/* This is part of a previous implementation using a fixed toolbar
   plus the container dynamically adjusted to fit right below
   
  @ViewChild('toolbar', { read: ElementRef })
  private tbRef: ElementRef;
  private top = 0;

  // Adjust the top view according to the exact heigh tof the 
  // toolbar always fixed on top of the view
  updateTop() : void 
    { this.top = this.tbRef.nativeElement.offsetHeight || 0; 
      console.log("top: " + this.top);
    }

  ngAfterViewInit() {

    // Update the view top after the first view init using a timeout
    // to avoid change-detection errors
    setTimeout(() => {this.updateTop()} );
  }

  // Update view top on window resize
  @HostListener('window:resize',['$event']) onResize(event) {
    this.updateTop();
  }*/
}
