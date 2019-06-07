import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { $animations } from './likes.animations';

@Component({
  selector: 'wm-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.scss'],
  animations: $animations,
  host: { class: 'wm-likes' }
})
export class LikesComponent implements OnInit {

  constructor() { }
  ngOnInit() { }

  @Input() readonly = false;

  @Input() counter = 0;

  @Input() favorite: boolean = false;
  @Output() changeFavorite = new EventEmitter<boolean>();

  get likes(): string {
    return this.counter > 0 ? this.counter.toString() : '';
  }

  get icon(): string {
    return this.favorite ? 'favorite' : 'favorite_border';
  }

  public toggle(): void {
    this.changeFavorite.emit(this.favorite = !this.favorite);
  }
}
