import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DynamicDocumentFieldInfoType } from 'src/app/shared/entities/dynamic-document';

export class DynamicDocumentManageFieldBooleanControls {
  key: string;
  label: string;
  formControl: string;
}

@Component({
  selector: 'app-dynamic-document-manage-field',
  templateUrl: './dynamic-document-manage-field.component.html',
  styleUrls: ['./dynamic-document-manage-field.component.css']
})
export class DynamicDocumentManageFieldComponent implements OnInit {

  types = DynamicDocumentFieldInfoType;
  editMode: boolean = false;

  form: FormGroup;

  get getTypes() {
    return Object.values(this.types);
  }

  get booleanControls() {
    return [
      { key: 'isAuditable', label: 'Auditable', formControl: 'fieldAuditable' },
      { key: 'isModifiable', label: 'Modifiable', formControl: 'fieldModifiable' },
      { key: 'isMultilingual', label: 'Multilingue', formControl: 'fieldMultilingual' },
      { key: 'isRequired', label: 'Obligatoire', formControl: 'fieldRequired' },
      { key: 'isVisible', label: 'Visible', formControl: 'fieldVisible' }
    ];
  }

  get isLink() {
    return [DynamicDocumentFieldInfoType.DOCUMENT_LINK, DynamicDocumentFieldInfoType.DOCUMENT_LINKS, DynamicDocumentFieldInfoType.PARAMETER_LINK, DynamicDocumentFieldInfoType.PARAMETER_LINKS].includes(this.form.get('fieldType')?.value);
  }

  get isDocLink() {
    return [DynamicDocumentFieldInfoType.DOCUMENT_LINK, DynamicDocumentFieldInfoType.DOCUMENT_LINKS].includes(this.form.get('fieldType')?.value);
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private matDialogRef: MatDialogRef<DynamicDocumentManageFieldComponent>) {
    this.form = new FormGroup({
      fieldName: new FormControl(this.data.field ? this.data.field.name : '', [Validators.required, Validators.minLength(2)]),
      fieldType: new FormControl(this.data.field ? this.data.field.type : this.types.TEXT, [Validators.required]),
      fieldLink: new FormControl(this.setLink()),
      fieldLinkRef: new FormControl(this.data.field ? this.data.field.documentLinkReferenceField : ''),
      fieldLabelFR: new FormControl(this.getLabel('fr_FR'), [Validators.required]),
      fieldLabelEN: new FormControl(this.getLabel('en_GB')),
      fieldLabelES: new FormControl(this.getLabel('es_ES')),
      fieldLabelDE: new FormControl(this.getLabel('de_DE')),
      fieldColumns: new FormControl(this.data.field ? this.data.field.documentLinkFields?.join(',') : ''),
      fieldAuditable: new FormControl(this.data.field ? this.data.field.isAuditable : true, [Validators.required]),
      fieldModifiable: new FormControl(this.data.field ? this.data.field.isModifiable : true, [Validators.required]),
      fieldMultilingual: new FormControl(this.data.field ? this.data.field.isMultilingual : true, [Validators.required]),
      fieldRequired: new FormControl(this.data.field ? this.data.field.isRequired : true, [Validators.required]),
      fieldVisible: new FormControl(this.data.field ? this.data.field.isVisible : true, [Validators.required]),
    })
  }

  setLink() {
    if (this.data.field?.documentLinkName || this.data.field?.parameterLinkName) {
      return this.data.field.documentLinkName ? this.data.field.documentLinkName : this.data.field.parameterLinkName;
    } else {
      return null;
    }
  }

  getLabel(lang: string) {
    try {
      return this.data.field?.label.get(lang) ? this.data.field?.label.get(lang) : 'Label ' + lang;
    } catch {
      try {
        return this.data.field?.label?.[lang];
      } catch {
        return 'Label ' + lang;
      }

    }
  }

  ngOnInit(): void {
    this.editMode = this.data.editMode;
    if (!this.editMode) {
      Object.keys(this.form.controls).forEach(controlName => {
        const control = this.form.get(controlName);
        if (control)
          control.disable();
      });
    } else {
      Object.keys(this.form.controls).forEach(controlName => {
        const control = this.form.get(controlName);
        if (control)
          control.enable();
      });
    }
  }

  toggle(control: DynamicDocumentManageFieldBooleanControls) {
    if (!this.form.get(control.formControl)?.disabled) {
      let val = this.form.get(control.formControl)?.value;
      this.form.get(control.formControl)?.setValue(!val);
    }
  }

  cancel() {
    this.matDialogRef.close(null);
  }

  submit() {
    if (!this.data.field) {
      this.data.field = {};
    }

    this.data.field.name = this.form.get('fieldName')?.value;
    this.data.field.label = new Map();
    this.data.field.label.set('fr_FR', this.form.get('fieldLabelFR')?.value);
    this.data.field.label.set('en_GB', this.form.get('fieldLabelEN')?.value);
    this.data.field.label.set('es_ES', this.form.get('fieldLabelES')?.value);
    this.data.field.label.set('de_DE', this.form.get('fieldLabelDE')?.value);

    if (this.isLink) {
      if ([DynamicDocumentFieldInfoType.DOCUMENT_LINK, DynamicDocumentFieldInfoType.DOCUMENT_LINKS].includes(this.form.get('fieldType')?.value)) {
        this.data.field.documentLinkName = this.form.get('fieldLink')?.value;
        this.data.field.parameterLinkName = null;
      } else {
        this.data.field.documentLinkName = null;
        this.data.field.parameterLinkName = this.form.get('fieldLink')?.value;
      }

      this.data.field.documentLinkFields = this.form.get('fieldColumns')?.value.split(',').map((el: string) => el.trim());
    }

    if (this.isDocLink) {
      this.data.field.documentLinkReferenceField = this.form.get('fieldLinkRef')?.value;
    }

    this.data.field.type = this.form.get('fieldType')?.value;

    for (let i = 0; i < this.booleanControls.length; i++) {
      let control = this.booleanControls[i];
      this.data.field[control.key] = this.form.get(control.formControl)?.value;
    }

    this.matDialogRef.close(this.data.field);
  }

}
