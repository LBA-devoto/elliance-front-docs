import { Pipe } from '@angular/core';
@Pipe({ name: 'columnRenamePipe' })
export class columnRenamePipe {
  transform(value: any): any {
    if (value === 'mapDescriptionVl') return 'Désignation VL';
    else if (value === 'vl') return 'Code VL';
    else if (value === 'mapdescription') return 'Désignation';
    else if (value === 'maplocaletitre') return 'Titre';
    else return value;
  }
}
