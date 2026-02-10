import { Component, Input, OnInit, ViewChildren } from '@angular/core';

import { FormFieldConfig } from '../dynamic-component-shared/dropdown/form_field_config';

import { Language } from '../../entities/language';
import { DynamicDocumentFieldInfo, DynamicDocumentFieldInfoType, DynamicDocumentInfo } from '../../entities/dynamic-document';

import { DynamicDocumentInfoService } from '../../services/dynamic-document-info.service';
import { AlertService } from '../../services/alert-service';
import { map } from 'rxjs';

@Component({
  selector: 'app-dynamic-field-form',
  templateUrl: './dynamic-field-form.component.html',
  styleUrls: ['./dynamic-field-form.component.css']
})
export class DynamicFieldFormComponent implements OnInit {

  @Input()
  tab: any;

  @Input()
  value: any;

  @ViewChildren('formField')
  formFields!: any;

  isLecture: boolean = true;

  document: DynamicDocumentInfo;

  fieldsConfigList: FormFieldConfig[] = [];

  languages: Language[] = [
    { key: 'fr_FR', label: 'Français', selected: true },
    { key: 'en_GB', label: 'Anglais', selected: true },
    { key: 'de_DE', label: 'Allemand', selected: true },
    { key: 'es_ES', label: 'Espagnol', selected: true },
    { key: 'all', label: 'Toutes les langues', selected: true },
  ];

  constructor(private readonly dynamicDocumentInfoService: DynamicDocumentInfoService,
    private readonly alertService: AlertService) { }

  ngOnInit(): void {
    this.isLecture = this.value == 'lecture';

    if (this.isLecture) {
      this.dynamicDocumentInfoService.findById(this.tab.id).then((doc) => {
        this.document = doc;
        this.setFieldsConfigList(this.document);
      }).catch((err) => {
        console.log(err);
      })
    } else {
      this.setFieldsConfigList();
    }
  }

  public onEditMode() {
    this.isLecture = false;
    this.value = 'edition';
    this.setFieldsConfigList(this.document);

  }

  public onAddField(event: DynamicDocumentFieldInfo) {
    let value = this.fieldsConfigList.find(el => el.name == 'fields')?.value;
    let entiteList = this.fieldsConfigList.find(el => el.name == 'fields')?.entiteList;

    if (!value) value = [];
    if (!entiteList) entiteList = [];
    value.push(event);
    entiteList = value;
  }

  public onUpdateField(event: DynamicDocumentFieldInfo) {
    let entiteList = this.fieldsConfigList.find(el => el.name == 'fields')?.entiteList;
    if (entiteList) {
      let el = entiteList.find(el => el.id == event.id);
      if (el) el = event;
    } else {
      entiteList = [event]
    }
  }

