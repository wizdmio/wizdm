import { DatabaseCollection, CollectionRef } from '../collection';
import { map, tap, distinctUntilChanged } from 'rxjs/operators';
import { DatabaseApplication } from '../database-application';
import { Observable, BehaviorSubject, merge } from 'rxjs';
import { DocumentData } from '../document';

/** The single shard composing the counter */
export interface CounterShard extends DocumentData {
  count: number
}

/** Implements a DistributedCounter extending a DatabaseCollection */
export class DistributedCounter extends DatabaseCollection<CounterShard> {
  
  /** Observable streaming the counter value */
  readonly counter$: Observable<number>;
  private _counter$: BehaviorSubject<number>; 

  constructor(db: DatabaseApplication, ref: string|CollectionRef<CounterShard>, public readonly shards) {
    super(db, ref);

    // Creates a local copy of the counter 
    this._counter$ = new BehaviorSubject<number>(0);
    // Builds the counter observable merging the local counter with the remote one to improve reactivity
    this.counter$ = merge( 
      // Merges the local counter copy...
      this._counter$,
      // With the distributed counter value, keeping the local copy up to do date 
      this.accumulate().pipe( tap( counter => this._counter$.next(counter) ) )
      // Distinca only effective counter changes
    ).pipe( distinctUntilChanged() );
  }

  // Streams the current counter value accumulating the shards
  private accumulate() {

    return this.stream().pipe( 
      map( counters => {
        return !!counters ? counters.reduce( (sum, shard) => {
          return sum + shard.count || 0;
        }, 0) : 0;
      })
    );
  }

  // Creates the shards in a batch initializing the counter value
  private create(start = 0): Promise<void> {
    // Uses firestore references directly
    const batch = this.db.batch();
    // Loops to create the shards
    for(let i = 0; i < this.shards; i++) {
      const value = i === 0 ? start : 0;
      batch.set(this.ref.doc(i.toString()), { count: value });
    }
    // Commit the changes
    return batch.commit();
  }

  /** Updates the counter by the given increment (or decrement) */
  public update(increment: number): Promise<void> {
    // Updates the local copy first to improve reactivity
    this._counter$.next(this._counter$.value + increment);
    // Loads the counter' shards
    return this.get().then( counter => {
      // Check for counter existance
      if(counter && counter.length > 0) {
        // Select a single shard randomly
        const rnd = Math.floor(Math.random() * this.shards);
        // Updates the shard using an increment FieldValue
        const count = this.db.increment(increment) as any;
        return this.ref.doc(rnd.toString()).update({ count });        
      }
      // Or create the counter if needed
      return this.create(increment);
    });
  }
}