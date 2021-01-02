import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { PostData } from '../post/post.component';
import { $animations } from './post-card.animation';

@Component({
  selector: 'wm-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  animations: $animations
})
export class PostCardComponent implements OnInit {

  @Output() toggleLikes = new EventEmitter<boolean>(false);
  @Input() likes: Observable<number>;
  @Input() favorite: Observable<boolean>;

  @Input() data: PostData = {};

  @Input() userFirstName: string;
  @Input() userImage: string;

  constructor() { }


  ngOnInit(): void {
  }

}
