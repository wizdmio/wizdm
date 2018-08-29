import { DatabaseService, QueryFn, dbCollection } from './database.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, scan, take, tap } from 'rxjs/operators';

export interface PageConfig {
  field?   : string,  // Sorting field
  limit?   : number,  // limit per query
  reverse? : boolean, // reverse order
  prepend? : boolean  // prepend to source
}

export class PagedCollection<T> {  

  // Configuration options
  private query: PageConfig;

  // Observable for data consumpion
  private _data$ = new BehaviorSubject<any[]>([]);
  public data$: Observable<T[]>;

  // Observable to track the loading status
  private _loading$ = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this._loading$.asObservable();

  // Observable to track data loading completion
  private _done$ = new BehaviorSubject<boolean>(false);
  public done$: Observable<boolean> = this._done$.asObservable();

  // Creates the pagination object
  constructor(private db: DatabaseService, private ref: dbCollection<T>, private opts?: PageConfig) { 

    // Initzialize the page configuration
    this.query = {
      field: 'created',
      limit: 2,
      reverse: false,
      prepend: false,
      ...opts
    };

    // Create the observable array for data consumption
    this.data$ = this._data$.pipe(
      // Maps the snapshots into the suitable output format
      map( snaps => snaps.map( (doc: any) => {
        const data = doc.data();
        const id = doc.id;
        return ( (typeof data !== 'undefined') ? { ...data, id } as T : undefined );
      })),
      // Reverse the array when prepending
      map( values => this.query.prepend ? values.reverse() : values ),
      // Accumulates the resulting array
      scan( (acc, val) => 
        this.query.prepend ? val.concat(acc) : acc.concat(val)
      ),
      // Resets the loading status
      tap( () => this._loading$.next(false) )
    );

    // Sets the loading status
    this._loading$.next(true);

    // Pushes the first page into the data observable
    this.db.snapshots$<T>(this.ref, this.queryPage())
      .pipe( take(1) )
      .subscribe( values => this._data$.next(values) );
  }

  // Computes the pagination query
  private queryPage(qf?: QueryFn): QueryFn {
    return ref => 
      qf ? qf( ref.orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc').limit(this.query.limit) )
        : ref.orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc').limit(this.query.limit);
  }

  // Retrieves more data and push them into the output observable
  public more(): void {

    // Skips when no more values or still loading
    if(this._done$.value || this._loading$.value) { return };

    // Sets the loading status
    this._loading$.next(true);
    
    // Gets the current cursor position
    const cursor = this.getCursor()

    // Pushes the next page into the data observable
    this.db.snapshots$<T>(this.ref, this.queryPage( ref => ref.startAfter(cursor) ))
      .pipe( take(1) )
      .subscribe( values => {
        
        this._data$.next(values); 

        // Marks done when no more values
        if(!values.length) {
          this._done$.next(true)
        }
      });
  }

  // Determines the current cursor to paginate the next request
  private getCursor() {
    const current = this._data$.value;
    return (current.length) ? 
      ( this.query.prepend ? current[0].doc : current[current.length - 1].doc ) 
        : null;
  }

  // Reset the page
  public reset(): void {
    this._data$.next([]);
    this._done$.next(false);
  }
}
