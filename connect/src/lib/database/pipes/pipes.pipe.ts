import { DocumentSnapshot, DocumentData } from '../document/types';
import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '../database-application';
import { mapSnaphotData } from '../document/utils';
import { firestore } from 'firebase/app';

@Pipe({ name: 'snapshotData' })
export class SnapshotDataPipe implements PipeTransform {

  transform<T extends DocumentData>(value: DocumentSnapshot<T>): T {

    return value instanceof firestore.DocumentSnapshot ? mapSnaphotData<T>(value) : value;
  }
}

@Pipe({ name: 'timestamp' })
export class TimestampPipe implements PipeTransform {

  transform(value: Timestamp): Date {

    return value instanceof firestore.Timestamp ? value.toDate() : value;
  }
}

@Pipe({ name: 'createdTime' })
export class CreatedTimePipe implements PipeTransform {

  transform<T extends DocumentData>(value: T|DocumentSnapshot<T>): Date {

    const data = value instanceof firestore.DocumentSnapshot ? mapSnaphotData<T>(value) : value;

    return data?.created?.toDate();
  }
}

@Pipe({ name: 'updatedTime' })
export class UpdatedTimePipe implements PipeTransform {

  transform<T extends DocumentData>(value: T|DocumentSnapshot<T>): Date {

    const data = value instanceof firestore.DocumentSnapshot ? mapSnaphotData<T>(value) : value;

    return (data?.updated || data?.created)?.toDate();
  }
}
