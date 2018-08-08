import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ContentService, AuthService } from 'app/core';
import { ToolbarService } from './toolbar.service';
import { toolbarAnimations } from './toolbar-animations';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'wm-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: toolbarAnimations
})
export class ToolbarComponent implements OnInit, OnDestroy {

  constructor(private content : ContentService,
              private toolbar : ToolbarService,
              private auth    : AuthService) { }

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

  public msgs: any = null;

  ngOnInit() {

    // Gets the localized content
    this.msgs = this.content.select("navigator");
  }

  ngOnDestroy() {}

  public actionEnablers: any = {};

  public isActionEnabled(code: string) {
    return this.actionEnablers[code] || false;
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

  public get signedIn(): boolean {
    return this.auth.authenticated;
  }

  public get userImage(): string {
    return this.auth.userProfile ? 
      this.auth.userProfile.img : null; 
  }
}