  private setFieldsConfigList(doc?: DynamicDocumentInfo) {
    this.fieldsConfigList = [];
    let documentName = new FormFieldConfig();
    let labels = new FormFieldConfig();
    let descriptions = new FormFieldConfig();
    let fields = new FormFieldConfig();
    let tabField = new FormFieldConfig();
    let lastModifiedUser = new FormFieldConfig();
    let creationDate = new FormFieldConfig();
    let updatingDate = new FormFieldConfig();

    documentName.label = 'Nom de l\'entité';
    documentName.value = doc ? doc.documentName : null;
    documentName.editMode = !this.isLecture;
    documentName.name = 'documentName';
    documentName.entity = 'dynamic_document_info';
    documentName.typeName = 'dynamic_document_info';
    documentName.type = 'textbox';
    documentName.isVisible = true;
    documentName.isModifiable = true;

    labels.label = 'Libellés';
    labels.value = doc?.label ? doc.label : {
      fr_FR: null,
      en_GB: null,
      es_ES: null,
      de_DE: null,
    };
    labels.editMode = !this.isLecture;
    labels.name = 'labels';
    labels.entity = 'dynamic_document_info';
    labels.typeName = 'dynamic_document_info';
    labels.type = 'multi-langue';
    labels.multilangueFields = ['fr_FR', 'en_GB', 'es_ES', 'de_DE'];
    labels.isVisible = true;
    labels.isModifiable = true;


    descriptions.label = 'Descriptions';
    descriptions.value = doc?.description ? doc.description : {
      fr_FR: null,
      en_GB: null,
      es_ES: null,
      de_DE: null,
    };
    descriptions.editMode = !this.isLecture;
    descriptions.name = 'descriptions';
    descriptions.entity = 'dynamic_document_info';
    descriptions.typeName = 'dynamic_document_info';
    descriptions.type = 'multi-langue';
    descriptions.multilangueFields = ['fr_FR', 'en_GB', 'es_ES', 'de_DE'];
    descriptions.isVisible = true;
    descriptions.isModifiable = true;

    fields.label = 'Champs';
    fields.name = 'fields';
    fields.value = [];
    fields.type = 'list';
    fields.displayedColumns = ['name', 'label', 'type', 'delete'];
    fields.value = doc?.fields ? doc.fields : [
      {
        name: 'id',
        type: DynamicDocumentFieldInfoType.ID,
        label: {fr_FR: 'Identifiant'},
        isInDefaultView: true,
        isRequired: false,
        isVisible: false,
        isModifiable: false,
        isMultilingual: false,
        isAuditable: false
      },
      {
        name: 'lastModifiedUser',
        type: DynamicDocumentFieldInfoType.TEXT,
        label: {fr_FR: 'Utilisateur de dernière modification'},
        isInDefaultView: false,
        isRequired: false,
        isVisible: true,
        isModifiable: false,
        isMultilingual: false,
        isAuditable: false
      },
      {
        name: 'creationDate',
        type: DynamicDocumentFieldInfoType.DATE_TIME,
        label: {fr_FR: 'Date de création'},
        isInDefaultView: false,
        isRequired: false,
        isVisible: true,
        isModifiable: false,
        isMultilingual: false,
        isAuditable: false
      },
      {
        name: 'updatingDate',
        type: DynamicDocumentFieldInfoType.DATE_TIME,
        label: {fr_FR: 'Date de dernière modification'},
        isInDefaultView: false,
        isRequired: false,
        isVisible: true,
        isModifiable: false,
        isMultilingual: false,
        isAuditable: false
      },
    ];

    fields.entiteList = fields.value;
    fields.editMode = !this.isLecture;
    fields.entity = 'dynamic_document_info';
    fields.typeName = 'dynamic_document_info';
    fields.entiteRelationProperte = 'dynamicdocumentfieldinfo';
    fields.isVisible = true;
    fields.isModifiable = true;

    tabField.label = 'Onglet - Champ d\'affichage (title, code...)';
    tabField.value = doc ? doc.tabField : null;
    tabField.editMode = !this.isLecture;
    tabField.name = 'tabField';
    tabField.entity = 'dynamic_document_info';
    tabField.typeName = 'dynamic_document_info';
    tabField.type = 'textbox';
    tabField.isVisible = true;
    tabField.isModifiable = true;

    lastModifiedUser.label = 'Utilisateur de dernière modification';
    lastModifiedUser.name = 'lastModifiedUser';
    lastModifiedUser.editMode = false;
    lastModifiedUser.entity = 'dynamic_document_info';
    lastModifiedUser.typeName = 'dynamic_document_info';
    lastModifiedUser.type = 'textbox';
    lastModifiedUser.value = doc?.lastModifiedUser;
    lastModifiedUser.isVisible = true;
    lastModifiedUser.isModifiable = false;

    creationDate.label = 'Date de création';
    creationDate.name = 'creationDate';
    creationDate.editMode = false;
    creationDate.entity = 'dynamic_document_info';
    creationDate.typeName = 'dynamic_document_info';
    creationDate.type = 'date';
    creationDate.value = doc?.creationDate;
    creationDate.isVisible = true;
    creationDate.isModifiable = false;

    updatingDate.label = 'Date de dernière modification';
    updatingDate.name = 'updatingDate';
    updatingDate.editMode = false;
    updatingDate.entity = 'dynamic_document_info';
    updatingDate.typeName = 'dynamic_document_info';
    updatingDate.type = 'date';
    updatingDate.value = doc?.updatingDate;
    updatingDate.isVisible = true;
    updatingDate.isModifiable = false;
    

    this.fieldsConfigList.push(documentName);
    this.fieldsConfigList.push(labels);
    this.fieldsConfigList.push(descriptions);
    this.fieldsConfigList.push(fields);
    this.fieldsConfigList.push(tabField);
    if (this.isLecture) {
      this.fieldsConfigList.push(lastModifiedUser);
      this.fieldsConfigList.push(creationDate);
      this.fieldsConfigList.push(updatingDate);
    }
  }

  public onSave() {
    let documentName: string = this.formFields._results[0].value;
    let labels: Map<string, string> = this.formFields._results[1].multilangueMap;
    let descriptions: Map<string, string> = this.formFields._results[2].multilangueMap;
    let fields: DynamicDocumentFieldInfo[] = this.formFields._results[3].datasource?.filteredData;
    let tabField: string = this.formFields._results[4].value;

    fields.forEach(field => {
      try {
        field.label = Object.fromEntries(field.label);
      } catch {
      }
    })

    if (this.document) {
      this.document.documentName = documentName;
      this.document.label = labels;
      this.document.description = descriptions;
      this.document.fields = fields;
      this.document.tabField = tabField;
    }

    setTimeout(() => {
      let dynamicDoc = this.document ? this.document : new DynamicDocumentInfo(undefined, documentName, labels, descriptions, fields, tabField, undefined, new Date(), new Date());

      if (dynamicDoc.documentName) {
        this.dynamicDocumentInfoService.save(dynamicDoc).then((doc) => {
      
          window.location.reload(); // Fix temporaire le temps que la requête renvoie un résultat !== null
          // this.tab.title = this.dynamicDocumentInfoService.getLabel(doc);
          // this.value = 'lecture';
          // this.isLecture = true;
          // this.setFieldsConfigList(doc);

        }).catch(() => {
          this.alertService.confirmDialog({
            title: '',
            message: `L'enregistrement de ${dynamicDoc.documentName} a échoué.`,
            confirmText: 'Yes',
            cancelText: 'No',
          });
          setTimeout(() => {
            this.alertService.closeAlert();
          }, 2000);
        })
      }
    }, 100);


  }

  public remove() {
    this.alertService.confirmDialog({ title: 'Suppression', confirmText: 'oui', cancelText: 'non', message: 'Sûr de supprimer ?' }).pipe(
      map((res) => {
        if (res) {
          this.dynamicDocumentInfoService.delete(this.document)
        }
      })
    ).subscribe();
  }
}