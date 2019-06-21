import { DatabaseService } from './database.service';
import { DatabaseCollection } from './database-collection';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface CounterShard {
  count : number,
  id?   : string
}

/**
 * Implements a DistributedCounter extending a DatabaseCollection
 */
export class DistributedCounter extends DatabaseCollection<CounterShard> {
  
  /** Observable streaming the counter value */
  readonly counter$: Observable<number>;

  constructor(db: DatabaseService, path: string, public readonly shards) {
    super(db, path);
    
    // Streams the current counter value accumulating the shards
    this.counter$ = this.stream().pipe( 
      map( counters => {
        return !!counters ? counters.reduce( (sum, shard) => {
          return sum + shard.count;
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
