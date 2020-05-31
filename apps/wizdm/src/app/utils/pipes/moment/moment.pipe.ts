import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({ name: 'moment' })
export class MomentPipe implements PipeTransform {

  transform(value: any, format: string = 'llll'): string {

    return value ? moment(value).format(format) : '';
  }
}
