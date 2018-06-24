import { Component, 
         OnInit, 
         OnDestroy, 
         ViewChild, 
         ElementRef } from '@angular/core';
import { Router, 
         ActivatedRoute } from '@angular/router';
import { Title, 
         Meta } from '@angular/platform-browser';
import { ContentManager, 
         AuthService, 
         AuthGuardService } from 'app/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wm-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']/*,
  host: {
    '[style.top.px]' : 'top'
  }*/
})
export class NavComponent implements OnInit, OnDestroy {

  @ViewChild('content', { read: ElementRef })
  private ctRef: ElementRef;
  private msgs: any = null;
  private divider: boolean = false;
  private signedIn: boolean = false;
  private subAuth: Subscription;
  //private subGard: Subscription;
  
  constructor(private content: ContentManager, 
              private auth: AuthService,
              //private guard: AuthGuardService,
              //private router: Router,
              //private route: ActivatedRoute,
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

    // Keeps track of user sign-in status
    this.subAuth = this.auth.user.subscribe( user => {
      this.signedIn = user != null;
    });

    // Redirects to Home in case of an attempts to access a guarded route
    /*this.subGard = this.guard.onRedirect.subscribe( url => {
      this.router.navigate(['home'], { relativeTo: this.route });
    });*/
  }

  ngOnDestroy() {
    this.subAuth.unsubscribe();
    //this.subGard.unsubscribe();
  }

  //@HostListener('window:scroll', ['$event']) 
  private onScroll(event: Event) : void {
    
    let ofs = this.ctRef.nativeElement.scrollTop || 0;

    // Triggers the appeareance of the toolbar's divider on scroll
    this.divider = ofs > 20;

    //console.log("scroll: " + ofs);
  }
}
