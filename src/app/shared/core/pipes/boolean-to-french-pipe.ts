import { Pipe } from '@angular/core';
import { type } from 'os';

@Pipe({ name: 'booleanToFrench' })
export class BooleanToFrenchPipe {
  transform(value: boolean): string {
    if (typeof value === 'boolean') {
      if (value === true) {
        return 'Oui';
      } else if (value === false) {
        return 'Non';
      }
    }
    return value;
  }
}
