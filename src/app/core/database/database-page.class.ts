import { DatabaseService, dbQueryRef, dbQueryFn, dbCollection, dbDocumentChangeAction, dbQuerySnapshot } from './database.service';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { map, filter, scan, takeUntil, switchMap, tap } from 'rxjs/operators';

export type PagePostProcessOp<T> = () => (data: Observable<T[]>) => Observable<T[]>;

export interface PageConfig<T> {
  field?   : string,  // Sorting field
  limit?   : number,  // limit per query
  reverse? : boolean, // reverse order
  prepend? : boolean,  // prepend to source

  // Optional post processing operator to customize the paged item content
  // before appending them to the the final data array
  postProcess? : PagePostProcessOp<T>
}

export class PagedCollection<T> {  

  // Configuration options
  private query: PageConfig<T>;

  private newData() {
    return new BehaviorSubject<Observable<dbDocumentChangeAction<T>[]>>(of([]));
  }

  // Observable for data streaming
  private _data$: BehaviorSubject<Observable<dbDocumentChangeAction<T>[]>>;
  public data$: Observable<T[]>;

  // Observable to track the loading status
  private _loading$ = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this._loading$.asObservable();

  // Observable to track data loading completion
  private _done$ = new BehaviorSubject<boolean>(false);
  public done$: Observable<boolean> = this._done$.asObservable();

  // Page cursor keeping track of the current page position
  private cursor: dbQuerySnapshot<T>;

  // Dispose observable to release all the pages when done
  private _dispose$ = new Subject<void>();

  // Creates the pagination object
  constructor(private db: DatabaseService, private ref: dbCollection<T>, opts?: PageConfig<T>) { 

    // Initzialize the page configuration
    this.query = this.init(opts);

    // Build the observable for paged data streaming
    this.data$ = this.buildDataStream();

    // Pushes the first page into the data observable
    this.more();
  }

  // Merges page configuration default values with the optional ones
  private init(opts?: PageConfig<T>): PageConfig<T> {
    return {
      // Sort on creation date
      field: 'created',

      // Limit items to 10 by default
      limit: 5,

      // Prepend items straight to the output array
      reverse: false,
      prepend: false,

      // Do nothing while post processing by default
      postProcess: () => (nothing: Observable<T[]>) => nothing,

      // Overwrite with user custom options if any
      ...opts
    };
  }

  private buildDataStream(): Observable<T[]> {

    this._data$ = this.newData();
    
    // Create the observable array for data consumption
    return this._data$.pipe(
      // Resolves the page observable into its content (still using the internal representation)
      switchMap( actions => actions ),

      //filter( actions => actions.length > 0),

      // Maps the internal data representation into the output data format
      map( actions => {

        // Marks done when no more values are left
        if(actions.length == 0) {
          this._done$.next(true);
        }
        else {
          // Keeps track of the cursor position for next page query
          const action = this.query.prepend ? actions[0] : actions[actions.length - 1];
          this.cursor = action ? action.payload.doc : null;
        }

        // Maps the internal document change action into the output data
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return ( (typeof data !== 'undefined') ? { ...data as any, id } as T : undefined );
        });
      }),

      // Perform optional post processing before appending to the final array
      this.query.postProcess(),
/*
      // Reverse the array when prepending is requested
      map( values => { 
        return this.query.prepend ? values.reverse() : values;
      }),
*/
      // Accumulates the resulting array
      scan( (acc, val) => {

        val.forEach( (v: any) => {

          const index = acc.findIndex( (a: any) => a.id === v.id);
          
          if(index < 0) {
            if(this.query.prepend) {
              acc.unshift(v);
            } else {
              acc.push(v);
            }
          }
          else {
            acc[index] = v;
          }
/*
          if(v._type === 'modified') {
            const index = acc.findIndex( (a: any) => a.id === v.id);
            acc[index] = v;
          }

          if(v._type === 'deleted') {
            const index = acc.findIndex( (a: any) => a.id === v.id);
            acc.splice(index, 1);
          }
*/
        });

        return acc;
      }),

      // Resets the loading status at the end of the page
      tap( projects => {
        this._loading$.next(false);
      })
    );
  }

  // Helper to compute the pagination query function
  private get queryPage(): dbQueryFn {
    return ref => {
      if(this.query.field) {
        ref = ref.orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc');  
      }

      if(this.query.limit) {
        ref = ref.limit(this.query.limit);
      }

      if(this.cursor) {
        ref = ref.startAfter(this.cursor);
      }
      return ref;
    }
  }

  // Retrieves data and push them into the output observable
  public more(): void {

    // Skips when no more values or still loading
    if(this._done$.value || this._loading$.value) { return };

    // Sets the loading status
    this._loading$.next(true);

    // Query for the next page observable
    const page$ = this.db.col(this.ref, this.queryPage )
      .snapshotChanges()
      .pipe( takeUntil(this._dispose$) );

    // Pushes the next page into the data stream
    this._data$.next(page$);
  }

  public dispose() {
    this._dispose$.next();
    this._dispose$.complete();
  }

  // Reset the page
  public reset(): void {

    this.dispose();

    this.cursor = null;
    
    // Build the observable for paged data streaming
    this.data$ = this.buildDataStream();
    
    this._dispose$ = new Subject<void>();

    this._done$.next(false);
  }
}
