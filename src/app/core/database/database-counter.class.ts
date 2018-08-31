import { Injectable } from '@angular/core';
import { dbDocument, dbCollection , DatabaseService } from './database.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';

/*
public distributedCounter<T>(ref: dbCounter shards: number = 3): DistributedCounter {
  return new DistributedCounter(this, ref, shards);
}
*/
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
        return !!counters ? counters.reduce( (sum, count) => 
          sum + count.count, 0
        ) : 0;
      }));
  }

  private create(start = 1) {
    // TODO: create counter shards in a batch
/*
    // DEBUG VERSION
    this.db.debug.next([
      { id: '1', count: start },
      { id: '2', count: 0 },
      { id: '3', count: 0 }
    ]);
*/
  }

  private updateShard(ref: dbDocument<CounterShard>, increment: number) {
    // TODO: update shard in a transaction
/*
    // DEBUG VERSION
    let shards = this.db.debug.value;
    let index = shards.findIndex( shard => shard.id === ref);
    shards[index].count += increment;
    this.db.debug.next(shards);

    console.log(this.db.debug.value);
*/
  }

  public update(increment: number) {

    // Loads the counter' shards
    this.load().subscribe( counter => {
      // Check for counter existance
      if(counter && counter.length > 0) {
        // Select a single shard randomly
        let rndShard = Math.floor(Math.random() * counter.length);
        // Updates the shard
        this.updateShard(counter[rndShard].id, increment)
      }
      // Or create the counter if needed
      else { this.create(1); }
    });
  }
}

