import { Pipe, PipeTransform } from '@angular/core';
import moment, { MomentInput, CalendarSpec } from 'moment';

/** Formats the given input into a formatted string */
@Pipe({ name: 'moment' })
export class MomentPipe implements PipeTransform {

  transform(value: MomentInput, output: string = 'llll'): string {

    return moment(value || undefined).format(output);
  }
}

@Pipe({ name: 'fromNow' })
export class FromNowPipe implements PipeTransform {

  transform(value: MomentInput, withoutSuffix?: boolean): string {

    return moment(value || undefined).fromNow(withoutSuffix);
  }
}

@Pipe({ name: 'toNow' })
export class ToNowPipe implements PipeTransform {

  transform(value: MomentInput, withoutSuffix?: boolean): string {

    return moment(value || undefined).toNow(withoutSuffix);
  }
}

@Pipe({ name: 'calendar' })
export class CalendarPipe implements PipeTransform {

  transform(value: MomentInput, formats?: CalendarSpec): string {

    return moment(value || undefined).calendar(formats || {});
  }
}

@Pipe({ name: 'olderThan' })
export class OlderThanPipe implements PipeTransform {

  transform(value: MomentInput, duration: string = 'PT5M'): boolean {

    return moment().diff( moment(value || undefined).add( moment.duration(duration) ) ) < 0;
  }
}
