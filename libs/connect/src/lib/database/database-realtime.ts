import { DatabaseService } from './database.service';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { PagedCollection, PageConfig } from './database-paged';
import { map, startWith } from 'rxjs/operators';

/**
 * Extends PagedColletion with realtime contents capabilities
 */
export class RealtimeCollection<T> extends PagedCollection<T> {

  readonly rt = true;

  constructor(db: DatabaseService, path: string, opts?: PageConfig) {
    super(db, path, opts);
  }

  // Overwrites the ouput mapping function turning data payloads into streams 
  protected output(doc: QueryDocumentSnapshot<T>) {
    // Wraps the inner doc reference with an angularfire2 document
    const ref = this.db.fire.doc<T>(doc.ref);
    // Stream the document into a snapshotChange observable
    return ref.snapshotChanges().pipe(
      // Starts with the content already got by the page
      startWith(super.output(doc)),
      // Maps the observable content using the original output operator
      map( snapshot => {
        return super.output(snapshot.payload);
    }));
  }
}