import { query, stream, onSnapshot, where, orderBy, limit, endBefore, docs, snap } from '@wizdm/connect/database/collection/operators';
import { DatabaseGroup, QueryDocumentSnapshot } from '@wizdm/connect/database/collection';
import { DatabaseService } from '@wizdm/connect/database';
import { PostData } from './post/post.component';
import { Component } from '@angular/core';
import { filter, take, map, expand, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'wm-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent extends DatabaseGroup<PostData> {

  readonly feed$: Observable<QueryDocumentSnapshot<PostData>[]>;

  constructor(db: DatabaseService) { 
    
    super(db, 'feed');

    /** 
     * This is the simplest query for all the public posts. THe problem of this approach is that you'll get the full list of all posts
     * updated every time a new post comes up (and dont forget we pay firestore for every document read). 
     */
    this.feed$ = this.query( qf => qf.where('tags', 'array-contains', 'public').orderBy('created', 'desc') );

    /** 
     * The easiest workaround is to limit the number of documents we want to retrieve, so, here we'll query for up to 10 posts.
     * Still, every new post will trigger an uo to 10 documents read.
     */
    this.feed$ = this.query( qf => qf.where('tags', 'array-contains', 'public').orderBy('created', 'desc').limit(10) );

    /** 
     * DatabaseGroup, like DatabaseCollection, inherits from DatabaseQuery that inherits from Observable, so, they are basically obserables themselves. 
     * They come with a set of operators to shape complex queries to the database. The following is the exact equivalente of the previous query() call.
     * (in fact, this is actually the way query() is implemented)
     */
    this.feed$ = this.pipe( query( qf => qf.where('tags', 'array-contains', 'public').orderBy('created', 'desc').limit(10) ), stream(this.db.zone) );

    /** 
     * Similarly, query() and stream() operators can be de-structured in their parts with simpler operators. 
     * The where(), orderBy(), limit() and the other query opertators are desined to work conditionally. So if the arguments passed along are valid, 
     * the operator is appplied to the query, if null or undefined, the operator does nothing (an does not throw any error. */
    this.feed$ = this.pipe( where('tags', 'array-contains', 'public'), orderBy('created', 'desc'), limit(10), onSnapshot(this.db.zone), docs() );

    /** 
     * This approach let us combine the query with all the others rxjs operators to implement more advanced queries.
     * With this example we statically read up to 50 posts and listen to the new comers to be pre-pended.
     * This implementation only read the old posts once while every new post triggers just as much document read as the new posts are.
     */
    this.feed$ = this.pipe( 

      // Read up to 50 posts statically
      where('tags', 'array-contains', 'public'), orderBy('created', 'desc'), limit(50), snap(),

      // Expands to pre-pend the latest comers
      expand( oldOnes => this.pipe(

        // Streams the new posts created after the ones we already listed 
        where('tags', 'array-contains', 'public'), orderBy('created', 'desc'), endBefore(oldOnes[0]), stream(this.db.zone),

        // Filters out emty read (firestore always starts with an emty emission) to than take the first contentful emission
        filter( newOnes => newOnes.length > 0 ), take(1), 
        
        // Appends the old posts to the new comers and recur
        map( newOnes => newOnes.concat(oldOnes) )
      ))
    );

    /** 
     * The same can be achieved with a custom operator to re-use the same query and make it clearer
     */
    this.feed$ = this.pipe( 

      // Query for the public posts in descending order by creation date
      where('tags', 'array-contains', 'public'), orderBy('created', 'desc'), 
      
      // Custom operator
      source => source.pipe( 
        
        // Let's read up to 50 old posts
        limit(50), snap(),

        // Let's pre-pend the new posts
        expand( oldOnes => source.pipe(

          endBefore(oldOnes[0]), stream(this.db.zone),

          filter( newOnes => newOnes.length > 0 ), take(1), 
          
          map( newOnes => newOnes.concat(oldOnes) )
        ))
      )
    );

    /** 
     * We can also de-structure the stream() operator gainng finer access control to the data coming from the database
     */
    this.feed$ = this.pipe( 

      // Query for the public posts in descending order by creation date
      where('tags', 'array-contains', 'public'), orderBy('created', 'desc'), 
      
      // Custom operator
      source => source.pipe( 
        
        // Let's read up to 50 old posts
        limit(50), snap(),

        // Let's pre-pend the new posts
        expand( oldOnes => source.pipe(

          // Streams the latest document snapshot
          endBefore(oldOnes[0]), onSnapshot(this.db.zone),

          // Filters out not only the empty emissions but also the local ones (still having pending writes).
          filter( newOnes => newOnes.size > 0 && !newOnes.metadata.hasPendingWrites ), 
          
          // Extracts the document snapshots from the query snapshot and proceedes
          docs(), take(1), 
          
          map( newOnes => newOnes.concat(oldOnes) )
        ))
      )
    );
  }
}
