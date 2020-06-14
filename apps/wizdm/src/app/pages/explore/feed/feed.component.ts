import { DatabaseGroup, QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { DatabaseService } from '@wizdm/connect/database';
import { PostData } from './post/post.component';
import { Component } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'wm-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent extends DatabaseGroup<PostData> {

  readonly feed$: Observable<QueryDocumentSnapshot<PostData>[]>;

  constructor(db: DatabaseService) { 
    
    super(db, 'feed');

    this.feed$ = this.query(qf => qf.where('tags', 'array-contains', 'public').orderBy('created', 'desc') )
      .pipe( tap( snap => console.log(snap) ));
  }
}
