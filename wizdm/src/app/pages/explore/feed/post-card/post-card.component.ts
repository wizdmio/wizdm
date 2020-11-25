import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatabaseService } from '@wizdm/connect/database';
import { QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { DatabaseDocument } from '@wizdm/connect/database/document';
import { PostData } from '../post/post.component';

@Component({
  selector: 'wm-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent extends DatabaseDocument<PostData> {

  @Input() toggleFavorites;
  @Input() likers;
  postData: PostData;

  @Input() set data(postSnapShot: QueryDocumentSnapshot<PostData>){
    this.postData = this.unwrap(postSnapShot);
  };

  @Input() userFirstName: string;
  @Input() userImage: string;
  @Output() likes = new EventEmitter<string>();


  constructor(db: DatabaseService) {
    super(db);
  }

public toggleLikes(value) {
    this.likes.emit(value)
  }


}
