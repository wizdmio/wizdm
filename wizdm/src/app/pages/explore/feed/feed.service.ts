import { Injectable } from '@angular/core';
import {DatabaseCollection, DatabaseGroup, QueryDocumentSnapshot} from '@wizdm/connect/database/collection';
import { DatabaseService } from '@wizdm/connect/database';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {PostData} from 'app/pages/explore/feed/feed-types';



@Injectable({
  providedIn: 'root'
})
export class FeedService extends DatabaseCollection<PostData>{

  public data$: Observable<QueryDocumentSnapshot<PostData>>;
  public data: PostData;

  constructor(db: DatabaseService){
    super(db)
  }

}
