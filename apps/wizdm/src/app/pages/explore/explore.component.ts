import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfile } from '@wizdm/connect';
import { NavigatorService } from '../../navigator';
import { ProjectService, wmProject } from '../../core/project';
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

  public projects$: Observable<wmProject[]>;
  
  get me() { return this.profile.id || ''; }
  
  constructor(private projects  : ProjectService,
              private profile   : UserProfile,
              private navigator : NavigatorService,
              private router    : Router, 
              private route     : ActivatedRoute ) {    

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

  // Opens the project editor 
  public openProject(id: string) { return this.router.navigate([id], { relativeTo: this.route }); }

  // Navigates redirecting whenever necessary
  public navigate(url: string) { return this.navigator.navigateByUrl(url); }
}
