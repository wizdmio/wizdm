import { tap, map, filter, switchMap, distinctUntilChanged, startWith, shareReplay } from 'rxjs/operators';
import { where, orderBy, limit, snap, page, data } from '@wizdm/connect/database/collection/operators';
import { DatabaseCollection } from '@wizdm/connect/database/collection';
import { DatabaseService } from '@wizdm/connect/database';
import { ScrollObservable } from 'app/utils/scrolling';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserData } from 'app/utils/user';
import { autocomplete } from '@wizdm/rxjs';
import { Component } from '@angular/core';

@Component({
  selector: 'wm-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent extends DatabaseCollection<UserData> {

  /** Name to search for */
  public name: string = '';

  /** RegExp to highlight the search results */
  public highlight: RegExp;

  /** Searching observables */
  readonly search$ = new BehaviorSubject<string>('');
  readonly items$: Observable<UserData[]>;

  private _loading$ = new BehaviorSubject<number>(0);
  readonly loading$: Observable<number[]>;

  // Tracks the result list by user id
  public trackById(index: number, item: UserData) { return item.id; }

  constructor(db: DatabaseService, scroll: ScrollObservable) {

    super(db, 'users');

    // Loading observable returning the array of skeleton items to display during loading
    this.loading$ = this._loading$.pipe( map( length => Array(length).fill(0) ) );

    // Paging observalbe to load the next page while scrolling
    const more$ = scroll.pipe( 
      // Triggers the next page when approaching the bottom
      map( scroll => scroll.bottom < 250 ),
      // Filters for truthfull changes
      startWith(true), distinctUntilChanged(), filter( value => value ),
      // Shows the loading items
      tap( () => this._loading$.next(20) ),
      // Asks for the next 20 contacts
      map( () => 20 )
    );

    // All items paged result observable. 
    const paged$ = this.pipe( 
      // Pages 20 items at a time
      orderBy('fullName'), page(more$), data(), 
      // Hides the loading items when done
      tap( () => this._loading$.next(0) ),
      // Buffers the results to avoid reloading after a search
      shareReplay(1)
    );

    // Searching term observable
    const term$ = this.search$.pipe(
      // Computes the search term
      map( name => name && name.toLowerCase().replace(/^\s+|\s+$/g,'') ),
      // Debounces the term for 500ms
      autocomplete(500),
      // Filters for real changes
      distinctUntilChanged(),
      // Updates the RegExp to highlight the results
      tap( term => this.highlight = new RegExp(`\\b${term||'\\B'}`, 'ig') ),
      // Shows some loading item
      tap( term => this._loading$.next(term.length === 1 ? 10 : 0 ) )
    );

    // Searched items result obserable
    const search$ = (term: string) => this.pipe( 
      // Queries for up to 20 items containing the term 
      orderBy('fullName'), where('searchIndex', 'array-contains', term), limit(10), snap(), data(),
      // Hides the loading items when done
      tap(() => this._loading$.next(0) )
    );

    // Overall items combined
    this.items$ = term$.pipe( switchMap( term => term ? search$(term) : paged$ ) );
  }
}
