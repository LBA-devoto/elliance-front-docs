import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Injectable,
  ComponentRef,
  Input,
  ViewContainerRef,
  QueryList,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { Template } from '../shared/entities/template';
import { TemplateFieldObj } from '../shared/entities/template-field-Obj';
import { FormFieldConfig } from '../shared/components/dynamic-component-shared/dropdown/form_field_config';
import { Tables } from '../shared/entities/tables';
import { DropdownComponent } from '../shared/components/dynamic-component-shared/dropdown/dropdown.component';
import { TextboxComponent } from '../shared/components/dynamic-component-shared/textbox/textbox.component';

import { DataTableComponent } from '../shared/components/dynamic-component-shared/data-table/data-table.component';
import { CheckboxComponent } from '../shared/components/dynamic-component-shared/checkbox/checkbox.component';
import { TabService } from '../shared/services/tab.service';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { MultiLangueComponent } from '../shared/components/dynamic-component-shared/multi-langue/multi-langue.component';
import { ImageComponent } from '../shared/components/dynamic-component-shared/image/image.component';
import { DateComponent } from '../shared/components/dynamic-component-shared/date/date.component';
import { SearchableTextfieldComponent } from '../shared/components/dynamic-component-shared/searchable-textfield/searchable-textfield.component';
import { MultiSelectDropdownComponent } from '../shared/components/dynamic-component-shared/multi-select-dropdown/multi-select-dropdown.component';
import { TextboxlistComponent } from '../shared/components/dynamic-component-shared/textboxlist/textboxlist.component';
import { AddressComponent } from '../shared/components/dynamic-component-shared/address/address.component';
import { Language } from '../shared/entities/language';
import { PictoComponent } from '../shared/components/dynamic-component-shared/picto/picto.component';
import { LabelComponent } from '../shared/components/dynamic-component-shared/label/label.component';
import { NestedValueDataTableComponent } from '../shared/components/dynamic-component-shared/nested-value-data-table/nested-value-data-table.component';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ButtonFieldComponent } from '../shared/components/dynamic-component-shared/button-field/button-field.component';

