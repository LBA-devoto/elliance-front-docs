import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

import { FormFieldConfig } from '../dropdown/form_field_config';
import { PictosUtils } from '../../../utils/pictosUtils';
import { UserService } from 'src/app/admin/core/services/user.service';

@Component({
  selector: 'app-picto',
  templateUrl: './picto.component.html',
  styleUrls: ['./picto.component.css'],
})
export class PictoComponent implements OnInit {
  @Input() config: FormFieldConfig;
  @Input() data: any;
  typeName: any;

  value: any = {};

  picto: string | null = null;
  pictos: string[] = [];

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    if (this.config.editMode) {
      this.pictos.push('2PEHD');
      this.pictos.push('4_plaques_horizontales');
      this.pictos.push('4_plaques_verticales');
      this.pictos.push('5_plaques');
      this.pictos.push('5pp');
      this.pictos.push('6_plaques_horizontales');
      this.pictos.push('6_plaques_verticales');
      this.pictos.push('6ps');
      this.pictos.push('7_plaques');
      this.pictos.push('8_plaques');
      this.pictos.push('10_plaques');
      this.pictos.push('11_plaques');
      this.pictos.push('avec-porte-chromos');
      this.pictos.push('Brillant');
      this.pictos.push('Mat');
      this.pictos.push('Granité');
      this.pictos.push('injecte');
      this.pictos.push('colorama');
      this.pictos.push('drainage');
      this.pictos.push('etoile');
      this.pictos.push('NIR');
      this.pictos.push('nouveaute');
      this.pictos.push('pcr');
      this.pictos.push('Picto_matiere_4_PEBD');
      this.pictos.push('Picto_Soparco_Bio');
      this.pictos.push('plaque-eco');
      this.pictos.push('plaque-reutilisable');
      this.pictos.push('plaque-roll-cc');
      this.pictos.push('prise');
      this.pictos.push('tarif-5');
      this.pictos.push('thermoforme');
    } else if (this.config.value) {
      this.picto = this.config.value;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.config = changes['config'].currentValue;
      this.typeName = this.config.typeName;
      if (this.config.value) {
        this.value = this.config.value;
      }
    }
  }

  pictoNameToLabel(pictoName: string): string {
    return PictosUtils.toLabel(pictoName);
  }
}
