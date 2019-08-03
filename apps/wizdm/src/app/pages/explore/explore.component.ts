import { Component, OnInit, OnDestroy } from '@angular/core';
//import { ToolbarService, ViewportService } from '../../navigator';
import { ProjectService, wmProject } from '../../core/project';
import { ContentResolver } from '../../core/content';
import { Observable, Subject, of } from 'rxjs';
//import { map, filter, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { $animations } from './explore.animations';

@Component({
  selector: 'wm-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
  host: { 'class': 'wm-page adjust-top content-padding' },
  animations: $animations
})
export class ExploreComponent {

  readonly msgs$: Observable<any>;
  public projects$: Observable<wmProject[]>;
  
  //private filters$ = new BehaviorSubject<dbQueryFn>(undefined);
  
  constructor(readonly content: ContentResolver, readonly projects: ProjectService ) {

    // Gets the localized content pre-fetched during routing resolving
    this.msgs$ = content.stream('explore');

    // Listing all projects (using pagination)
    this.projects$ = this.projects.paging({ limit: 10 });
  }
}
