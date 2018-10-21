import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { inkbarPosition } from '../../elements';
import { wmAction } from '../service/navigator-actions';
import { $animations } from './toolbar-animations';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'wm-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: $animations
})
export class ToolbarComponent implements OnInit, AfterViewInit {

  constructor(private router  : Router) {}

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

  // Toggler to display the menu on mobile version
  @Output() togglerChange = new EventEmitter<boolean>();
  @Input()  toggler = false;

  public toggle() {
    this.togglerChange.emit(this.toggler = !this.toggler);
  }

  @Input() signedIn: boolean = false;
  
  @Input() menuItems: any[] = [];
  
  @Input() userImage: string = null;

  @Input() actionButtons: wmAction[] = [];

  @Output() action = new EventEmitter<string>();

  public get someAction() {
    return !!this.actionButtons && this.actionButtons.length > 0;
  }
  public performAction(code: string) {
    this.action.emit(code);
  }
}
