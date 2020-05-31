import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({ name: 'calendar' })
export class CalendarPipe implements PipeTransform {

  transform(value: any): string {

    return value ? moment(value).calendar() : '';
  }
}
