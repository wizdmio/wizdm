import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { BehaviorSubject, Observable } from 'rxjs';
import { PostData } from '../post/post.component';

@Component({
  selector: 'wm-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent  {

  @Input() post: Observable<QueryDocumentSnapshot<PostData>>
  @Input() toggleFavorites;
  @Input() likers;
  @Input() data: PostData;
  @Output() likes = new EventEmitter<string>();



  constructor() { }

  public toggleLikes() {
    this.likes.emit()
  }


}
