import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ContentService, UserProfile } from 'app/core';
import { ToolbarService } from './toolbar.service';
import { $animations } from './toolbar-animations';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'wm-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: $animations
})
export class ToolbarComponent implements OnInit, OnDestroy {

  public menu;

  constructor(private content : ContentService,
              private toolbar : ToolbarService,
              //private auth    : AuthService) {
              private user    : UserProfile) {

    // Gets the localized content
    this.menu = this.content.select("navigator.menu");
  }

  @Output() togglerChange = new EventEmitter<boolean>();
  @Input()  toggler = false;

  public toggle() {
    this.togglerChange.emit(this.toggler = !this.toggler);
  }

  @Output() dividerChange = new EventEmitter<boolean>();
  @Input('divider') divider = false;
  
  public showDivider(show: boolean) {
    if(this.divider != show) {
      this.dividerChange.emit(this.divider = show);
    }
  }

  ngOnInit() {}

  ngOnDestroy() {}

  public get signedIn(): boolean {
    return this.user.authenticated;
  }

  public get userImage(): string {
    return this.user.img; 
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
