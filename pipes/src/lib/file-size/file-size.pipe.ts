import { Pipe, PipeTransform } from '@angular/core';

const FILE_SIZE_UNITS_LONG = [
  'Bytes',
  'Kilobytes',
  'Megabytes',
  'Gigabytes',
  'Pettabytes',
  'Exabytes',
  'Zettabytes',
  'Yottabytes'
];
const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

@Pipe({ name: 'fileSize' })
export class FileSizePipe implements PipeTransform {
  transform(sizeInBytes: number, longForm?: boolean): string {

    if(sizeInBytes === null || sizeInBytes === undefined) {
      return '';
    }

    const units = !!longForm ? FILE_SIZE_UNITS_LONG : FILE_SIZE_UNITS;

    // Computes the power of 1024
    let power = Math.min(
      Math.floor(Math.log(sizeInBytes) / Math.log(1024)),
      units.length - 1
    );

    // Computes the size keeping two decimals
    const size = sizeInBytes / Math.pow(1024, power);
    const formattedSize = Math.round(size * 100) / 100;
    const unit = units[power];

    return size ? `${formattedSize} ${unit}` : '0';
  }
}