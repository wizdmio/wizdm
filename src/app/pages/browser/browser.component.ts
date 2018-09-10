import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { ContentService, ProjectService, Project } from 'app/core';
import { ToolbarService, ScrollViewService } from 'app/navigator';
import { Observable, Subject, from, of } from 'rxjs';
import { map, filter, take, takeUntil, tap } from 'rxjs/operators';
import { $animations } from './browser.animations';

@Component({
  selector: 'wm-project-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss'],
  animations: $animations
})
export class BrowserComponent implements OnInit, AfterContentInit, OnDestroy {

  private colsBreakpoint = { xl: 8, lg: 6, md: 4, sm: 2, xs: 1 };
  private dispose$: Subject<void> = new Subject();

  public msgs = null;
  public cols = 1;

  public all$: Observable<Project[]>;
  public mine$: Observable<Project[]>;

  //private filters$ = new BehaviorSubject<dbQueryFn>(undefined);
  
  constructor(private content  : ContentService,
              private toolbar  : ToolbarService,
              private scroll   : ScrollViewService,
              private projects : ProjectService,
              private media    : ObservableMedia) {}

  ngOnInit() {

    // Gets the localized content
    this.msgs = this.content.select('browser');

    // Enables the toolbar actions
    this.toolbar.activateActions(this.msgs.actions);

    // Creates the observable listing all projects (using pagination)
    this.all$ = this.projects.browseAll({ limit: 10 });

    // Load the personal projects once (limited number?)
    this.mine$ = this.projects.loadMine();

    // Subscribes to the scrollPosition event to implement project pagination
    this.scroll.scrollPosition
      // Filters events when the active page does not require pagination
      .pipe( takeUntil(this.dispose$), filter( () => this.tabSource === 'all') )
      // Ask for more data to display when at the bottom of the page
      .subscribe( pos => {
        if(pos === 'bottom') {
          this.projects.more();
        }
      });
  }

  ngAfterContentInit() {

    // Adjust the number of grid's columns according to the media breakboint
    this.media.asObservable()
      .pipe( takeUntil( this.dispose$ ) )
      .subscribe((change: MediaChange) => {
        this.cols = this.colsBreakpoint[change.mqAlias];
      });
  }

  ngOnDestroy() {

    // Disposes all the observables. DO NOT FORGET to use takeUntil() operator
    this.dispose$.next();
    this.dispose$.complete();
  }

  public tabIndex = 0;

  public get tabDescription(): string {
    return this.msgs.tabs[this.tabIndex].description;
  }

  private get tabSource(): string {
    return this.msgs.tabs[this.tabIndex].value;
  }
  
/*
  public get loading$(): Observable<boolean> {
    return this.projects.loading$;
  }

  public switchTab(index: number) {
    
    this.tabIndex = index;

    // Returns the relevant observable according to the selected tab
    switch( this.tabSource ) {

      case 'all':// Resets the paging
      //this.all$ = this.projects.browseAll();
      break;

      case 'mine':
      default:
    }
  }

  public get tabData$(): Observable<Project[]> {

    // Returns the relevant observable according to the selected tab
    switch( this.tabSource ) {

      case 'all':
      return this.all$;

      case 'mine':
      return this.mine$;

      default:
    }

    return of([]);
  }
*/
}
