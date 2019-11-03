import { QuerySnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { DatabaseApplication, dbCollectionRef, dbQuery } from './database-application';
import { DatabaseCollection } from './database-collection';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map, scan } from 'rxjs/operators';

export type PagePostProcessOp<I,O> = (data: Observable<I[]>) => Observable<I[]|O[]>;

export interface PageConfig {
  field?   : string,  // Sorting field
  limit?   : number,  // limit per query
  reverse? : boolean, // reverse order
  prepend? : boolean  // prepend to source
}

/** Extends DatabaseColletion implementing paged streaming to support infinite scrolling */
export class PagedCollection<T> extends DatabaseCollection<T> {  
  
  // Configuration options
  protected config: PageConfig;
  
  // An empty QuerySnapshot
  private get emptyQuerySnapshot() { return { empty: true, docs: []} as QuerySnapshot<T>; }
  
  // Observable for data streaming
  private _data$ = new BehaviorSubject(this.emptyQuerySnapshot);
  
  // Page cursor keeping track of the current page position
  private cursor: QueryDocumentSnapshot<T>
  
  // Observable streaming the loading status
  protected _loading$ = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this._loading$.asObservable();
  
  // Observable streaming the loading completion
  protected _done$ = new BehaviorSubject<boolean>(false);
  public done$: Observable<boolean> = this._done$.asObservable();

  constructor(db: DatabaseApplication, ref: dbCollectionRef) { 
    super(db, ref);
  }

  // Merges page configuration default values with the optional ones
  protected init(opts?: PageConfig): PageConfig {
    return {
      // Sort on creation date
      field: 'created',
      // Limit items to 10 by default
      limit: 20,
      // Prepend items straight to the output array
      reverse: false,
      prepend: false,
      // Overwrite with user custom options if any
      ...opts
    };
  }

  // Helper to map the internal document representation into the output format
  protected output(doc: QueryDocumentSnapshot<T>) {
    const data = doc.data();
    const id = doc.id;
    return ( (typeof data !== 'undefined') ? { ...data as any, id } : undefined );
  }

  /**
   * Streams the collection content as pages of documents array 
   * @param opts (optional) the page configuration
   */
  public paging<O=T>(opts?: PageConfig): Observable<O[]> {
    // Initzialize the page configuration
    this.config = this.init(opts);
    // Makes sure the page is empty
    this.reset();
    // Ask for the first page
    this.more();
    // Returns the observable array for data consumption
    return this._data$.pipe(
      // Maps the internal data representation into the output data format
      map( snapshot => (snapshot.docs || []).map(doc => this.output(doc)) ),
      // Reverse the array when prepending is requested
      map( values => this.config.prepend ? values.reverse() : values ),
      // Accumulates the resulting array
      scan<O[]>( (acc, val) =>  this.config.prepend ? val.concat(acc) : acc.concat(val) ),
      // Resets the loading status
      tap( () =>  this._loading$.next(false) )
    );
  }

  /** Resets the paging */
  public reset(): void {
    // Resets the cursor
    this.cursor = null;
    // Resets the 'done' flag
    if(this._done$.value) { 
      this._done$.next(false); 
    }
    // Empties the output stream
    if(!this._data$.value.empty) {
      this._data$.next(this.emptyQuerySnapshot);
    }
  }

  /**
   * Retrieves the next page into the stream
   * @param limit optionally custumize the number of document to retrive.
   */
  public more(limit?: number): void {
    // Skips when no more values or still loading
    if(this._done$.value || this._loading$.value) { return };
    // Sets the loading status
    this._loading$.next(true);

    // Gets the next page and pushes it into the data stream
    this.queryPage(this.ref).get().then( (page: QuerySnapshot<T>) => {
      // Notifies when done
      if(page.size === 0) {
        this._loading$.next(false);
        this._done$.next(true);
        return;
      }
      // Tracks the cursor for the next page
      const docs = page.docs;
      this.cursor = this.config.prepend ? docs[0] : docs[docs.length - 1];
      // Pushes the data along the output stream
      this._data$.next(page);
    });
  }

  // Helper to compute the pagination query function according to the current configuration
  private queryPage(ref: dbCollectionRef|dbQuery): dbCollectionRef|dbQuery {
    
    // Order by the configured field (creation dated by default)
    if(this.config.field) { ref = ref.orderBy(this.config.field, this.config.reverse ? 'desc' : 'asc');}
    // Limit the request to the page size
    if(this.config.limit) { ref = ref.limit(this.config.limit);}
    // Set the starting poit at the current cursor position
    if(this.cursor) { ref = ref.startAfter(this.cursor); }

    return ref;
  }
}