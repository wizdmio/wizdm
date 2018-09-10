import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostBinding, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContentService } from 'app/core';
import { ToolbarService, ActionEnabler } from 'app/navigator';
import { Subject, fromEvent, merge } from 'rxjs';
import { map, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { $animations } from './crystal-edit.animations';

@Component({
  selector: 'wm-crystal-edit',
  templateUrl: './crystal-edit.component.html',
  styleUrls: ['./crystal-edit.component.scss'],
  animations: $animations
})
export class CrystalEditComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public msgs;

  constructor(private content : ContentService,
              private toolbar : ToolbarService,
              private builder : FormBuilder) {

    // Gets the localized content
    this.msgs = this.content.select('project.crystalEdit');

    // Build the edit form
    this.form = this.builder.group({ document: [''] });
  }

  private save$: ActionEnabler;

  ngOnInit() {

    // Enables the toolbar actions
    this.toolbar.activateActions(this.msgs.actions, true)
      .subscribe( code => this.doAction(code) );

    this.save$ = this.toolbar.actionEnabler('save');

    // Hooks on user inputs
    this.detectUserInput();

    // Subscribes to the form control valueChange
    this.form.controls.document.valueChanges.subscribe( value => 
        this.value.emit(value) 
      );
  }

  ngOnDestroy() {

    // Restores the previous action bar
    this.toolbar.restoreActions();

    // Disposes all the observables
    this.dispose$.next();
    this.dispose$.complete();
  }

  private doAction(code: string): void {
    
    switch(code) {

      case 'save':
      this.save.emit(true);
      break;

      case 'done':
      this.done.emit();
      break;
    }
  }

  // Value input/output
  @Output('valueChange') value = new EventEmitter<string>();
  @Input('value') set setValue(text: string) {
    this.form.controls.document.patchValue(text);
  }

  // Save input/output
  @Output('saveChange') save = new EventEmitter<boolean>();
  @Input('save') set enableSave(saved: boolean) {
    this.save$ && this.save$.enable(!saved);
  }

  // Done event
  @Output() done = new EventEmitter<void>();

  @Output() scroll = new EventEmitter<number>();

  @ViewChild('textarea', { read: ElementRef }) textarea: ElementRef;
  @HostBinding('@reveal') reveal = true;
  @Input() delay = 1000;

  private dispose$: Subject<void>;
  private timeout;

  private detectUserInput() {

    this.dispose$ = new Subject<void>();

    let e: Element = this.textarea.nativeElement;

    // Merges all the relevan user inputs events
    merge(
      fromEvent<Event>(e, 'keydown'),
      fromEvent<Event>(e, 'mousedown'),
      fromEvent<Event>(e, 'mousemove'),
      fromEvent<Event>(e, 'scroll'),
      fromEvent<Event>(e, 'wheel')

    // Uses a subject to disposes of this Observable on destroy
    ).pipe( takeUntil(this.dispose$) ).subscribe( () => {

      // Makes sure the edit box is visible whenever the user is interacting
      this.reveal = true;

      // Starts to fade the edit box after 'delay' time the user is not interacting with it
      clearTimeout(this.timeout);
      this.timeout = setTimeout( () => this.reveal = false, this.delay );  
    });

    // Monitors the scolling of the textarea to reflects it onto the rendered page
    fromEvent(e, 'scroll')
      .pipe(
        // Uses a subject to dispose of this observable on destroy
        takeUntil(this.dispose$),

        // Maps the scrolling posintion to the text line position (assumign 24px line-height)
        map( () => Math.floor(1 + e.scrollTop / 24) ),

        // Distincts for different falues only
        distinctUntilChanged()
      )
       // Scrolls to the mardown attribute data-line selector
      .subscribe( value => 
        //this.scroll.scrollTo(`[data-line="${value}"]`)
        this.scroll.emit( value )
      );
  }
}
