import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ContentManager } from '@wizdm/content';
import { UserProfile } from '@wizdm/connect';
import { inkbarPosition } from '../../elements';
import { ToolbarService } from './toolbar.service';
import { $animations } from './toolbar-animations';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'wm-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: $animations
})
export class ToolbarComponent implements OnInit, AfterViewInit {

  public menu;

  constructor(private router  : Router,
              private content : ContentManager,
              private toolbar : ToolbarService,
              private profile : UserProfile) {

    // Gets the localized content
    this.menu = this.content.select("navigator.toolbar");
  }

  ngOnInit(){

    // Intercepts the NavigationEnd events
    this.router.events.pipe( filter(e => e instanceof NavigationEnd) )
      .subscribe(e => {
        // Draws the inkbar at the end of navigation
        this.drawInkbar();
        // Toggle the mobile menu to close when open
        if(this.toggler) { this.toggle();}
      });
  }

  // Draws the inkbar fter first view init
  ngAfterViewInit() { this.drawInkbar();}

  // Toggler to display the menu on mobile version
  @Output() togglerChange = new EventEmitter<boolean>();
  @Input()  toggler = false;

  public toggle() {
    this.togglerChange.emit(this.toggler = !this.toggler);
  }

  // Bottom divider: displays a bottom border to divide the toolbar from the content
  @Output() dividerChange = new EventEmitter<boolean>();
  @Input('divider') divider = false;
  
  public showDivider(show: boolean) {
    if(this.divider != show) {
      this.dividerChange.emit(this.divider = show);
    }
  }

  // Inkbar underlining the active router link
  @ViewChild('linkbar', { read: ElementRef }) 
  private linkbar: ElementRef;// Root element or the routing links
  
  // Inkbar position
  public inkbar: inkbarPosition = { left: 0, width: 0 };
  
  // Inkbar drawing helper: updates the inkbar position
  private drawInkbar() {

    // Performs the update on the next scheduler round making sure the target element is actually updated
    setTimeout(() => { 
      try {
        // Seek for the elmement decorated with the 'link-active' class
        let e: HTMLElement = this.linkbar.nativeElement.getElementsByClassName('link-active')[0];
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

  public get signedIn(): boolean {
    return this.profile.authenticated;
  }

  public get menuItems() {
    return this.signedIn ? this.menu.private : this.menu.public;
  }

  public get userImage(): string {
    return this.profile.data.img; 
  }

  public get actionButtons() {
    return this.toolbar.buttons;
  }

  public get someAction() {
    return this.actionButtons.length > 0;
  }

  public performAction(code: string) {
    this.toolbar.performAction(code);
  }

  public clearActions() {
    this.toolbar.clearActions();
  }
}
