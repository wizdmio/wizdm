import { Pipe, PipeTransform } from '@angular/core';
import moment, { MomentInput } from 'moment';

/** Formats the given input into a formatted string */
@Pipe({ name: 'moment' })
export class MomentPipe implements PipeTransform {

  transform(value: MomentInput, output: string = 'llll'): string {

    return value ? moment(value).format(output) : '';
  }
}

@Pipe({ name: 'fromNow' })
export class FromNowPipe implements PipeTransform {

  transform(value: MomentInput, withoutSuffix?: boolean): string {

    return value ? moment(value).fromNow(withoutSuffix) : '';
  }
}

@Pipe({ name: 'toNow' })
export class ToNowPipe implements PipeTransform {

  transform(value: MomentInput, withoutSuffix?: boolean): string {

    return value ? moment(value).toNow(withoutSuffix) : '';
  }
}

@Pipe({ name: 'calendar' })
export class CalendarPipe implements PipeTransform {

  transform(value: MomentInput, referenceDay?: MomentInput): string {

    return value ? moment(value).calendar(referenceDay || '') : '';
  }
}

@Pipe({ name: 'olderThan' })
export class OlderThanPipe implements PipeTransform {

  transform(value: MomentInput, duration: string = 'PT5M'): boolean {

    return moment().diff( moment(value).add( moment.duration(duration) ) ) < 0;
  }
}
