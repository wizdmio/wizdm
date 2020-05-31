import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({ name: 'toNow' })
export class ToNowPipe implements PipeTransform {

  transform(value: any, withoutSuffix?: boolean): string {

    return value ? moment(value).toNow(withoutSuffix) : '';
  }
}
