import { Component } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { DatabaseCollection, QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { DatabaseService } from '@wizdm/connect/database';
import { UserProfile, UserData } from 'app/navigator/providers/user-profile';
import { autocomplete } from 'app/utils/rxjs';

@Component({
  selector: 'wm-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent extends DatabaseCollection<UserData> {

  public name: string = '';
  public term: string = '';
  public highlight: RegExp;

  readonly search$ = new BehaviorSubject<string>('');

  readonly results$: Observable<QueryDocumentSnapshot<UserData>[]>;

  constructor(readonly me: UserProfile, db: DatabaseService) {

    super(db, 'users');

    this.results$ = this.search$.pipe(

      // Computes the search term
      map( name => name && name.toLowerCase().replace(/^\s+|\s+$/g,'') ),

      // Debounces the term for 500ms
      autocomplete(500),

      // Filters for real changes
      distinctUntilChanged(),

      // Updates the RegExp to highlight the results
      tap( term => this.highlight = new RegExp(`\\b${term||'\\B'}`, 'ig') ),

      // Queries the user's collection
      switchMap( term => this.query( qf => {

        // Prepare to list people matching the term or all of them when empty
        const query = term ? qf.where('searchIndex', 'array-contains', term) : qf;

        // Queries for up to 20 users ordered by full name
        return query.orderBy('fullName').limit(20);
      }))
    );
  }
}
