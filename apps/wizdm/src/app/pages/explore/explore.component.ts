import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContentManager } from '@wizdm/content';
import { ProjectService, Project } from '../../core';
import { NavigatorService, ViewportService } from '../../navigator';
import { Observable, Subject, of } from 'rxjs';
import { map, filter, take, takeUntil, tap } from 'rxjs/operators';
import { $animations } from './explore.animations';

@Component({
  selector: 'wm-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
  animations: $animations
})
export class ExploreComponent implements OnInit, OnDestroy {

  public projects$: Observable<Project[]>;
  private dispose$: Subject<void> = new Subject();
  public msgs = null;

  //private filters$ = new BehaviorSubject<dbQueryFn>(undefined);
  
  constructor(private content  : ContentManager,
              private toolbar  : NavigatorService,
              private scroll   : ViewportService,
              private projects : ProjectService) {}

  ngOnInit() {

    // Gets the localized content
    this.msgs = this.content.select('explore');

    // Listing all projects (using pagination)
    this.projects$ = this.projects.browseAll({ limit: 10 });

    // Enables the toolbar actions only when dealing with personal projects
    //this.toolbar.activateActions(this.msgs.actions);
    
    // Subscribes to the scrollPosition event to implement project pagination
    this.scroll.scrollPosition
      // Filters events when the active page does not require pagination
      .pipe( takeUntil(this.dispose$) )
      // Ask for more data to display when at the bottom of the page
      .subscribe( pos => {
        if(pos === 'bottom') {
          this.projects.more();
        }
      });
  }

  ngOnDestroy() {

    // Disposes all the observables. DO NOT FORGET to use takeUntil() operator
    this.dispose$.next();
    this.dispose$.complete();
  }
}

/*
    import { MediaChange, ObservableMedia } from '@angular/flex-layout';

    private media: ObservableMedia

    this.media.asObservable()
      .pipe( takeUntil( this.dispose$ ) )
      .subscribe((change: MediaChange) => {
        this.cols = this.colsBreakpoint[change.mqAlias];
      });*/