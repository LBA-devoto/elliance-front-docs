import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { FormFieldConfig } from '../dropdown/form_field_config';
import { SelectionModel } from '@angular/cdk/collections';
import {
  debounceTime,
  tap,
  switchMap,
  distinctUntilChanged,
  filter,
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { Parametre } from 'src/app/shared/entities/parametre';
import { Tables } from 'src/app/shared/entities/tables';
import { MatDialog } from '@angular/material/dialog';
import { DashboardComponent } from 'src/app/admin/core/components/dashboard/dashboard.component';
import { UserService } from 'src/app/admin/core/services/user.service';
import { type } from 'os';

@Component({
  selector: 'app-nested-value-data-table',
  templateUrl: './nested-value-data-table.component.html',
  styleUrls: ['./nested-value-data-table.component.css'],
})
export class NestedValueDataTableComponent implements OnInit {
  datasource: MatTableDataSource<any> = new MatTableDataSource<any>();
  autocomplete: any;
  displayedColumns: string[] = ['delete'];
  pageIndex: number = 1;
  pageSize: number = 10;
  filters: any = {};
  entite: any;
  tab: Tables = new Tables();
  parameters: Parametre[];
  entiteRelationProperte: any;
  @Input() config: FormFieldConfig;
  selection = new SelectionModel<any>(true, []);
  clickSelection = new Set<any>();
  recherche: any;
  minLengthTerm = 3;
  searchArticlesCtrl = new FormControl();
  filteredArticles: any;
  selectedArticle: any;
  isWholeEntite = false;
  visible = true;
  
  @Input()
  locales: string[];

  typeName: any = '';

  get onlyOneValue(): boolean {
    return (
      (this.entite == 'user' || this.entite == 'personnemorale') &&
      this.datasource.data.length == 1
    );
  }

  get hideAutocomplete(): boolean {
    return this.entite == 'personnephysique';
  }

  get cantDelete(): boolean {
    return this.entite == 'personnephysique' || this.entite === 'PictoCatalogue';
  }

  constructor(
    private httpClient: HttpClient,
    private httpClientService: HttpclientService,
    private dialog: MatDialog,
    private dash: DashboardComponent,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.populateTable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.config.id = '4';
      this.config = changes['config'].currentValue;

      this.displayedColumns = this.config.displayedColumns;
      if (this.config.displayedColumns.indexOf('delete') === -1) {
        this.displayedColumns.push('delete');
      }

      this.isWholeEntite = true; // on a toute l'entite dans la

      this.entite = this.config.linkedEntite;
      this.config.typeName = this.config.typeName;

      //console.log(this.config.typeName+ " "+this.config.name);
      // if (this.config.visibilityCheckProperte) {
      //   this.typeName = this.config['visibilityCheckProperte'];
      //   this.visible =
      //     this.config.typeName === this.config['visibilityCheckValue'];
      // }
    }
  }
  suprimme(row: any) {
    this.config.idList = this.config?.idList.filter((item) => item !== row.id);
    this.config.entiteList = this.config?.entiteList.filter(
      (item) => item !== row
    );
    this.datasource.data = this.datasource.data.filter((item) => item !== row);
  }

  filtreMotCles(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.datasource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.datasource.data);
  }

  checkboxLabel(element?: any): string {
    if (!element) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(element) ? 'deselect' : 'select'} row ${
      element.id + 1
    }`;
  }

  populateTable() {
    if (this.filters === undefined || this.filters === null) {
      this.filters = [];
    } else if (Array.isArray(this.filters)) {
      for (let filter of this.filters) {
        this.filters[filter.champ] = filter;
      }
    }

    if (this.isWholeEntite) {
      this.config.idList = this.config?.entiteList?.map((item) => item?.id);
      this.datasource.data = this.config.entiteList;

      if (this.entite === 'PictoCatalogue') {
        if (this.config.value !== undefined && this.config.value !== null) {
          this.recherche = this.config.value.famille;
        }
      }
    } else if (this.config.idList && this.config.idList.length > 0) {
      // si on a des id
      this.getData();
    }
  }

  getData() {
    if (this.config.idList) {
      this.config.idList = this.config.idList.filter((x) => x !== null);
      if (typeof this.config.idList[0] !== 'string') {
        this.config.idList = this.config.idList.map((item) => item.id);
      }
      this.httpClient
        .post<any[]>(
          `/view/filtrerById/${this.entite.toLowerCase()}`,
          this.config.idList
        )
        .subscribe((data: any) => {
          this.datasource.data = data.response;
        });
    }
  }

  getValue(val: any) {
    return val?.titre
      ? val?.titre
      : val?.email
      ? val?.email
      : val?.nom
      ? val?.nom
      : val?.name
      ? val?.name
      : val?.code
      ? val?.code
      : val?.famille
      ? val?.famille
      : val?.label
      ? val?.label[this.locales[0]]
      : val;
  }

  autocompleteSearch(event: any) {
    this.searchArticlesCtrl.valueChanges
      .pipe(
        filter((res) => {
          return (
            res !== null &&
            res !== undefined &&
            res.length >= this.minLengthTerm
          );
        }),
        distinctUntilChanged(),
        debounceTime(300),
        tap(() => {
          this.filteredArticles = [];
        }),
        switchMap((value) => {
          return this.httpClientService.post(
            {
              entite: this.entite,
              query: value,
              filter: this.config.filter,
              page: this.pageIndex,
              size: this.pageSize,
            },
            'view/autocompletepost'
          );
        })
      )
      .subscribe((res: any) => {
        this.filteredArticles = res.content;
      });
  }

  // autocompleteSearch(event: any) {
  //   this.searchArticlesCtrl.valueChanges
  //     .pipe(
  //       filter((res) => {
  //         return (
  //           res !== null &&
  //           res !== undefined &&
  //           res.length >= this.minLengthTerm
  //         );
  //       }),
  //       distinctUntilChanged(),
  //       debounceTime(100),
  //       tap(() => {
  //         this.filteredArticles = [];
  //       }),
  //       switchMap((value) => {
  //         return this.httpClientService.get(
  //           `view/autocomplete?entite=${this.entite}&q=${value}&f=${this.estArticle}&page=${this.pageIndex}&size=${this.pageSize}&l=${this.locals}`
  //         );
  //       })
  //     )
  //     .subscribe((res: any) => {
  //       this.filteredArticles = res.content;
  //     });
  // }
  addItem(data: any) {
    if (this.config.idList === undefined || this.config.idList === null) {
      this.config.idList = [];
    }
    if (
      this.config.entiteList === undefined ||
      this.config.entiteList === null
    ) {
      this.config.entiteList = [];
    }

    if (this.entite === 'PictoCatalogue') {
      this.config.entiteList = [];
      this.datasource.data = [];

      data.pictos.forEach((element: any) => {
        const picto = {
          id: element.id,
          label: element.label,
          icon: element.icon
        };
        this.config.entiteList.push(picto);
        this.datasource.data = [...this.datasource.data, picto];
      });

      this.config.value = data;
    } else {
      if (
        this.isWholeEntite &&
        this.config.entiteList.filter((item) => item.id === data.id).length <= 0
      ) {
        this.config.entiteList.push(data);
        this.datasource.data = [...this.datasource.data, data];
      }
      if (!this.isWholeEntite && this.config.idList.indexOf(data.id) === -1) {
        this.config.idList.push(data.id);
        //this.config.entiteList.push(data.id);
        this.datasource.data = [...this.datasource.data, data];
      }
    }
  }

  ouvrirOnglet(data: any) {
    let nom = data[this.displayedColumns[1]];

    if (this.entite === 'Picto' && this.displayedColumns[1] === 'label') {
      nom = nom[this.locales[0]];
    }

    this.dash.visualisation(
      nom,
      this.entite,
      `${data.id}`,
      '',
      100,
      this.config.typeName
    );
  }
}
