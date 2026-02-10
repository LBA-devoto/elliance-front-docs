import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DashboardComponent } from 'src/app/admin/core/components/dashboard/dashboard.component';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { TemplateService } from 'src/app/services/template.service';
import { v4 as uuidv4 } from 'uuid';
import { Col } from '../../entities/col';
import { DeleteReq } from '../../entities/deleteReq';
import { Language } from '../../entities/language';
import { Parametre } from '../../entities/parametre';
import { Row } from '../../entities/row';
import { Template } from '../../entities/template';
import { MenuActions } from '../../enums/menu-actions';
import { PageOptions } from '../../enums/page-modes';
import { TabService } from '../../services/tab.service';
import { DiaologHostComponent } from '../dialogs/dialog-host/dialog-host';
import { AppDynamicComponent } from '../dynamic-component-shared/app-dynamic.component';
import { LayoutCondition } from '../../entities/layoutCondition';
import { UserService } from 'src/app/admin/core/services/user.service';
import { IdmlService } from '../../services/idml.service';

@Component({
  selector: 'app-template-edit',
  templateUrl: './template-edit.component.html',
  styleUrls: ['./template-edit.component.css'],
})
export class TemplateEditComponent implements OnInit {
  public _initTemplates: { [id: string]: Template } = {};

  public templates: { [id: string]: Template } = {};

  @Input() public tab: any;
  @Input() public value: any;

  typeName: any;
  data: any;
  config: any;
  isEditMode = false;
  isLayoutEditMode = false;
  pageMode: PageOptions.EDIT;
  columnGauche: any;
  columnDroite: any;
  lectureMode: boolean = true;
  isOpenLanguages: boolean = false;
  totalElements: number = 0;
  showIntermediaryApprovalButton: boolean = false;
  canBePdfDownloaded: boolean = false;

  languages: Language[] = [
    { key: 'fr_FR', label: 'Français', selected: true },
    { key: 'en_GB', label: 'Anglais', selected: false },
    { key: 'de_DE', label: 'Allemand', selected: false },
    { key: 'es_ES', label: 'Espagnol', selected: false },
    { key: 'all', label: 'Toutes les langues', selected: false },
  ];
  entitypropertydisplay: any[] = [
    { key: 'produit', label: 'code' },
    { key: 'produitarchive', label: 'code' },
    { key: 'catégorie', label: 'code' },
    {
      key: 'variablelogistique',
      label: 'Désignation VL',
      value: 'libelle',
      type: 'multiLangue',
    },
    {
      key: 'variablelogistiquearchive',
      label: 'Désignation VL',
      value: 'libelle',
      type: 'multiLangue',
    },
    { key: 'sousFamille', label: 'code' },
    { key: 'sousSousFamille', label: 'code' },
    { key: 'sousSousSousFamille', label: 'code' },
    { key: 'sousSousSousSousFamille', label: 'code' },
  ];
  entitiespourvalidation: any[] = ['produit'];
  parametersConnections: { [id: string]: string[] } = {};

  allParameters: Parametre[] = [];
  isfiedvalidated: boolean = true;

  allTemplates: { [id: string]: string } = {};
  templateIdSelected: string | null = null;

  @Output() public menuAction: EventEmitter<MenuActions> =
    new EventEmitter<MenuActions>();
  deleteReq: DeleteReq = new DeleteReq();
  mylabel: string = 'Enregistrer';
  hasAllRequiredRolesValidated: boolean = false;

  auditLogs: any[] | null = null;

  public subSubCategoryCatalogCodeSelected: string | null = null;
  public allColumnsCatalog: { [key: string]: {} } = {};
  public columnsAvailableCatalog: { [key: string]: string[] } = {};
  public columnsSelectedCatalog: { [key: string]: string[] } = {};
  public subSubCategoriesCatalog: any[] = [];
  public catalogPreviewIsReady: boolean = false;

  // @ViewChild(AppDynamicComponent) dynamicComponent: AppDynamicComponent;
  @ViewChildren(AppDynamicComponent) childComponents!: QueryList<any>;
  constructor(
    private httpclientService: HttpclientService,
    private templateService: TemplateService,
    private dialog: MatDialog,
    private dash: DashboardComponent,
    private myTableService: TabService,
    public userService: UserService,
    public tabService: TabService,
    private readonly _idmlService: IdmlService
  ) {
    // this.tabService.updateTemplateEvent.subscribe((newObj) => {
    //   this.data = newObj;
    // });

    this.myTableService.updateTemplateEvent.subscribe(({ tabId, data }) => {
      // Handle the data for the specific tab identified by tabId
      if (tabId === this.tab.id) {
        this.data = data;
        // Handle the data for the current tab

        // Update the component's data or perform any necessary operations
      } else {
        // Handle the data for other tabs
        // Update the component's data or perform any necessary operations
      }
    });
  }

