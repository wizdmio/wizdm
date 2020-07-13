import { DatabaseCollection, CollectionRef } from '../collection';
import { map, tap, distinctUntilChanged } from 'rxjs/operators';
import { DatabaseApplication, FieldValue } from '../database-application';
import { Observable, BehaviorSubject, merge } from 'rxjs';
import { DocumentData } from '../document';

/** The single shard composing the counter */
export interface CounterShard extends DocumentData {
  count: number;
}

/** Implements a DistributedCounter extending a DatabaseCollection */
export class DistributedCounter extends DatabaseCollection<CounterShard> {
  
  /** Observable streaming the counter value */
  readonly counter$: Observable<number>;
  private _counter$: BehaviorSubject<number>; 

  constructor(db: DatabaseApplication, ref: string|CollectionRef<CounterShard>, readonly shards) {
    super(db, ref);

    // Makes sure shards are fine
    if(shards <= 0) { throw new Error("Coounter shards must be a positive integer greater than 0"); }

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
          return sum + (shard.count || 0);
        }, 0) : 0;
      })
    );
  }

  /** Updates the counter by the given increment (or decrement) */
  public update(increment: number): Promise<any> {
    // Updates the local copy first to improve reactivity
    this._counter$.next(this._counter$.value + increment);
    // Pick a shard randomly
    const rnd = Math.floor(Math.random() * this.shards);
    const shard = this.ref.doc(rnd.toString());
    // Runs the shard update within a transaction
    return this.db.transaction( trx => {
      // Tests if the single shard exists (1 read)
      return trx.snap(shard).then( snap => {
        // Updates the shard value (1 write)
        if(snap.exists) { 
          // Uses the special FieldValue as increment
          const count: any = this.db.increment(increment);
          // Updates the shard (1 write)
          return trx.update(shard, { count });
        }
        // Creates the shard with the given initial value (1 write)
        return trx.set(shard, { count: increment });
      });
    });
  }

  // Creates the shards in a batch initializing the counter value
  public create(start = 0): Promise<void> {
    // Uses firestore references directly
    const batch = this.db.batch();
    // Inits the first shard with the starting value
    batch.set(this.ref.doc('0'), { count: start });
    // Loops to create the additional shards
    for(let i = 1; i < this.shards; i++) {
      batch.set(this.ref.doc(i.toString()), { count: 0 });
    }
    // Commit the changes
    return batch.commit();
  }
}
