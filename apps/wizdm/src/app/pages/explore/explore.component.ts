import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//import { ToolbarService, ViewportService } from '../../navigator';
import { ProjectService, wmProject } from '../../core/project';
import { ContentResolver } from '../../core/content';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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

  get me() { return this.content.user.id || ''; }
  
  constructor(private content  : ContentResolver, 
              private projects : ProjectService,
              private route    : ActivatedRoute ) {

    // Gets the localized content pre-fetched during routing resolving
    this.msgs$ = this.content.stream('explore');

    

    // Listing all projects (using pagination)
    //this.projects$ = this.projects.paging({ limit: 10 });

    this.projects$ = this.streamProjects();
  }

  private streamProjects(): Observable<wmProject[]> {

    return this.route.queryParamMap.pipe(
      map( params => params.get('filter') ),
      switchMap( filter => {

        if(filter === 'mine') {
          return this.projects.get( ref => ref.where('author', '==', this.me) );
        }

        return this.projects.paging({ limit: 10 });
      })
    );

  }
}
