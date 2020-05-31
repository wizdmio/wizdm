import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({ name: 'fromNow' })
export class FromNowPipe implements PipeTransform {

  transform(value: any, withoutSuffix?: boolean): string {

    return value ? moment(value).fromNow(withoutSuffix) : '';
  }
}
