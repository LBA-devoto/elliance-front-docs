import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { Language } from '../entities/language';
import { ImageColumnComponent } from '../components/dynamic-component-shared/table/dynamic-columns/image-column/image-column.component';
import { LabelComponent } from '../components/dynamic-component-shared/label/label.component';
import { PrimitiveColumnComponent } from '../components/dynamic-component-shared/table/dynamic-columns/primitive-column/primitive-column/primitive-column.component';
import { ObjectColumnComponent } from '../components/dynamic-component-shared/table/dynamic-columns/object-column/object-column.component';
import { MultilangueColumnComponent } from '../components/dynamic-component-shared/table/dynamic-columns/multilangue-column/multilangue-column.component';
import { PictoColumnComponent } from '../components/dynamic-component-shared/table/dynamic-columns/picto-column/picto-column.component';
import { ColorColumnComponent } from '../components/dynamic-component-shared/table/dynamic-columns/color-column/color-column.component';
import { L } from '@angular/cdk/keycodes';
import { ButtonFieldComponent } from '../components/dynamic-component-shared/button-field/button-field.component';
import { LinkbuttonComponent } from '../components/dynamic-component-shared/table/dynamic-columns/linkbutton/linkbutton.component';

@Injectable({ providedIn: 'root' })
export class TableService {
  constructor() {}

  getColumnConfig(columnDef: any, data: any, languages: Language[]) {
    let fieldConfig: any = {};
    if (!columnDef) {
      return;
    }

    switch (columnDef.type) {
      case 'imagesmap':
        fieldConfig.imagesmap = data;
        fieldConfig.isList = columnDef.list;
        break;

      case 'object':
        fieldConfig.value = data;
        fieldConfig.displayProperty = columnDef.displayProperty;
        fieldConfig.isList = columnDef.list;
        fieldConfig.labelLocal = columnDef.local;
        fieldConfig.linkedEntite = columnDef.entityLink;
        fieldConfig.type = columnDef.type;
        break;
      case 'label':
        fieldConfig.value = data;
        fieldConfig.displayProperty = columnDef.displayProperty;
        fieldConfig.isList = columnDef.list;
        fieldConfig.labelLocal = columnDef.local;
        fieldConfig.linkedEntite = columnDef.entityLink;
        fieldConfig.type = columnDef.type;
        break;

      case 'multilangue':
        fieldConfig.value = data;
        fieldConfig.type = columnDef.type;
        fieldConfig.languages = languages;

        break;

      case 'picto':
      case 'icon':
        fieldConfig.value = data;
        fieldConfig.type = columnDef.type;
        fieldConfig.isList = columnDef.list;
        break;

      case 'color':
        fieldConfig.value = data;
        fieldConfig.isList = columnDef.list;
        fieldConfig.type = columnDef.type;
        fieldConfig.displayProperty = columnDef.displayProperty;
        break;
      case 'actionbutton':
        fieldConfig.type = columnDef.type;
        fieldConfig.label = columnDef.label;
        fieldConfig.clickMethod = columnDef.clickMethod;
        fieldConfig.columnData = data;
        break;
      case 'linkbutton':
        fieldConfig.type = columnDef.type;
        fieldConfig.label = columnDef.label;
        fieldConfig.clickMethod = columnDef.clickMethod;
        fieldConfig.columnData = data;
        break;
    }
    return fieldConfig;
  }

  component: any;
  /***
   * @param
   */

  loadColumnPrimitive(vcf: ViewContainerRef, config: any) {
    this.component = PrimitiveColumnComponent;
    vcf.clear();
    let componentInstance: ComponentRef<typeof this.component> =
      vcf.createComponent(this.component);
    componentInstance.setInput('config', config);
    return componentInstance;
  }

  getColumnConfigPrimitive(data: any) {
    let fieldConfig: any = {};
    if (!data) {
      return;
    }
    fieldConfig.value = data;
    return fieldConfig;
  }
  public async loadColumn(
    vcf: ViewContainerRef,
    config: any,
    columnDefType: string
  ) {
    switch (columnDefType) {
      case 'imagesmap':
        this.component = ImageColumnComponent;
        break;
      case 'object':
      case 'label':
        this.component = ObjectColumnComponent;
        break;

      case 'multilangue':
        this.component = MultilangueColumnComponent;
        break;

      case 'picto':
      case 'icon':
        this.component = PictoColumnComponent;
        break;

      case 'color':
        this.component = ColorColumnComponent;
        break;
      case 'actionbutton':
        this.component = ButtonFieldComponent;

        break;
      case 'linkbutton':
        this.component = LinkbuttonComponent;

        break;
    }
    if (!this.component) {
      return;
    }
    vcf.clear();
    let componentInstance: ComponentRef<typeof this.component> =
      vcf.createComponent(this.component);
    componentInstance.setInput('config', config);

    return componentInstance;
  }
}
