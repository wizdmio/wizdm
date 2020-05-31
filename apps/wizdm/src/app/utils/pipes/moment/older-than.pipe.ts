import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({ name: 'olderThan' })
export class OlderThanPipe implements PipeTransform {

  transform(value: any, duration: string = 'PT5M'): boolean {

    return moment().diff( moment(value).add( moment.duration(duration) ) ) < 0;
  }
}
