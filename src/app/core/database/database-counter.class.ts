import { dbDocument, dbCollection , DatabaseService } from './database.service';
import { Observable } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';

export interface CounterShard {
  count : number,
  id?   : string
}

export type dbCounter = dbCollection<CounterShard>;

export class DistributedCounter {

  counter$: Observable<number>;

  constructor(private db: DatabaseService, private ref: dbCounter, public readonly shards) {

    this.counter$ = this.accumulate();
  }

  private query(): Observable<CounterShard[]> {
    return this.db.collection$<CounterShard>(this.ref);
  }

  private load(): Observable<CounterShard[]> {
    return this.query().pipe( take(1) );
  }

  private accumulate(): Observable<number>{
    return this.query()
      .pipe( map( counters => {
        return !!counters ? counters.reduce( (sum, shard) => 
          sum + shard.count, 0
        ) : 0;
      }));
  }

  private create(start = 1): Promise<void> {
    
    const batch = this.db.batch();
    const ref = this.db.col(this.ref).ref;

    for(let i = 0; i < this.shards; i++) {
      const value = i === 0 ? start : 0;
      batch.set(ref.doc(i.toString()), { count: value });
    }

    return batch.commit();
  }

  private updateShard(shard: string, increment: number): Promise<void> {
    
    const col = this.db.col(this.ref).ref;
    const ref = col.doc(shard);

    return this.db.transaction( t => {
      return t.get(ref)
        .then( doc => {
          const count = doc.data().count + increment;
          t.update(ref, { count });
        });
    })
  }

  public update(increment: number): Promise<void> {
    // Loads the counter' shards
    return this.load().pipe( 
      switchMap( counter => {
      // Check for counter existance
      if(counter && counter.length > 0) {
        // Select a single shard randomly
        let rnd = Math.floor(Math.random() * counter.length);
        // Updates the shard
        return this.updateShard(rnd.toString(), increment);
      }
      // Or create the counter if needed
      return this.create(1);
    })).toPromise();
  }
}

