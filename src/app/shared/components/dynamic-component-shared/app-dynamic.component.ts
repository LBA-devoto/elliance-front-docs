import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  ViewChild,
  AfterViewInit,
  ViewContainerRef,
} from '@angular/core';

import { TemplateService } from 'src/app/services/template.service';
import { Language } from '../../entities/language';

@Component({
  selector: 'app-dynamic-component',
  templateUrl: './app-dynamic.component.html',
  styleUrls: [],
})
export class AppDynamicComponent implements OnChanges, AfterViewInit {
  @Input() public formComponent: any;
  @Input() public data: any;
  @Input() public isEditMode: boolean = false;
  @Input() public languages: Language[];
  @Input() public typeName: any;
  @Input() public tab: any;

  // @ViewChild(FormFieldHostDirective, { static: true })
  // formfieldDirective: FormFieldHostDirective;
  @ViewChild('vcr', { static: true, read: ViewContainerRef })
  vcr!: ViewContainerRef;

  viewRefrence: any;
  fieldConfig: any;

  constructor(private templateService: TemplateService) {}

  ngOnInit(): void {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['formComponent'] && changes['data']) {
      this.formComponent = changes['formComponent'].currentValue;
      this.data = changes['data'].currentValue;
    }
    if (changes['isEditMode']) {
      this.isEditMode = changes['isEditMode'].currentValue;
    }

    this.fieldConfig = this.templateService.getFieldConfig(
      this.formComponent,
      this.data
    );

    this.fieldConfig.typeName = this.typeName;

    this.fieldConfig.editMode = this.isEditMode;

    if (this.fieldConfig != null && this.fieldConfig != undefined && this.vcr) {
      this.viewRefrence = await this.templateService.loadFormFields(
        this.vcr,
        this.fieldConfig,
        this.formComponent.formfield,
        this.languages
      );
    }
  }

  ngAfterViewInit() {}
}
