import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToolbarService, ViewportService } from '../../navigator';
import { ContentResolver, ProjectService, Project } from '../../utils';
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

  readonly msgs$: Observable<any>;
  private dispose$: Subject<void> = new Subject();
  public projects$: Observable<Project[]>;
  
  //private filters$ = new BehaviorSubject<dbQueryFn>(undefined);
  
  constructor(private  scroll   : ViewportService,
              readonly projects : ProjectService,
                       content  : ContentResolver) {

    // Gets the localized content pre-fetched during routing resolving
    this.msgs$ = content.stream('explore');
  }

  ngOnInit() {

    // Listing all projects (using pagination)
    this.projects$ = this.projects.browseAll({ limit: 10 });
    
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
