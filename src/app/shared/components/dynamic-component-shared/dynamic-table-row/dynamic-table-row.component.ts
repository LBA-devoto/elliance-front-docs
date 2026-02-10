import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewContainerRef,
  SimpleChanges,
} from '@angular/core';
import { SidebarModel } from '@syncfusion/ej2-angular-navigations';
import { type } from 'os';
import { UtilService } from 'src/app/admin/core/services/utilService';
import { Language } from 'src/app/shared/entities/language';
import { TableService } from 'src/app/shared/services/table.service';

@Component({
  selector: 'app-dynamic-table-column',
  templateUrl: './dynamic-table-row.component.html',
  styleUrls: ['./dynamic-table-row.component.css'],
})
export class DynamicTableRowComponent implements OnInit {
  @Input() public isEditMode: boolean = false;
  @Input() public columnDefs: any;
  @Input() public columnData: any;
  @Input() public columnName: any;
  @Input() public languages: Language[];
  @Input() public entite: any;
  @Input() public elementdata: any;
  columnDef: any;

  @ViewChild('vcr', { static: true, read: ViewContainerRef })
  vcr!: ViewContainerRef;

  viewRefrence: any;
  fieldConfig: any;

  constructor(
    private tableService: TableService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['columnDefs']) {
      this.columnDefs = changes['columnDefs'].currentValue;
    }
    if (changes['columnData']) {
      this.columnData = changes['columnData'].currentValue;
    }
    if (changes['columnName']) {
      this.columnName = changes['columnName'].currentValue;
    }
    this.columnDef = this.columnDefs?.[this.columnName];
    if (
      this.columnDef &&
      (this.columnDef?.type === 'picto' ||
        this.columnDef?.type === 'icon' ||
        this.columnDef?.type === 'object' ||
        this.columnDef?.type === 'imagesmap' ||
        this.columnDef?.type === 'multilangue' ||
        this.columnDef?.type === 'label' ||
        this.columnDef?.type === 'actionbutton' ||
        this.columnDef?.type === 'linkbutton' ||
        this.columnDef?.type === 'color')
    ) {
      this.fieldConfig = this.tableService.getColumnConfig(
        this.columnDef,
        this.columnData,
        this.languages
      );

      if (
        this.fieldConfig != null &&
        this.fieldConfig != undefined &&
        this.vcr
      ) {
        this.fieldConfig.entite = this.entite;
        this.fieldConfig.columnName = this.columnName;
        this.fieldConfig.columnData = this.columnData;
        this.fieldConfig.elementdata = this.elementdata;
        this.viewRefrence = await this.tableService.loadColumn(
          this.vcr,
          this.fieldConfig,
          this.columnDef.type
        );
      }
    } else if (
      typeof this.columnData === 'string' ||
      typeof this.columnData === 'number' ||
      typeof this.columnData === 'boolean'
    ) {
      this.fieldConfig = this.tableService.getColumnConfigPrimitive(
        this.columnData
      );
      if (
        this.fieldConfig != null &&
        this.fieldConfig != undefined &&
        this.vcr
      ) {
        this.fieldConfig.columnName = this.columnName;
        this.fieldConfig.columnData = this.columnData;
        this.fieldConfig.elementdata = this.elementdata;
        if (this.columnName === 'nextExecutionTime' ||this.columnName === 'dernieremiseajour' ) {
      
          this.fieldConfig.value = this.utilService.formatDate(this.columnData);

       
        }
      }

      this.tableService.loadColumnPrimitive(this.vcr, this.fieldConfig);
    }
  }
}
