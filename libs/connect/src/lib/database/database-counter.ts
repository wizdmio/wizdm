import { DatabaseService } from './database.service';
import { DatabaseCollection } from './database-collection';
import { Observable, BehaviorSubject, merge } from 'rxjs';
import { map, tap, distinctUntilChanged } from 'rxjs/operators';

interface CounterShard {
  count : number,
  id?   : string
}

/**
 * Implements a DistributedCounter extending a DatabaseCollection
 */
export class DistributedCounter extends DatabaseCollection<CounterShard> {
  
  /** Observable streaming the counter value */
  private _counter$: BehaviorSubject<number>; 
  readonly counter$: Observable<number>;

  /** Returns the latest counter value */
  get counter() { return this._counter$.value; }

  constructor(db: DatabaseService, path: string, public readonly shards) {
    super(db, path);

    // Creates a local copy of the counter 
    this._counter$ = new BehaviorSubject<number>(0);
    // Builds the counter observable merging the local counter with the remote one to improve reactivity
    this.counter$ = merge( 
      // Merges the local counter copy...
      this._counter$,
      // With the distributed counter value, keeping the local copy up to do date 
      this.accumulate().pipe( tap( counter => this._counter$.next(counter) ) )
      // Distinct only effective counter changes
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
    const col = this.col().ref;
    const batch = this.db.batch();
    // Loops to create the shards
    for(let i = 0; i < this.shards; i++) {
      const value = i === 0 ? start : 0;
      batch.set(col.doc(i.toString()), { count: value });
    }
    // Commit the changes
    return batch.commit();
  }

  // Updates a given shard in an atomic transaction
  private updateShard(shard: string, increment: number): Promise<void> {

    // Uses firestore references directly
    const col = this.col().ref;
    const ref = col.doc(shard);
    // Runs a transaction to increment the given shard
    return this.db.transaction( t => {
      return t.get(ref)
        .then( doc => {
          const count = doc.data().count + increment;
          t.update(ref, { count });
        });
    })
  }

  /**
   * Updates the counter by the given increment (or decrement)
   */
  public update(increment: number): Promise<void> {

    // Updates the local copy first to improve reactivity
    this._counter$.next(this.counter + increment);

    // Loads the counter' shards
    return this.get().toPromise()
      .then( counter => {
      // Check for counter existance
      if(counter && counter.length > 0) {
        // Select a single shard randomly
        const rnd = Math.floor(Math.random() * counter.length);
        // Updates the shard
        return this.updateShard(rnd.toString(), increment);
      }
      // Or create the counter if needed
      return this.create(increment);
    });
  }
}