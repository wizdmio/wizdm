import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService, PagedCollection } from '@wizdm/connect/database';
import { Member } from 'app/core/member';
import { wmStory } from 'app/core/stories';
import { Observable } from 'rxjs';


@Component({
  selector: 'wm-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
  host: { 'class': 'wm-page adjust-top content-padding' }
})
export class ExploreComponent extends PagedCollection<wmStory> {

  public stories$: Observable<any[]>;
  
  constructor(db: DatabaseService, readonly member: Member, private router: Router, private route: ActivatedRoute) {    

    super(db, db.col(`stories`));

    // Listing all projects (using pagination)
    //this.projects$ = this.projects.paging({ limit: 10 });

    // Lists all the stories paging by 10
    this.stories$ = this.paging({ limit: 10 });
  }

  public get noNewStoryAllowed(): boolean {
    return false;
  }

  public newStory() {

  }

  /** Opens the story for reading/editing */
  public open(id: string) {

    // Navigates relatively to the current route triggering the story editor
    return this.router.navigate([id], { relativeTo: this.route });
  }
/*
  private streamProjects(): Observable<any[]> {

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
*/
}
