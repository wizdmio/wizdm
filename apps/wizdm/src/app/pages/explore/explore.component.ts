import { DocumentData } from '@wizdm/connect/database/document';
import { DatabaseService } from '@wizdm/connect/database';
import { Component } from '@angular/core';

@Component({
  selector: 'wm-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent {

  //readonly places$: Observable<QueryDocumentSnapshot<PlaceData>[]>;

  constructor(db: DatabaseService) { 
    
    // Streams the array of places ordering them by ascending names 
    //this.places$ = this.query();//this.stream();//paging({ limit: 10, field: 'name' });
  }

}
