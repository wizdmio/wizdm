import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolbarService, ViewportService } from '../../navigator';
import { ProjectService, Project } from '../../utils';
import { Observable, Subject, of } from 'rxjs';
import { map, filter, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { $animations } from './explore.animations';

@Component({
  selector: 'wm-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
  animations: $animations
})
export class ExploreComponent implements OnInit, OnDestroy {

  private dispose$: Subject<void> = new Subject();
  public projects$: Observable<Project[]>;
  readonly msgs;

  //private filters$ = new BehaviorSubject<dbQueryFn>(undefined);
  
  constructor(route: ActivatedRoute,
              private toolbar  : ToolbarService,
              private scroll   : ViewportService,
              private projects : ProjectService) {

    // Gets the localized content pre-fetched during routing resolving
    this.msgs = route.snapshot.data.content.explore || {};
  }

  ngOnInit() {

    // Listing all projects (using pagination)
    this.projects$ = this.projects.browseAll({ limit: 10 });

    // Enables the toolbar actions only when dealing with personal projects
    //this.toolbar.activateActions(this.msgs.actions);
    
    // Subscribes to scrollY$ to load new projects when approaching the bottom of the page
    this.scroll.scrollY$.pipe(
      takeUntil(this.dispose$),
      map( pos => pos[1] < 500 ),
      distinctUntilChanged(),
      filter( bottom => bottom )
    ).subscribe( pos => {
      this.projects.more();
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