const httpOptionsPlain = {
  headers: new HttpHeaders({
    Accept: 'text/plain',
    'Content-Type': 'text/plain',
  }),
  responseType: 'text',
};

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  baseUrl = `${environment.API_URL}`;
  templateConfig: FormFieldConfig = new FormFieldConfig();
  constructor(private http: HttpClient) {}

  getDefaut(nom: string) {
    return this.http.get<Template>(`${this.baseUrl}/template/defaut/${nom}`);
  }

  edition(template: Template) {
    return this.http.post<Template>(
      `${this.baseUrl}/template/edition`,
      template
    );
  }
  updateTemplate(template: Template) {
    return this.http.post<Template>(
      `${this.baseUrl}/template/update`,
      template
    );
  }

   getIsPrix(name: string): boolean {
    return name?.toLowerCase().includes('prix');
  }

  deleteImage(url: string) {
    return this.http.get<any>(`${this.baseUrl}${url}`);
    //.pipe(retry(3), catchError(this.handleError));
  }

  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(errorMessage);
  }

  requestApi(req: string) {
    return this.http.get<any[]>(`${this.baseUrl}${req}`);
  }

  getTemplateAndData(idTemplate: string, idVal: string) {
    return this.http.get<Template>(
      `${this.baseUrl}/template/${idTemplate}/${idVal}`
    );
  }

  getFieldConfig(element: any, data: any) {
    this.templateConfig = new FormFieldConfig();

    if (element.formfield === 'selection') {
      let label = element.label;
      this.templateConfig.label = label;
      this.templateConfig.name = element.name;
      this.templateConfig.value = data ? data[element.name] : null;
      this.templateConfig.parametreName = element.parametreName;
      this.templateConfig.simpleMode = element.simpleMode;
      this.templateConfig.isMultiLangue = element.multiLangue;
      this.templateConfig.entiteClassSelection = element.entiteClassSelection;
      this.templateConfig.entity = element.entity;
      this.templateConfig.typeName = element.typeName;
      this.templateConfig.labelLocal = element.labelLocal;
      this.templateConfig.isavalidationField = element.isavalidationField;
      if (element.isavalidationField) {
        this.templateConfig.validationFields.push(element.validationField);
      }
      return this.templateConfig;
    } else if (element.formfield === 'textbox') {
      this.templateConfig.label = element.label;
      this.templateConfig.type = element.type;
      this.templateConfig.name = element.name;
      this.templateConfig.value = data ? data[element.name] : null;

      return this.templateConfig;
    } else if (element.formfield === 'label') {
      this.templateConfig.label = element.label;
      this.templateConfig.name = element.name;
      this.templateConfig.value = data ? data[element.name] : null;
      this.templateConfig.parametreName = element.parametreName;
      this.templateConfig.simpleMode = element.simpleMode;
      this.templateConfig.isMultiLangue = element.multiLangue;
      this.templateConfig.entiteClassSelection = element.entiteClassSelection;
      this.templateConfig.entity = element.entity;
      this.templateConfig.typeName = element.typeName;
      this.templateConfig.labelLocal = element.labelLocal;
      this.templateConfig.isavalidationField = element.isavalidationField;
      if (element.isavalidationField) {
        this.templateConfig.validationFields.push(element.validationField);
      }

      return this.templateConfig;
    } else if (element.formfield === 'textboxlist') {
      this.templateConfig.label = element.label;
      this.templateConfig.value = data ? data[element.name] : null;
      this.templateConfig.type = element.type;
      this.templateConfig.displayProperty = element.displayProperty;
      this.templateConfig.name = element.name;

      return this.templateConfig;
    } else if (element.formfield === 'table') {
      let label = element.label;
      this.templateConfig.label = label;
      this.templateConfig.name = element.name;
      this.templateConfig.idList = data ? data[element.name] : null;
      this.templateConfig.entiteList = data ? data[element.name] : null;
      this.templateConfig.displayedColumns = element.displayedColumns;
      this.templateConfig.linkedEntite = element.linkedEntite;
      this.templateConfig.entiteRelationProperte =
        element.entiteRelationProperte;
      this.templateConfig.visibilityCheckProperte =
        element.visibilityCheckProperte;
      this.templateConfig.visibilityCheckValue = element.visibilityCheckValue;
      if (element.filter)
        this.templateConfig.filter = this.getFilters(element.filter[0]);

      return this.templateConfig;
    } else if (element.formfield === 'innertable') {
      //element.innerpropertyname = 'pictos';
      //element.name = 'pictoCatalogue';
      let label = element.label;
      this.templateConfig.label = label;
      this.templateConfig.name = element.name;
      this.templateConfig.value = data ? data[element.name] : null;
      this.templateConfig.innerPropertyName = element.innerPropertyName;
      this.templateConfig.entiteList = data
        ? data[element.name]?.[element.innerPropertyName]
        : null;
      this.templateConfig.displayedColumns = element.displayedColumns;
      this.templateConfig.linkedEntite = element.linkedEntite;
      this.templateConfig.entiteRelationProperte =
        element.entiteRelationProperte;
      this.templateConfig.visibilityCheckProperte =
        element.visibilityCheckProperte;
      this.templateConfig.visibilityCheckValue = element.visibilityCheckValue;
      if (element.filter)
        this.templateConfig.filter = this.getFilters(element.filter[0]);

      return this.templateConfig;
    } else if (element.formfield === 'checkbox') {
      let label = element.label;
      this.templateConfig.label = label;
      this.templateConfig.name = element.name;
      this.templateConfig.checkboxOptions = data ? data[element.name] : null;
      this.templateConfig.checkBoxEntite = element.checkBoxEntite;
      this.templateConfig.checkBoxLabelTitre = element.checkBoxLabelTitre;
      this.templateConfig.checkBoxValueTitre = element.checkBoxValueTitre;

      return this.templateConfig;
    } else if (element.formfield === 'multilanguetextbox') {
      this.templateConfig.label = element.label;
      this.templateConfig.name = element.name;
      this.templateConfig.multilangueFields = element.locales;
      this.templateConfig.value = data ? data[element.name] : null;

      return this.templateConfig;
    } else if (element.formfield === 'image') {
      this.templateConfig.label = element.label;
      this.templateConfig.name = element.name;
      this.templateConfig.uploadPath = element.uploadPath;
      this.templateConfig.uploadUrl = element.uploadUrl;
      this.templateConfig.singleImageMode = element.singleImageMode;
      this.templateConfig.type = element.type;
      if (!element.singleImageMode) {
        this.templateConfig.images = data ? data[element.name] : null; //images
      } else {
        this.templateConfig.value = data ? data[element.name] : null; //image
      }
      return this.templateConfig;
    } else if (element.formfield === 'picto') {
      this.templateConfig.label = element.label;
      this.templateConfig.value = data ? data[element.name] : null;
      this.templateConfig.type = element.type;
      this.templateConfig.name = element.name;

      return this.templateConfig;
    } else if (element.formfield === 'datefield') {
      this.templateConfig.label = element.label;
      this.templateConfig.name = element.name;
      this.templateConfig.value = data ? data[element.name] : null;

      return this.templateConfig;
    } else if (element.formfield === 'searchabletextbox') {
      this.templateConfig.label = element.label;
      this.templateConfig.name = element.name;
      this.templateConfig.value = data ? data[element.name] : null;
      this.templateConfig.linkedEntite = element.linkedEntite;
      this.templateConfig.displayMode = element.displayMode;
      this.templateConfig.menu = element.menu;
      this.templateConfig.entiteRelationProperte =
        element.entiteRelationProperte;
      this.templateConfig.searchableFields = element.searchableFields;
      return this.templateConfig;
    } else if (element.formfield === 'addressfield') {
      this.templateConfig.label = element.label;
      this.templateConfig.name = element.name;
      this.templateConfig.value = data ? data[element.name] : null;
      this.templateConfig.searchableFields = element.searchableFields;
      return this.templateConfig;
    } else if (element.formfield === 'multiselectiondropdown') {
      let label = element.label;
      this.templateConfig.label = label;
      this.templateConfig.name = element.name;
      this.templateConfig.value = data ? data[element.name] : null;
      this.templateConfig.linkedEntite = element.linkedEntite;
      this.templateConfig.entiteRelationProperte =
        element.entiteRelationProperte;
      this.templateConfig.parametreName = element.parametreName;

      return this.templateConfig;
    } else if (element.formfield === 'actionbutton') {
      let label = element.label;
      this.templateConfig.label = label;
      this.templateConfig.name = element.name;
      this.templateConfig.clickMethod = element.clickMethod;

      return this.templateConfig;
    } else {
      return null;
    }
  }

  component: any;
  /***
   * @param
   */
  public async loadFormFields(
    vcf: ViewContainerRef,
    config: any,
    filedType: string,
    languages: Language[]
  ) {
    switch (filedType) {
      case 'selection':
        this.component = DropdownComponent;
        break;
      case 'textbox':
        this.component = TextboxComponent;
        break;
      case 'label':
        this.component = LabelComponent;
        break;
      case 'table':
        this.component = DataTableComponent;
        break;
      case 'innertable':
        this.component = NestedValueDataTableComponent;
        break;
      case 'checkbox':
        this.component = CheckboxComponent;
        break;
      case 'multilanguetextbox':
        this.component = MultiLangueComponent;
        break;
      case 'image':
        this.component = ImageComponent;
        break;
      case 'picto':
        this.component = PictoComponent;
        break;
      case 'datefield':
        this.component = DateComponent;
        break;
      case 'searchabletextbox':
        this.component = SearchableTextfieldComponent;
        break;
      case 'multiselectiondropdown':
        this.component = MultiSelectDropdownComponent;
        break;
      case 'textboxlist':
        this.component = TextboxlistComponent;
        break;
      case 'addressfield':
        this.component = AddressComponent;
        break;
      case 'actionbutton':
        this.component = ButtonFieldComponent;
        break;
    }

    if (!this.component) {
      return;
    }

    vcf.clear();

    let componentInstance: ComponentRef<typeof this.component> =
      vcf.createComponent(this.component);
    componentInstance.setInput('config', config);

    if (filedType === 'multilanguetextbox') {
      componentInstance.setInput('languages', languages);
    }

    if (filedType === 'table' || filedType === 'innertable') {
      componentInstance.setInput(
        'locales',
        languages
          .filter((language) => language.selected === true)
          .map((language) => language.key)
      );
    }

    return componentInstance;
  }

  public processEnregister(
    childComponents: QueryList<any>,
    tab: any
  ): Observable<any> {
    let obj: any = {};
    let entite = tab.entite;
    childComponents.forEach((childComponent) => {
      const componentInstance = childComponent.viewRefrence.instance;
      const componentType = componentInstance.constructor;
      switch (componentType) {
        case TextboxComponent:
          obj[childComponent.viewRefrence.instance.config.name] =
            childComponent.viewRefrence.instance.value;
          break;
        case TextboxlistComponent:
          obj[childComponent.viewRefrence.instance.config.name] =
            childComponent.viewRefrence.instance.value;
          break;
        case DropdownComponent:
          obj[childComponent.viewRefrence.instance.config.name] =
            childComponent.viewRefrence.instance.config.value;
          break;
        case CheckboxComponent:
          obj[childComponent.viewRefrence.instance.config.name] =
            childComponent.viewRefrence.instance.checkboxOptions;
          break;
        case DataTableComponent:
          // the default value is the id of the linked entite
          if (
            childComponent.viewRefrence.instance.config
              .entiteRelationProperte === 'id'
          ) {
            obj[childComponent.viewRefrence.instance.config.name] =
              childComponent.viewRefrence.instance.config.idList;
          } else {
            obj[childComponent.viewRefrence.instance.config.name] =
              childComponent.viewRefrence.instance.config.entiteList;
          }
          break;
        case NestedValueDataTableComponent:
          // the default value is the id of the linked entite
          if (
            childComponent?.viewRefrence?.instance?.config
              .entiteRelationProperte === 'id'
          ) {
            obj[childComponent.viewRefrence.instance.config.name] =
              childComponent.viewRefrence.instance.config.idList;
          } else {
            obj[childComponent.viewRefrence.instance.config.name] =
              childComponent.viewRefrence.instance.config.value;
            if (
              obj[childComponent.viewRefrence.instance.config.name] &&
              obj[childComponent.viewRefrence.instance.config.name][
                childComponent.viewRefrence.instance.config.innerPropertyName
              ]
            ) {
              obj[childComponent.viewRefrence.instance.config.name][
                childComponent.viewRefrence.instance.config.innerPropertyName
              ] = childComponent.viewRefrence.instance.config.entiteList;
            }
            // obj[childComponent.viewRefrence.instance.config.name][
            //   childComponent.viewRefrence.instance.config.innerPropertyName
            // ] = childComponent.viewRefrence.instance.config.entiteList;
          }
          break;
        case MultiLangueComponent:
          obj[childComponent.viewRefrence.instance.config.name] =
            childComponent.viewRefrence.instance.multilangueMap;
          break;
        case ImageComponent:
          if (childComponent.viewRefrence.instance.config.singleImageMode) {
            obj[childComponent.viewRefrence.instance.config.name] =
              childComponent.viewRefrence.instance.image;
          } else {
            obj[childComponent.viewRefrence.instance.config.name] =
              childComponent.viewRefrence.instance.imagesMap;
          }
          break;
        case PictoComponent:
          obj[childComponent.viewRefrence.instance.config.name] =
            childComponent.viewRefrence.instance.config.value;
          break;
        case DateComponent:
          let date = childComponent.viewRefrence.instance.formatDate(
            childComponent.viewRefrence.instance.selectedDateControl.value
          );
          obj[childComponent.viewRefrence.instance.config.name] = date;
          break;
        case SearchableTextfieldComponent:
          if (childComponent.viewRefrence.instance.searchArticlesCtrl.value) {
            obj[childComponent.viewRefrence.instance.config.name] =
              childComponent.viewRefrence.instance.config.value;
          } else {
            obj[childComponent.viewRefrence.instance.config.name] = null;
          }

          break;
        case LabelComponent:
          obj[childComponent.viewRefrence.instance.config.name] =
            childComponent.viewRefrence.instance.config.value;
          break;
        case MultiSelectDropdownComponent:
          obj[childComponent.viewRefrence.instance.config.name] =
            childComponent.viewRefrence.instance.config.value;
          break;
        case AddressComponent:
          obj[childComponent.viewRefrence.instance.config.name] =
            childComponent.viewRefrence.instance.getAddressLigne();
      }
    });

    // Only for catalog dynamic
    if (tab.catalogTables !== undefined && tab.catalogTables !== null && Object.keys(tab.catalogTables).length !== 0) {
      obj['tables'] = tab.catalogTables;
    }

    let entiteUrl = this.getEntiteurl(entite);
    if (tab.id) {
      obj.id = tab.id;
    }

    return this.http.post<any>(entiteUrl, obj);
  }

  getEntiteurl(entite: string) {
    entite = entite.toLowerCase();
    return `${this.baseUrl}/${entite}/add`;
  }

  getDropDownValues(url: string) {
    return this.http.get<any>(url);
  }

  getFilters(filterName: string) {
    if (!filterName) {
      return null;
    }
    filterName = filterName.toLowerCase();
    switch (filterName) {
      case 'article':
        return [
          {
            champ: 'estArticle',
            conditions: [
              {
                id: 0,
                type: 'UNKNOWN',
                condition: 'EQUALS',
                valeur: true,
              },
            ],
            default: true,
          },
        ];
      case 'produit':
        return [
          {
            champ: 'estProduit',
            conditions: [
              {
                id: 0,
                type: 'UNKNOWN',
                condition: 'EQUALS',
                valeur: true,
              },
            ],
            default: true,
          },
        ];
    }

    return null;
  }
}
