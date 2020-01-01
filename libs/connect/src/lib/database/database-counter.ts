import { DatabaseApplication, CollectionRef } from './database-application';
import { DatabaseCollection } from './database-collection';
import { dbCommon } from './database-document';
import { Observable, BehaviorSubject, merge } from 'rxjs';
import { map, tap, distinctUntilChanged } from 'rxjs/operators';

interface CounterShard extends dbCommon {
  count : number
}

/** Implements a DistributedCounter extending a DatabaseCollection */
export class DistributedCounter extends DatabaseCollection<CounterShard> {
  
  /** Observable streaming the counter value */
  readonly counter$: Observable<number>;
  private _counter$: BehaviorSubject<number>; 

  constructor(db: DatabaseApplication, ref: CollectionRef, public readonly shards) {
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
        // Updates the shard or create a new one when scaling up
        return this.updateShard(rnd.toString(), increment);
      }
      // Or create the counter if needed
      return this.create(increment);
    });
  }

  // Updates a given shard in an atomic transaction
  private updateShard(shard: string, increment: number): Promise<void> {
    // Uses firestore references directly
    const ref = this.ref.doc(shard);
    // Runs a transaction to increment the given shard
    return this.db.transaction( trx => {
      return trx.get(ref).then( snap => {
        // Reads the shard, when existing, falling back to {}
        const data = snap.data() || {};
        // Computes the new count value
        const count = (data.count || 0) + increment;
        // Updates the existing shard or creates a new one
        trx.set(ref, { count });
      });
    })
  }
}