  // ngAfterContentChecked() {
  //   this.cdref.detectChanges();
  // }
  async ngOnInit(): Promise<void> {
    if (this.isEditMode) {
      this.data = {};
    }

    this.canBePdfDownloaded =
      this.tab.entite === 'produit' ||
      (this.data !== undefined && this.data !== null && this.data.depth === 3);

    const url: string = `template/${this.tab.entite.toLowerCase() + 'dto'}`;
    const rs = await this.httpclientService.get(url).toPromise();

    if (rs !== null) {
      for (let template of rs) {
        this.templates[template.id] = template;
        this.allTemplates[template.id] = this.templates[template.id].titre;
      }
      this._initTemplates = JSON.parse(JSON.stringify(this.templates)); // Clone
    }

    this.getData();
    this.typeName = this.tab.entite;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tab']) {
      this.tab = changes['tab'].currentValue;
      this.isEditMode = this.tab.edition;
      this.typeName = this.tab.entite;

      this.tab.droitTitle = this.tab.droitTitle;
    }
  }

  private initAllParameters() {
    if (this.currentTemplate === undefined || this.currentTemplate == null) {
      return;
    }

    if (
      this.currentTemplate.layout === undefined ||
      this.currentTemplate.layout == null
    ) {
      return;
    }

    const allParameters: Parametre[] = [];

    this.currentTemplate.layout.tabs.forEach((t) => {
      t.rows.forEach((r) => {
        r.cols.forEach((c) =>
          c.parameters.forEach((p) => allParameters.push(p))
        );
      });
    });

    if (
      this.currentTemplate.parameters !== undefined &&
      this.currentTemplate.parameters !== null
    ) {
      this.currentTemplate.parameters.forEach((p) => allParameters.push(p));
    }

    this.allParameters = [...new Set(allParameters)];
    this.allParameters.sort((a: Parametre, b: Parametre) => {
      const aStr = (a.label !== '' ? a.label : a.name)?.toLowerCase();
      const bStr = (b.label !== '' ? b.label : b.name)?.toLowerCase();

      if (aStr < bStr) {
        return -1;
      } else if (aStr > bStr) {
        return 1;
      }

      return 0;
    });
  }

  get currentTemplate() {
    return this.templateIdSelected !== null
      ? this.templates[this.templateIdSelected]
      : null;
  }

  get currentParametersConnection() {
    return this.templateIdSelected !== null
      ? this.parametersConnections[this.templateIdSelected]
      : null;
  }

  validate() {
    // this.tab.deleteReq = this.deleteReq;

    this.tab.dialogName = 'confirmation';

    this.tab.msg = `Cette action sera irréversible, et vous ne pourrez plus apporter de modifications par la suite. Êtes-vous sûr(e) de vouloir continuer?`;
    let dialogRef = this.dialog.open(DiaologHostComponent, {
      panelClass: 'filtre-dialog-component',
      data: {
        title: 'Confirmation de la validation',
        msg: this.tab.msg,
        tab: this.tab,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let payload = {
          produitDto: this.data,
          champs: this.userService.getBackendRestrictionsChamps() || [],
        };
        this.httpclientService
          .post(payload, `${this.tab.entite.toLowerCase()}/validateChampStatus`)
          .subscribe((rs) => {
            this.data = rs;
            this.validationMessage(rs?.responseCode, rs?.code);

            this.showIntermediaryApproverButton();
          });
      }
    });
  }

  validationMessage(responseCode: string, produitCode: string) {
    {
      this.tab.dialogName = 'popup';
      if (
        responseCode === undefined ||
        responseCode === null ||
        responseCode !== '00'
      ) {
        this.tab.msg = `La validation du produit avec le code ${produitCode} a échoué. Veuillez contacter l'administrateur.`;
      } else {
        this.tab.msg = `La validation du produit avec le code ${produitCode} a réussi.`;
      }
      let dialogRef = this.dialog.open(DiaologHostComponent, {
        panelClass: 'filtre-dialog-component',
        data: {
          title: 'Attention !',
          msg: this.tab.msg,
          tab: this.tab,
        },
      });
      return true;
    }
  }
  getData() {
    if (!this.tab.id) {
      this.isEditMode = true;
      this.lectureMode = false;

      this.templateIdSelected = this.tab.template.id;

      this.initAllParameters();

      return;
    }
    let url = `${this.tab.entite.toLowerCase()}/${this.tab.id}`;
    this.httpclientService.get(url).subscribe((rs) => {
      this.data = rs;
      console.log(this.data)

      if (this.tab.entite === 'catalog' && this.data.categories !== undefined && this.data.categories !== null && this.data.categories.length > 0) {
        this.httpclientService.get(`catalog/columns`).subscribe((allColumnsCatalog) => {
          this.allColumnsCatalog = allColumnsCatalog;

          const allCodeColumnsCatalog = Object.keys(this.allColumnsCatalog);
          allCodeColumnsCatalog.sort((a: string, b: string) => {
            const aStr = a.toLowerCase();
            const bStr = b.toLowerCase();
            if (aStr < bStr) {
              return -1;
            } else if (aStr > bStr) {
              return 1;
            }
            return 0;
          });

          if (this.data.tables === undefined || this.data.tables === null) {
            this.data.tables = [];
          }

          if (this.data.tables.length === 0 || this.data.tables.length !== this.data.categories.length) {
            for (let i = 0; i < this.data.categories.length; i++) {
              // Delete table with no category
              if (this.data.tables.find((table: any) => table.category === null) !== undefined) {
                this.data.tables = this.data.tables.filter((table: any) => (table.category !== undefined && table.category !== null));
              }

              if (this.data.tables.find((table: any) => (table.category !== undefined && table.category !== null) && table.category.code === this.data.categories[i].code) === undefined) {
                this.data.tables.push({
                  category: this.data.categories[i],
                  columns: ['code'],
                  data: {}
                });
              }
            }
          }

          this.columnsAvailableCatalog[this.data.tables[0].category.code] = JSON.parse(JSON.stringify(allCodeColumnsCatalog)); // Clone
          this.data.tables.forEach((table: any) => this.columnsSelectedCatalog[table.category.code] = []);

          if (this.data.tables !== undefined && this.data.tables !== null) {
            this.data.tables.forEach((table: any) => {
              this.columnsAvailableCatalog[table.category.code] = JSON.parse(JSON.stringify(allCodeColumnsCatalog)); // Clone
              this.columnsSelectedCatalog[table.category.code] = JSON.parse(JSON.stringify(table.columns)); // Clone

              this.columnsSelectedCatalog[table.category.code].forEach((column: string) => {
                const index = this.columnsAvailableCatalog[table.category.code].indexOf(column);
                if (index !== -1) {
                  this.columnsAvailableCatalog[table.category.code].splice(index, 1);
                }
              });
            });
          }

          this.subSubCategoryCatalogCodeSelected = this.data.categories[0].code;

          const locale: string = this.languages
            .filter((language) => language.selected)
            .map((language) => language.key)[0];

          this.catalogPreviewIsReady = false;
          this.subSubCategoriesCatalog = [];
          this.httpclientService.get(`catalog/${this.data.id}/rows/sub-sub-categories/${this.data.categories[0].id}/${locale}`).subscribe((subSubCategoriesCatalog) => {
            this.subSubCategoriesCatalog = subSubCategoriesCatalog;
            this.catalogPreviewIsReady = true;
          });
        });
      }

      this.templateIdSelected = this.findGoodTemplate();

      this.initAllParameters();

      if (this.auditLogs === null) {
        this.httpclientService
          .get(`auditLog/${this.tab.entite.toLowerCase()}/${this.tab.id}`)
          .subscribe((auditLogs) => (this.auditLogs = auditLogs));

      }

      this.canBePdfDownloaded =
        this.tab.entite === 'produit' ||
        (this.data !== undefined &&
          this.data !== null &&
          this.data.depth === 3);

      this.showIntermediaryApproverButton();
    });
  }

  showFinalApproverButton() {
    let champs = this.userService.getBackendRestrictionsChamps() || [];
    if (this.data?.etat?.valeur === 'En production') {
      return false;
    }
    if (
      this.data?.etat?.valeur !== 'En production' &&
      this.data?.etat?.valeur !== 'Archivé' &&
      this.data?.etatTechnique?.valeur === 'Validé' &&
      this.data?.etatMarketing?.valeur === 'Validé' &&
      this.data?.etatTarif?.valeur === 'Validé' &&
      this.UserCanValidateFinaletatField()
    ) {
      return true;
    }

    return false;
  }
  showEditButton() {
    let champs = this.userService.getBackendRestrictionsChamps() || [];
    if (
      this.UserCanValidateFinaletatField() ||
      this.showIntermediaryApprovalButton ||
      !this.isApprovableEntite()
    ) {
      return true;
    }
    return false;
  }

  isApprovableEntite() {
    return (
      this.entitiespourvalidation.indexOf(this.tab.entite.toLowerCase()) !== -1
    );
  }

  UserCanValidateFinaletatField() {
    let champs = this.userService.getBackendRestrictionsChamps() || [];
    if (champs.indexOf('etat') !== -1) {
      return true;
    }
    return false;
  }
  showIntermediaryApproverButton() {
    let champs = this.userService.getBackendRestrictionsChamps() || [];
    if (this.isApprovableEntite() && this.UserCanValidateFinaletatField()) {
      this.showIntermediaryApprovalButton = false;
    } else if (this.isApprovableEntite()) {
      let payload = {
        produitDto: this.data,
        champs,
      };
      this.httpclientService
        .post(payload, `${this.tab.entite.toLowerCase()}/verifyChampStatus`)
        .subscribe((rs) => {
          if (!rs) {
            this.showIntermediaryApprovalButton = true;
          } else {
            this.showIntermediaryApprovalButton = false;
          }
        });
    }
  }
  async enrgister() {
    if (this.isEditMode) {
      this.enrgisterData();
    } else if (this.isLayoutEditMode) {
      this.saveLayout();
    }
  }

  async enrgisterData() {
    if (this.tab.entite === 'catalog') {
      if (!this.data) {
        this.data = {}
      }
      this.data.tables = [];
      for (const categoryCode in this.columnsSelectedCatalog) {
        this.data.tables.push({
          category: this.data.categories.find((category: any) => category.code === categoryCode),
          columns: this.columnsSelectedCatalog[categoryCode],
        });
      }
      this.tab.catalogTables = this.data.tables;
    }

    await this.templateService
      .processEnregister(this.childComponents, this.tab)
      .subscribe((rs) => {
        if(rs.responseMessage=="Archivé" || rs.responseMessage=="UnArchivé")
        {
          this.archive() 
        }
        else
        if( rs.responseMessage=="UnArchivé")
          {
            this.archive() 
          }
        
        this.tab.id = rs.id;
        this.myTableService.updateOrAddItem(rs, this.tab.entite); // this is to update the table
        this.myTableService.updateTemplateData(rs.id, rs);

        this.data = rs;

        if (this.tab.entite === 'catalog') {
          this.data.tables = this.tab.catalogTables;
        }

        this.dash.changeNameOrTitleAfterSave(
          this.tab,
          this.tabService.getTabTitle(rs, this.languages, this.tab.entite)
        );

        this.showIntermediaryApproverButton(); // this is to update the template data
      });

    this.tab.isEditMode = false;
    this.tab.edition = false;
    this.isEditMode = false;
    this.isLayoutEditMode = false;
    this.lectureMode = true;
    this.tab.droitTitle = this.userService.getMenuNameFromEntite(this.tab.entite) ??
      this.tab.droitTitle;
    this.tab.value = 'lecture';
  }

  modeEdition() {
    this.lectureMode = false;
    this.isEditMode = true;
    this.tab.isEditMode = true;
    this.tab.edition = true;
    this.isLayoutEditMode = false;
    this.typeName = this.tab.entite;
    this.tab.value = 'edition';
  
  }

  hasTitleOnCols(cols: Col[]) {
    return (
      cols.filter((col: Col) => col.title != null && col.title.trim() !== '')
        .length > 0
    );
  }

  hasTitleOnRow(row: Row) {
    return row.title !== '';
  }

  archive() {
    // this.deleteReq.idList.push(this.tab.id);
    // this.tab.dialogName = 'supprime';
    // this.tab.deleteReq = this.deleteReq;
    this.deleteReq.idList.push(this.tab.id);
    this.tab.dialogName = 'supprime';
    this.tab.deleteReq = this.deleteReq;
    this.totalElements = this.tab.totalElements;

    this.tab.msg = `Voulez-vous vraiment archiver le enregistrement`;
    let dialogRef = this.dialog.open(DiaologHostComponent, {
      panelClass: 'filtre-dialog-component',
      data: {
        title: 'Confirmation de la archivage',
        msg: `Voulez-vous vraiment archiver le enregistrement`,
        tab: this.tab,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.dash.openPrev(this.tab);
    });
  }


  supprimer() {
    // this.deleteReq.idList.push(this.tab.id);
    // this.tab.dialogName = 'supprime';
    // this.tab.deleteReq = this.deleteReq;
    this.deleteReq.idList.push(this.tab.id);
    this.tab.dialogName = 'supprime';
    this.tab.deleteReq = this.deleteReq;
    this.totalElements = this.tab.totalElements;

    this.tab.msg = `Voulez-vous vraiment supprimer les enregistrements`;
    let dialogRef = this.dialog.open(DiaologHostComponent, {
      panelClass: 'filtre-dialog-component',
      data: {
        title: 'Confirmation de la suppression',
        msg: `Voulez-vous vraiment supprimer les enregistrements`,
        tab: this.tab,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.dash.openPrev(this.tab);
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Layout editor
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  editLayout() {
    if (this.currentTemplate === null || this.templateIdSelected === null) {
      return;
    }

    if (
      this.currentTemplate.layout === undefined ||
      this.currentTemplate.layout === null
    ) {
      // For retrocompatibility
      this.templates[this.templateIdSelected].layout = {
        hasCondition: false,
        conditions: [],
        tabs: [
          {
            id: uuidv4(),
            label: 'Informations générales',
            rows: [
              {
                id: uuidv4(),
                title: '',
                cols: [
                  {
                    id: uuidv4(),
                    title: '',
                    parameters: this.currentTemplate.colonnegauche,
                  },
                  {
                    id: uuidv4(),
                    title: '',
                    parameters: this.currentTemplate.colonnedroite,
                  },
                ],
              },
            ],
          },
        ],
      };
      this.templates[this.templateIdSelected].parameters = [];
    } else {
      this.sortParameters();
    }
    this.refreshParametersConnection();

    this.isLayoutEditMode = true;
    this.isEditMode = false;
    this.lectureMode = false;
  }

  private refreshParametersConnection() {
    if (this.currentTemplate === null || this.templateIdSelected === null) {
      return;
    }

    this.parametersConnections[this.templateIdSelected] =
      this.currentTemplate.layout.tabs.flatMap((tab: any) =>
        tab.rows.flatMap((row: any) => row.cols.map((col: any) => col.id))
      );
    this.parametersConnections[this.templateIdSelected].push('parameters');
  }

  private sortParameters() {
    if (this.currentTemplate === null || this.templateIdSelected === null) {
      return;
    }

    if (
      this.currentTemplate.parameters === undefined ||
      this.currentTemplate.parameters === null
    ) {
      this.templates[this.templateIdSelected].parameters = [];
    }

    /*
    this.templates[this.templateIdSelected].parameters.sort(
      (a: Parametre, b: Parametre) => {
        const aStr = (a.label !== '' ? a.label : a.name).toLowerCase();
        const bStr = (b.label !== '' ? b.label : b.name).toLowerCase();

        if (aStr < bStr) {
          return -1;
        } else if (aStr > bStr) {
          return 1;
        }

        return 0;
      }
    );
    */
    // handled null values of label and name in parameters
    this.templates[this.templateIdSelected].parameters = this.templates[
      this.templateIdSelected
    ].parameters
      .filter((param: Parametre) => param.name !== null)
      .sort((a: Parametre, b: Parametre) => {
        const aStr = (
          a.label !== '' ? a?.label : a?.name !== '' ? a?.valeur : a?.valeur
        ).toLowerCase();
        const bStr = (
          b.label !== '' ? b?.label : b?.name !== '' ? a?.valeur : a?.valeur
        ).toLowerCase();

        if (aStr < bStr) {
          return -1;
        } else if (aStr > bStr) {
          return 1;
        }

        return 0;
      });
  }

  onOpenLanguages(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.isOpenLanguages = !this.isOpenLanguages;
  }

  saveLayout() {
    if (this.templateIdSelected !== null) {
      this.updateLanguagesFilter();

      this.templateService
        .updateTemplate(this.templates[this.templateIdSelected])
        .subscribe(() => {
          this.isEditMode = false;
          this.isLayoutEditMode = false;
          this.lectureMode = true;
        });
    }
  }

  cancelEditLayout() {
    this.isEditMode = false;
  }

  dropParameter(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  dropRows(event: CdkDragDrop<any>, rows: any) {
    moveItemInArray(rows, event.previousIndex, event.currentIndex);
  }

  dropCols(event: CdkDragDrop<any>, cols: any) {
    moveItemInArray(cols, event.previousIndex, event.currentIndex);
  }

  onAddCol(cols: any, colId: any) {
    const index: number = cols.findIndex((col: any) => col.id === colId);
    if (index !== -1) {
      cols.splice(index + 1, 0, { id: uuidv4(), title: '', parameters: [] });
    }
    this.refreshParametersConnection();
  }

  onRemoveCol(cols: any, colId: any) {
    this.tab.dialogName = 'confirmation';
    this.tab.msg = `Voulez-vous vraiment supprimer cette colonne ?`;
    let dialogRef = this.dialog.open(DiaologHostComponent, {
      panelClass: 'filtre-dialog-component',
      data: {
        title: 'Confirmation de la suppression',
        tab: this.tab,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const isLastCol = cols.length === 1;

        const index: number = cols.findIndex((col: any) => col.id === colId);
        if (index !== -1) {
          // Retrieve parameters from col selected
          cols[index].parameters.forEach((parameter: any) => {
            if (this.templateIdSelected !== null) {
              this.templates[this.templateIdSelected].parameters.push(
                parameter
              );
            }
          });
          this.sortParameters();

          // Remove col selected
          cols.splice(index, 1);
        }
        if (isLastCol) {
          cols.push({ id: uuidv4(), parameters: [] });
        }
        this.refreshParametersConnection();
      }
    });
  }

  onAddRow(rows: any, rowId: any) {
    const index: number = rows.findIndex((row: any) => row.id === rowId);
    if (index !== -1) {
      rows.splice(index + 1, 0, {
        id: uuidv4(),
        title: '',
        cols: [{ id: uuidv4(), title: '', parameters: [] }],
      });
    }
    this.refreshParametersConnection();
  }

  onRemoveRow(rows: any, rowId: any) {
    this.tab.dialogName = 'confirmation';
    this.tab.msg = `Voulez-vous vraiment supprimer cette ligne ?`;
    let dialogRef = this.dialog.open(DiaologHostComponent, {
      panelClass: 'filtre-dialog-component',
      data: {
        title: 'Confirmation de la suppression',
        tab: this.tab,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const isLastRow = rows.length === 1;

        const index: number = rows.findIndex((row: any) => row.id === rowId);
        if (index !== -1) {
          // Retrieve parameters from all cols from row selected
          rows[index].cols
            .flatMap((col: any) => col.parameters)
            .forEach((parameter: any) => {
              if (this.templateIdSelected !== null) {
                this.templates[this.templateIdSelected].parameters.push(
                  parameter
                );
              }
            });
          this.sortParameters();

          // Remove row selected
          rows.splice(index, 1);
        }

        if (isLastRow) {
          rows.push({
            id: uuidv4(),
            title: '',
            cols: [{ id: uuidv4(), title: '', parameters: [] }],
          });
        }

        this.refreshParametersConnection();
      }
    });
  }

  onAddTab() {
    if (this.templateIdSelected === null) {
      return;
    }

    const index: number =
      this.templates[this.templateIdSelected].layout.tabs.length;

    this.templates[this.templateIdSelected].layout.tabs.push({
      id: uuidv4(),
      label: `Onglet ${index}`,
      rows: [
        {
          id: uuidv4(),
          title: '',
          cols: [{ id: uuidv4(), title: '', parameters: [] }],
        },
      ],
    });
    this.refreshParametersConnection();
  }

  onRemoveTab(index: number) {
    this.tab.dialogName = 'confirmation';
    this.tab.msg = `Voulez-vous vraiment supprimer cette onglet ?`;
    let dialogRef = this.dialog.open(DiaologHostComponent, {
      panelClass: 'filtre-dialog-component',
      data: {
        title: 'Confirmation de la suppression',
        tab: this.tab,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        if (this.templateIdSelected === null) {
          return;
        }

        if (index > 0) {
          // Retrieve parameters from tab selected
          this.templates[this.templateIdSelected].layout.tabs[index].rows
            .flatMap((row: any) =>
              row.cols.flatMap((col: any) => col.parameters)
            )
            .forEach((parameter: any) => {
              if (this.templateIdSelected !== null) {
                this.templates[this.templateIdSelected].parameters.push(
                  parameter
                );
              }
            });
          this.sortParameters();

          // Remove tab selected
          this.templates[this.templateIdSelected].layout.tabs.splice(index, 1);

          this.refreshParametersConnection();
        }
      }
    });
  }

  onChangeLanguage(language: Language) {
    if (language.key === 'all') {
      this.languages.forEach((l) => (l.selected = language.selected));
    } else if (language.selected === false) {
      const allLanguages = this.languages.find((l) => l.key == 'all');
      if (allLanguages !== undefined) {
        allLanguages.selected = false;
      }
    } else if (language.selected === true) {
      if (
        this.languages.length -
        this.languages.filter((language) => language.selected).length ===
        1
      ) {
        const allLanguages = this.languages.find((l) => l.key == 'all');
        if (allLanguages !== undefined) {
          allLanguages.selected = true;
        }
      }
    }

    this.updateLanguagesFilter();

    // Refresh catalog if necessary
    if (this.tab.entite === 'catalog' && this.data.categories !== undefined && this.data.categories !== null && this.data.categories.length > 0) {
      const locale: string = this.languages
        .filter((language) => language.selected)
        .map((language) => language.key)[0];

      this.catalogPreviewIsReady = false;
      this.subSubCategoriesCatalog = [];
      this.httpclientService.get(`catalog/${this.data.id}/rows/sub-sub-categories/${this.data.categories[0].id}/${locale}`).subscribe((subSubCategoriesCatalog) => {
        this.subSubCategoriesCatalog = subSubCategoriesCatalog;
        this.catalogPreviewIsReady = true;
      });
    }
  }

  private updateLanguagesFilter() {
    if (this.currentTemplate === null) {
      return;
    }

    const locales: string[] = this.languages
      .filter((language) => language.selected)
      .map((language) => language.key);

    if (this.currentTemplate.layout === null) {
      [
        ...this.currentTemplate.colonnegauche,
        ...this.currentTemplate.colonnedroite,
      ].forEach((parametre) => {
        if (
          parametre.multiLangue !== undefined &&
          parametre.multiLangue === true
        ) {
          // Reset all
          parametre.parametres.forEach(
            (sousParameter) => (sousParameter.visible = false)
          );

          // Filter
          parametre.parametres.forEach((sousParameter) => {
            if (locales.indexOf('all') !== -1) {
              sousParameter.visible = true;
            } else if (locales.indexOf(sousParameter.label) !== -1) {
              sousParameter.visible = true;
            }
          });
        }
      });
    } else {
      this.currentTemplate.layout.tabs.forEach((tab) => {
        tab.rows.forEach((row) => {
          row.cols.forEach((col) => {
            col.parameters.forEach((parametre) => {
              if (
                parametre.multiLangue !== undefined &&
                parametre.multiLangue === true
              ) {
                // Reset all
                parametre.parametres.forEach(
                  (sousParameter) => (sousParameter.visible = false)
                );

                // Filter
                parametre.parametres.forEach((sousParameter) => {
                  if (locales.indexOf('all') !== -1) {
                    sousParameter.visible = true;
                  } else if (locales.indexOf(sousParameter.label) !== -1) {
                    sousParameter.visible = true;
                  }
                });
              }
            });
          });
        });
      });
    }
  }

  @ViewChild('languagesElementRef') languagesElementRef: ElementRef;

  @HostListener('document:click', ['$event'])
  onCloseLanguages(event: any) {
    if (
      this.isOpenLanguages &&
      !this.languagesElementRef.nativeElement.contains(event.target)
    ) {
      this.isOpenLanguages = false;
      this.updateLanguagesFilter();
    }
  }

  cancel() {
    this.isEditMode = false;
    this.isLayoutEditMode = false;
    this.lectureMode = true;

    this.templates = JSON.parse(JSON.stringify(this._initTemplates)); // Clone
    this.templateIdSelected = this.findGoodTemplate();
  }

  downloadPDF() {
    const locales: string[] = this.languages
      .filter((language) => language.selected)
      .map((language) => language.key);

    for (const locale of locales) {
      if (this.tab.entite === 'produit') {
        this.httpclientService
          .downloadBlob(`pdf/product/${this.tab.id}/${locale}`)
          .subscribe((data: Blob) => {
            const link: HTMLAnchorElement = document.createElement('a');
            link.href = window.URL.createObjectURL(data);
            link.download = `${this.tab.entite}-${this.tab.title}-${locale}.pdf`;
            link.click();
          });
      } else if (
        this.data !== undefined &&
        this.data !== null &&
        this.data.depth === 3
      ) {
        this.httpclientService
          .downloadBlob(`pdf/famille/${this.tab.id}/${locale}`)
          .subscribe((data: Blob) => {
            const link: HTMLAnchorElement = document.createElement('a');
            link.href = window.URL.createObjectURL(data);
            link.download = `${this.tab.entite}-${this.tab.title}-${locale}.pdf`;
            link.click();
          });
      }
    }
  }

  onSearch(event: KeyboardEvent) {
    if (this.templateIdSelected === null) {
      return;
    }

    const search: string = (<any>event.target).value.toLowerCase();

    this.templates[this.templateIdSelected].parameters.sort(
      (a: any, b: any) => {
        const aLabel = a.label.toLowerCase();
        const aName = a.name.toLowerCase();

        const bLabel = b.label.toLowerCase();
        const bName = b.name.toLowerCase();

        if (
          (aLabel.startsWith(search) && !bLabel.startsWith(search)) ||
          (aName.startsWith(search) && !bName.startsWith(search))
        ) {
          return -1;
        } else if (
          (!aLabel.startsWith(search) && bLabel.startsWith(search)) ||
          (!aName.startsWith(search) && bName.startsWith(search))
        ) {
          return 1;
        }

        return 0;
      }
    );
  }

  onAddTemplate() {
    const ids: string[] = Object.keys(this.templates);
    const key = this.tab.entite + '-' + ids.length;

    const id = uuidv4();

    // Clone first template
    this.templates[id] = JSON.parse(JSON.stringify(this.templates[ids[0]])); // Clone
    this.templates[id].id = id;
    this.templates[id].titre = key;
    this.templates[id].layout = {
      hasCondition: true,
      conditions: [],
      tabs: [
        {
          id: uuidv4(),
          label: 'Informations générales',
          rows: [
            {
              id: uuidv4(),
              title: '',
              cols: [
                {
                  id: uuidv4(),
                  title: '',
                  parameters: [],
                },
              ],
            },
          ],
        },
      ],
    };
    this.templates[id].parameters = this.allParameters;

    this.allTemplates[id] = key;
    this.templateIdSelected = id;

    this.refreshParametersConnection();
  }

  onCloneTemplate() {
    const ids: string[] = Object.keys(this.templates);
    const key = this.tab.entite + '-' + ids.length;

    const id = uuidv4();

    // Clone previous template
    this.templates[id] = JSON.parse(JSON.stringify(this.currentTemplate)); // Clone
    this.templates[id].id = id;
    this.templates[id].titre = key;
    this.templates[id].layout.hasCondition = true;

    this.allTemplates[id] = key;
    this.templateIdSelected = id;

    this.refreshParametersConnection();
  }

  hasCondition() {
    const ids: string[] = Object.keys(this.templates);
    return (
      ids[0] !== this.templateIdSelected &&
      this.currentTemplate?.layout.hasCondition
    );
  }

  onRemoveTemplate() {
    this.tab.dialogName = 'confirmation';
    this.tab.msg = `Voulez-vous vraiment supprimer ce template ?`;
    let dialogRef = this.dialog.open(DiaologHostComponent, {
      panelClass: 'filtre-dialog-component',
      data: {
        title: 'Confirmation de la suppression',
        tab: this.tab,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        if (this.currentTemplate === null) {
          return;
        }

        const id: string = this.currentTemplate.id;
        const url: string = `template/${id}`;

        this.httpclientService.delete(url).subscribe(() => {
          delete this.templates[id];
          delete this.allTemplates[id];
          this.templateIdSelected = Object.keys(this.allTemplates)[0];
        });
      }
    });
  }

  findGoodTemplate() {
    for (const id in this.templates) {
      const layout = this.templates[id].layout;

      if (
        layout === undefined ||
        layout.conditions === undefined ||
        layout.conditions === null ||
        layout === null ||
        layout.hasCondition === false ||
        layout.conditions.length === 0
      ) {
        continue;
      }

      const conditions = layout.conditions;
      if (conditions) {
        for (const condition of conditions) {
          const v = this.data[condition.key];
          if (v === undefined || v === null) {
            continue;
          }

          if (typeof v === 'boolean') {
            if (
              v === true &&
              (condition.value === true ||
                condition.value === 'true' ||
                condition.value === 1 ||
                condition.value === '1')
            ) {
              return id;
            } else if (
              v === false &&
              (condition.value === false ||
                condition.value === 'false' ||
                condition.value === 0 ||
                condition.value === '0')
            ) {
              return id;
            }
          }

          if (typeof v === 'object' && v.valeur !== undefined) {
            if (
              v.valeur === condition.value ||
              v.valeur.toString() == condition.value.toString()
            ) {
              return id;
            }
          }

          if (
            v === condition.value ||
            v.toString() == condition.value.toString()
          ) {
            return id;
          }
        }
      }
    }

    return this.templates[Object.keys(this.allTemplates)[0]]?.id;
  }

  onConditions(event: any) {
    event.preventDefault();

    this.tab.dialogName = 'layout-conditions';
    this.tab.template = this.currentTemplate;

    const dialogRef = this.dialog.open(DiaologHostComponent, {
      panelClass: 'filtre-dialog-component',
      data: {
        title: 'Conditions',
        msg: '',
        tab: this.tab,
      },
    });
    dialogRef.afterClosed().subscribe((conditions: LayoutCondition[]) => {
      if (this.templates !== null && this.templateIdSelected !== null) {
        this.templates[this.templateIdSelected].layout.conditions = conditions;
        this.templates[this.templateIdSelected].layout.hasCondition = true;
      }
    });
  }

  onClearTemplate() {
    this.tab.dialogName = 'confirmation';
    this.tab.msg = `Voulez-vous vraiment vider le template ?`;
    let dialogRef = this.dialog.open(DiaologHostComponent, {
      panelClass: 'filtre-dialog-component',
      data: {
        title: 'Confirmation de la suppression',
        tab: this.tab,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        if (this.templateIdSelected === null) {
          return;
        }

        this.templates[this.templateIdSelected].layout.tabs = [
          {
            id: uuidv4(),
            label: 'Informations générales',
            rows: [
              {
                id: uuidv4(),
                title: '',
                cols: [
                  {
                    id: uuidv4(),
                    title: '',
                    parameters: [],
                  },
                ],
              },
            ],
          },
        ];
        this.templates[this.templateIdSelected].parameters = this.allParameters;

        this.refreshParametersConnection();
      }
    });
  }

  hasAuditLogs(): boolean {
    if (this.auditLogs === undefined || this.auditLogs === null) {
      return false;
    }
    return this.auditLogs.length > 0;
  }

  onOpenArchive(event: any): void {
    event.preventDefault();

    if (this.auditLogs === undefined || this.auditLogs === null) {
      return;
    }

    this.tab.dialogName = 'archives';

    if (this.templateIdSelected !== null) {
      const fields = this.templates[this.templateIdSelected].layout.tabs
        .flatMap((t) => t.rows)
        .flatMap((r) => r.cols)
        .flatMap((c) => c.parameters)
        .map((p) => {
          return { name: p.name, label: p.label };
        });

      this.auditLogs = this.auditLogs.map((al) => {
        const field: { name: string; label: string } | undefined = fields.find(
          (f) => f.name === al.fieldName
        );
        if (field !== undefined) {
          al.fieldName = field.label;
        }
        return al;
      });
    }

    this.dialog.open(DiaologHostComponent, {
      panelClass: 'filtre-dialog-component',
      data: {
        title: 'Archive des modifications',
        tab: this.tab,
      },
    });
  }

  onSelectSubSubCategoryCodeCatalog(subSubCategoryCatalogCodeSelected: string) {
    this.subSubCategoryCatalogCodeSelected = subSubCategoryCatalogCodeSelected;

    if (this.columnsAvailableCatalog[subSubCategoryCatalogCodeSelected] === undefined || this.columnsAvailableCatalog[subSubCategoryCatalogCodeSelected] === null || this.columnsAvailableCatalog[subSubCategoryCatalogCodeSelected].length === 0) {
      const allCodeColumnsCatalog = Object.keys(this.allColumnsCatalog);
      allCodeColumnsCatalog.sort((a: string, b: string) => {
        const aStr = a.toLowerCase();
        const bStr = b.toLowerCase();
        if (aStr < bStr) {
          return -1;
        } else if (aStr > bStr) {
          return 1;
        }
        return 0;
      });

      this.columnsAvailableCatalog[subSubCategoryCatalogCodeSelected] = allCodeColumnsCatalog;
    }

    if (this.columnsSelectedCatalog[subSubCategoryCatalogCodeSelected] === undefined || this.columnsSelectedCatalog[subSubCategoryCatalogCodeSelected] === null) {
      this.columnsSelectedCatalog[subSubCategoryCatalogCodeSelected] = [];
    }
  }

  onSelectSubSubCategoryIdCatalog(subSubCategoryCatalogIdSelected: string, subSubCategoryCatalogCodeSelected: string) {
    this.onSelectSubSubCategoryCodeCatalog(subSubCategoryCatalogCodeSelected);

    const locale: string = this.languages
      .filter((language) => language.selected)
      .map((language) => language.key)[0];

    this.catalogPreviewIsReady = false;
    this.subSubCategoriesCatalog = [];
    this.httpclientService.get(`catalog/${this.data.id}/rows/sub-sub-categories/${subSubCategoryCatalogIdSelected}/${locale}`).subscribe((subSubCategoriesCatalog) => {
      this.subSubCategoriesCatalog = subSubCategoriesCatalog;
      this.catalogPreviewIsReady = true;
    });
  }

  hasPreviewCatalog(subSubCategoryCatalogCodeSelected: string) {
    const tableFound = this.data.tables.find((table: any) => (table.category !== undefined && table.category !== null) && table.category.code === subSubCategoryCatalogCodeSelected);
    if (tableFound !== undefined && tableFound.columns.length > 0) {
      return true;
    }
    return false;
  }

  subSubCategoryColumnsCatalog(subSubCategoryCatalogCodeSelected: string) {
    if (subSubCategoryCatalogCodeSelected === undefined || subSubCategoryCatalogCodeSelected === null || this.allColumnsCatalog === undefined || this.allColumnsCatalog === null || this.allColumnsCatalog[subSubCategoryCatalogCodeSelected] === undefined || this.allColumnsCatalog[subSubCategoryCatalogCodeSelected] === null) {
      return [];
    }
    return Object.keys(this.allColumnsCatalog[subSubCategoryCatalogCodeSelected]);
  }

  subSubCategoriesColumnKeysCatalog() {
    if (this.subSubCategoryCatalogCodeSelected === undefined || this.subSubCategoryCatalogCodeSelected === null) {
      return [];
    }
    const columnKeys: string[] = JSON.parse(JSON.stringify(this.columnsSelectedCatalog[this.subSubCategoryCatalogCodeSelected])); // Clone

    if (this.subSubCategoriesCatalog !== undefined && this.subSubCategoriesCatalog !== null && this.subSubCategoriesCatalog.length > 0) {
      const index: number = columnKeys.indexOf('couleur');
      if (index !== -1) {
        const columnColorKeys: string[] = [];
        this.subSubCategoriesCatalog.forEach(subSubCategoryCatalog => {
          Object.keys(subSubCategoryCatalog)
            .filter(key => key.startsWith('couleur_'))
            .forEach(columnColorKey => {
              if (columnColorKey !== undefined && columnColorKey !== null && columnColorKeys.indexOf(columnColorKey) === -1) {
                columnColorKeys.push(columnColorKey);
              }
            });
        });
        columnColorKeys.sort((columnColorKeyA: string, columnColorKeyB: string) => {
          const keyA = columnColorKeyA.split('_')[1];
          const keyB = columnColorKeyB.split('_')[1];
          return keyA.localeCompare(keyB);
        });

        columnColorKeys.forEach((columnColorKey: string) => {
          columnKeys.splice(index + 1, 0, columnColorKey);
        });
        columnKeys.splice(index, 1);
      }
    }

    return columnKeys;
  }

  dropColumnCatalog(event: CdkDragDrop<string[]>) {
    if (this.subSubCategoryCatalogCodeSelected === null) {
      return;
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  public resolveColumnCatalogLocale(columnKey: string, column: { [key: string]: string }, onlyText: boolean): string {
    const locales: string[] = this.languages
      .filter((language) => language.selected)
      .map((language) => language.key);

    if (columnKey.startsWith('couleur_')) {
      return columnKey.split('_')[1];
    }

    if (!onlyText && column['picto'] !== undefined && column['picto'] !== null) {
      return `<img class="picto-catalog" src="${column['picto']}" alt="picto" />`;
    }

    if (column === undefined || column === null) {
      return '';
    }

    if (column[locales[0]] !== undefined && column[locales[0]] !== null) {
      return column[locales[0]];
    }

    return column['fr'];
  }

  public isImageValue(value: any): boolean {
    return value !== undefined && value !== null && typeof value === 'string' && value.startsWith('http');
  }

  onExportIdml() {
    const locale: string = this.languages
      .filter((language) => language.selected)
      .map((language) => language.key)[0];

    this._idmlService.exportFile(this.tab.id, locale).subscribe((data: Blob) => {
      const link: HTMLAnchorElement = document.createElement('a');
      link.href = window.URL.createObjectURL(data);
      link.download = 'export.idml';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    });
  }
}
