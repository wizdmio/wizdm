import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { ContentManager } from 'app/content';
import { searchAnimations } from './search-animations';

@Component({
  selector: 'ut-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: searchAnimations
})
export class SearchComponent implements OnInit {

  @HostBinding('@search') reveal: boolean = true; 

  @HostBinding('@morphSearch') get triggerMorph() {
    return this.search ? 'open' : 'close'; }

  @Input() search: boolean = false;
  @Output() searchChange = new EventEmitter<boolean>();
  
  //private open: boolean = false;
  private msgs: any;

  constructor(private content: ContentManager) { }

  ngOnInit() { 

    this.msgs = this.content.select("navigator.search");
  }

  private toggle(open = true) {
    this.searchChange.emit(this.search = open);
  }
}
