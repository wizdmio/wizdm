import { DatabaseGroup, QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { DatabaseService } from '@wizdm/connect/database';
import { PostData } from '../post/post.component';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'wm-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent extends DatabaseGroup<PostData> {

  readonly shared$: Observable<QueryDocumentSnapshot<PostData>[]>;

  constructor(db: DatabaseService) { 
    
    super(db, 'shared');

    this.shared$ = this.query(qf => qf.where('public', '==', true).orderBy('created', 'desc') )
      .pipe( tap( snap => console.log(snap) ));
  }
}
