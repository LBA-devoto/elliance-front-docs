import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractEntityName',
})
export class ExtractEntityNamePipe implements PipeTransform {
  transform(value: string): string {
    const arr = value.split('.');
    return arr[arr.length - 1];
  }
}
