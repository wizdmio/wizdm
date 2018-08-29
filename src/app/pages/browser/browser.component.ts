import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { ContentService, ProjectService, wmProject, Timestamp } from 'app/core';
import { ToolbarService, ScrollViewService } from 'app/navigator';
import { Observable, Subject, of } from 'rxjs';
import { filter, takeUntil, catchError } from 'rxjs/operators';
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

  public activeTab = 0;

  private allProjects$: Observable<wmProject[]>;
  private newProjects$: Observable<wmProject[]>;
  private myProjects$: Observable<wmProject[]>;

  //private filters$ = new BehaviorSubject<QueryFn>(undefined);
  
  constructor(private content  : ContentService,
              private toolbar  : ToolbarService,
              private scroll   : ScrollViewService,
              private database : ProjectService,
              private media    : ObservableMedia) {}

  ngOnInit() {

    // Gets the localized content
    this.msgs = this.content.select('browser');

    // Enables the toolbar actions
    this.toolbar.activateActions(this.msgs.actions);

    // Creates the observable listing all projects (using pagination)
    this.allProjects$ = this.database.projects$
      .pipe( takeUntil( this.dispose$ ));

    // Creates the observable listing current user' projects
    this.myProjects$ = this.database.queryOwnProjects()
      .pipe( takeUntil( this.dispose$ ));

    // Subscribes to the scrollPosition event to implement project pagination
    this.scroll.scrollPosition
      // Filters events when the active page does not require pagination
      .pipe( filter( () => this.tabSource === 'all') )
      // Ask for more data to display when at the bottom of the page
      .subscribe( pos => {
        if(pos === 'bottom') {
          this.database.more();
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

  public get tabDescription(): string {
    return this.msgs.tabs[this.activeTab].description;
  }

  public get loading$(): Observable<boolean> {
    return this.database.loading$;
  }

  private get tabSource(): string {
    return this.msgs.tabs[this.activeTab].source;
  }

  public get projects$(): Observable<wmProject[]> {

    // Returns the relevant observable according to the selected tab
    switch( this.tabSource ) {

      case 'all':
      return this.allProjects$;

      case 'personal':
      return this.myProjects$;

      default:
    }

    return of([]);
  }

  // Enables the theme tools on the card whenever the project belongs to me 
  public enableTools(project: wmProject): boolean {
    return this.database.isProjectMine(project);
  }

  // Updates the project theme
  public updateProject(data: wmProject): void {
    this.database.updateProject(data);
  }
}
