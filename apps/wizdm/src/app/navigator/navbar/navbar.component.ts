import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { inkbarPosition } from '../../elements';
//import { wmAction } from '../service/navigator-actions';
//import { $animations } from './toolbar-animations';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'wm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {

  constructor(private host: ElementRef, private router: Router) {}

  private get element() {
    return this.host.nativeElement;
  }

  ngOnInit(){

    // Intercepts the NavigationEnd events
    this.router.events.pipe( filter(e => e instanceof NavigationEnd) )
      .subscribe(e => {
        // Draws the inkbar at the end of navigation
        this.drawInkbar();
        // Toggle the mobile menu to close when open
        //if(this.toggler) { this.toggle();}
      });
  }

  // Draws the inkbar fter first view init
  ngAfterViewInit() { this.drawInkbar();}

  // Inkbar underlining the active router link
  //@ViewChild('linkbar', { read: ElementRef }) 
  //private linkbar: ElementRef;// Root element or the routing links
  
  // Inkbar position
  public inkbar: inkbarPosition = { left: 0, width: 0 };
  
  // Inkbar drawing helper: updates the inkbar position
  private drawInkbar() {

    // Performs the update on the next scheduler round making sure the target element is actually updated
    setTimeout(() => { 
      try {
        // Seek for the elmement decorated with the 'link-active' class
        const e: HTMLElement = this.element.getElementsByClassName('link-active')[0];
        // Updates the inkbar position based on the returned element
        this.inkbar = !!e ? { left: e.offsetLeft, width: e.clientWidth } : { width: 0 };
      }
      catch(e) { }
    });
  }

  // Makes sure the inkbar follows the element on screen changes
  @HostListener('window:resize') onResize() {
    this.drawInkbar();
  }

  // Navigation menu items (links)
  @Input() menuItems: any[] = [];

  // Flag to enable the user profile button
  //@Input() userProfile: boolean = false;

  // User image when available
  //@Input() userImage: string = null;

  // Toggler to display the menu on mobile version
  //@Input()  toggler = false;
  //@Output() togglerChange = new EventEmitter<boolean>();
  
  //public toggle() {
  //  this.togglerChange.emit(this.toggler = !this.toggler);
  //}
}
