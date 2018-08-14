import { Component, OnInit, OnDestroy, HostBinding, HostListener } from '@angular/core';
import { ContentService } from '../../core';
//import { NavService } from 'app/navigator/navigator.service';
//import { homeAnimations, scrollParams } from './home-animations';

//import { Subscription } from 'rxjs';

@Component({
  selector: 'wm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']//,
  //animations: homeAnimations
})
export class HomeComponent implements OnInit, OnDestroy {
/*
  //@HostBinding('@theme') theme = 'navy';
  @HostBinding('@scroll') get scroll() { 
    return { 
      value: this.select, // Triggers the '* => *' transition
      params: this.params // Selects the scrolling direction
    }; 
  }
  
  private params = scrollParams.scrollUp;
  private contents: any;
  private sections: string[];
  private select = 0;
  private max = 0;

  private subnav: Subscription;
*/
  constructor(private content: ContentService/*, private nav: NavService*/) { 
    //this.contents = this.content.select("presentation");
  }

  ngOnInit() {
    /*
    this.sections = Object.keys(this.contents);
    this.max = this.sections.length - 1;

    console.log("sections: " + this.sections);

    // Subscribe to the navigation scroll events
    this.subnav = this.nav.events
        .filter( data => data.reason === 'nav') // filters the 'scroll' events only
        .map( data => <string>data.data) // maps the paylod into the direction string
        .subscribe( nav => {

      if(nav === 'down') { this.navigate(this.select + 1); }     
      if(nav === 'up') { this.navigate(this.select - 1); }
    });

    this.navigate();*/
  }

  ngOnDestroy() {
    //this.subnav.unsubscribe();  
  }
/*
  private navigate(select = 0) {

    if(select < 0){ select = 0;}
    if(select > this.max){ select = this.max;}

    // Selects the scrolling direction
    this.params = select < this.select ? scrollParams.scrollDown : scrollParams.scrollUp;

    // Select the section content and triggers the scroll animation 
    this.select = select;
    
    // Emits a 'theme' event, so, to switch the navigation colors according to the content
    let theme = this.contents[ this.sections[select] ].theme;
    this.content.emit({ reason: "theme", data: theme });
  }*/
}
