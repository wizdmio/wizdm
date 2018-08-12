import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { ContentService } from 'app/core';
import { ToolbarService, ActionEnabler, ScrollViewService } from 'app/navigator';
//import { Observable, Subscription, of } from 'rxjs';
//import { switchMap, catchError, tap, take } from 'rxjs/operators';

@Component({
  selector: 'wm-edit-box',
  templateUrl: './edit-box.component.html',
  styleUrls: ['./edit-box.component.scss']
})
export class EditBoxComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public msgs;

  constructor(private content : ContentService,
              private toolbar : ToolbarService,
              private builder : FormBuilder,
              private scroll  : ScrollViewService) { 

    // Build the edit form
    this.form = this.builder.group({ document: [''] });
  }

  ngOnInit() {

    // Gets the localized content
    this.msgs = this.content.select('project.editBox');

    // Dsables the navigation scrolling saving the previous status
    this.scroll.enable(false, true);

    this.toolbar.activateActions(this.msgs.actions, true)
      .subscribe( code => this.doAction(code) );
  }

  @Input('value') set setValue(text: string) {
    this.form.controls.document.patchValue(text);
  }

  @Output() done = new EventEmitter<void>();

  private doAction(code: string): void {
    
    switch(code) {

      case 'done':
      this.done.emit();
      break;
    }
  }

  ngOnDestroy() {

    // Restores the previous action bar
    this.toolbar.restoreActions();

    // Restores the previous navigation scrolling status
    this.scroll.restore();
  }
}
