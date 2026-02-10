import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ViewChild,
  EventEmitter,
  Output,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  HostListener,
} from '@angular/core';

import { Table } from 'src/app/shared/entities/Table';
import { MatTableDataSource } from '@angular/material/table';
import { Tables } from 'src/app/shared/entities/tables';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DashboardComponent } from 'src/app/admin/core/components/dashboard/dashboard.component';
import { MenuActions } from 'src/app/shared/enums/menu-actions';
import { PageOptions } from 'src/app/shared/enums/page-modes';
import { PersonnemoraleTypes } from 'src/app/shared/enums/personmoral-types';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { DiaologHostComponent } from '../../dialogs/dialog-host/dialog-host';
import { ViewService } from 'src/app/admin/core/services/viewservice';
import { ViewDto } from 'src/app/shared/entities/viewdto';
import { TabService } from 'src/app/shared/services/tab.service';
import { MatSort, Sort } from '@angular/material/sort';
import { DeleteReq } from 'src/app/shared/entities/deleteReq';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Language } from 'src/app/shared/entities/language';
import { PictosUtils } from '../../../utils/pictosUtils';
import { Template } from '../../../entities/template';
import { RestrictService } from 'src/app/shared/services/restrict.service';
import { UserService } from 'src/app/admin/core/services/user.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { TaskService } from 'src/app/admin/core/services/task.service';
import { RxStompService } from 'src/app/admin/core/services/websocket.service';
import { UtilService } from 'src/app/admin/core/services/utilService';

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit, OnDestroy, AfterViewInit {
  public templates: Template[] = [];

  @Input() public tab: Tables = new Tables();
  @Input() public value = '';
  @Input() public user: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @Output() create = new EventEmitter<Tables>();
  color: string = '';
  visualise = 'Visualisation ';
  dataSourceSubscription: Subscription;
  deleteSubscription: Subscription;
  updateOrAddSubscription: Subscription;
  tasks: Map<string, Task> = new Map<string, Task>();

  tables: Table[] = [];
  listedechamps: any[] = ['select'];
  selected = new FormControl();
  subscriptions: Subscription[] = [];
  //service to retrieve data based on datasource
  recherche: string;
  @Input() public datasource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  clickSelection = new Set<any>();
  tabList: string[] = [];
  pageOptions = PageOptions;
  pageOption = this.pageOptions.WAIT;
  idList: string[] = [];
  type: Map<string, string> = new Map<string, string>();
  entiteName: string = '';
  defaultVisualisation: any = '';
  defaultVisualisationId: string = '';
  defaultView: any = new ViewDto();
  views: ViewDto[] = [];
  deleteReq = new DeleteReq();
  disable: boolean = false;
  filters: { [key: string]: any } = {};
  sorts: { [key: string]: any } = {};
  filterTypes: any = null;
  initData: any = null;
  totalElements: number = 0;
  pageIndex: number = 0;
  pageSize: number = 25;
  pageSizeOptions = [25, 50, 75, 100];
  columnDefs: any;
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  total = 100;
  favoriView: any;
  client: String = environment.client;
  sortdirection: String = 'asc';

  isOpenAddElement: boolean = false;

  isOpenLanguages: boolean = false;

  languages: Language[] = [
    { key: 'fr_FR', label: 'Français', selected: true },
    { key: 'en_GB', label: 'Anglais', selected: false },
    { key: 'de_DE', label: 'Allemand', selected: false },
    { key: 'es_ES', label: 'Espagnol', selected: false },
    { key: 'all', label: 'Toutes les langues', selected: false },
  ];

  @ViewChild(MatSort) sort: MatSort;

  private _transformer = (node: any, level: number) => {
    return {
      expandable: !!node.subChildren && node.subChildren.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.subChildren
  );
  treeFlatDataSource = new MatTreeFlatDataSource(
    this.treeControl,
    this.treeFlattener
  );

  hasTreeFlat: boolean = false;

  hasChild = (_: number, node: FlatNode) => node.expandable;

  switchOn: string = 'table';

  private debounceTimer: any;

  constructor(
    private dash: DashboardComponent,
    private restrictionsComponent: RestrictService,
    private dialog: MatDialog,
    private viewService: ViewService,
    private myTableService: TabService,
    private httpClient: HttpClient,
    public userService: UserService,
    private rxStompService: RxStompService,
    private taskservice: TaskService,
    private utilService: UtilService
  ) {
    this.type.set('Associés', PersonnemoraleTypes.ASSOCIE);
    this.type.set('Clients', PersonnemoraleTypes.CLIENT);
    this.type.set('Fournisseurs', PersonnemoraleTypes.FOURNISSEUR);
    // Subscribe to sortChange event to get sort direction
    // this.sort.sortChange.subscribe((sort) => {
    //   console.log('Sort direction:', sort.direction);
    //   console.log('Active column:', sort.active);
    //   this.sortdirection = sort.direction;

    //   // Here you can send the sorting information to your backend for pagination
    //   // Example: this.myBackendService.getPaginatedData(sort.active, sort.direction);
    // });
  }

  ngAfterViewInit() {
    if (this.sort !== undefined) {
      this.sort.sortChange.subscribe(() => {
        this.loadSortedData(this.sort.active, this.sort.direction);
      });
      this.datasource.sort = this.sort;
    }
  }

  async ngOnInit() {
    this.taskservice.subscribeToTaskStatus();
    this.user = await this.userService.getCurrentUser();
    this.loadDefaultView(); // 3 correspond au nombre d'essais pour récupérer les views (évite un bug à la première connexion)
    this.viewService.visualisationEvent.subscribe((x) => {
      if (x !== undefined && x !== null) {
        //this.populateListeChamps(x);
        x.isselected = true;
        this.selectView(x);
      }
    });
    this.viewService.deleteEvent.subscribe((IdsViewtoRemove) => {
      if (IdsViewtoRemove.find((x) => x === this.defaultView.id)) {
        this.defaultView = undefined;
      }

      this.views = this.views.filter((x) => !IdsViewtoRemove.includes(x.id));

      this.loadDefaultView();
    });

    this.myTableService.setDataSource(this.tab.entite, this.datasource);
    if (
      this.tab.entite === 'personnemorale' ||
      this.tab.entite === 'personnephysique'
    ) {
    }
    // this activates the websocket connection to get the update on task
    if (this.tab.entite == 'TachePlanifiee') {
      this.tab.isMenuVisible = false;

    //   this.defaultView.listedechamps = this.listedechamps;
    //   this.rxStompService.activate();
    //   this.rxStompService.watch('/topic/message').subscribe((message: any) => {
    //     const bodyObject = JSON.parse(message?.body);

    //     bodyObject.nextExecutionTime = this.utilService.formatDate(
    //       bodyObject.nextExecutionTime
    //     );
    //     this.myTableService.updateOrAddItem(bodyObject, this.tab.entite);
    //   });
    }
    if (this.tab.entite === 'categorie') {
    }
    //this.views = this.viewService.getViews(this.tab.title, this.tab.entite);

    //let def = this.views.find((x) => x.favori === true);

    this.deleteSubscription = this.myTableService.deleteEvent.subscribe(
      (totalElements) => {
        this.datasource = this.myTableService.getDataSource(this.tab.entite);

        this.initData = this.datasource.data;

        this.totalElements = totalElements;
      }
    );
    this.updateOrAddSubscription =
      this.myTableService.updateDataEvent.subscribe((totalElements) => {
        this.datasource = this.myTableService.getDataSource(this.tab.entite);

        this.initData = this.datasource.data;
        this.totalElements = this.datasource.data.length;
      });

    const url: string = `template/${this.tab.entite.toLowerCase() + 'dto'}`;
    const rs: any = await this.httpClient.get(url).toPromise();
    if (rs !== null) {
      this.templates = rs;
    }

    this.initFiltres();
  }

  loadUserViews(): Observable<ViewDto[]> {
    let viewRequest = new ViewDto();
    viewRequest.entite = this.tab.entite;
    viewRequest.ownerid = localStorage.getItem('userid');
    return this.viewService.getUserViews(viewRequest);
  }
  loadDefaultView() {
    if (!this.views || this.views.length === 0) {
      this.loadUserViews().subscribe((x: ViewDto[]) => {
        this.views = x;

        // Move the code that depends on this.views inside the subscription block
        this.handleViews();
      });
    } else {
      // If this.views is already populated, directly handle it
      this.handleViews();
    }
  }

  private handleViews() {
    if (this.views !== undefined && this.views !== null) {
      this.favoriView = this.views.find((x) => x.isfavori === true);

      if (
        this.favoriView !== undefined &&
        this.favoriView !== null &&
        this.favoriView.champs !== undefined &&
        this.favoriView !== null &&
        this.favoriView.champs !== null
      ) {
        this.defaultView = this.favoriView;
        this.defaultView.isselected = true;
      } else if (
        this.views.length > 0 &&
        this.defaultView !== undefined &&
        this.defaultView !== null
      ) {
        this.listedechamps = ['select'];
        this.defaultView = this.views[0];
        this.defaultView.isselected = true;
      } else if (
        this.defaultView === undefined ||
        (this.defaultView !== undefined && this.views.length === 0)
      ) {
        this.defaultView = new ViewDto();
        this.defaultView.champs = new Map([
          ['select', ''],
          ['id', 'id'],
          ['nom', 'nom'],
          ['code', 'code'],
        ]);

        this.defaultView.id = '1';
        this.defaultView.isselected = true;
        this.defaultView.nom = 'Default';
        this.defaultView.entite = this.tab.entite;
      }

      if (this.defaultView !== undefined && this.defaultView !== null) {
        //this.populateListeChamps();
        this.defaultView.isselected = true;
        this.selectView(this.defaultView);
      }
    }
  }

  populateListeChamps(view: ViewDto) {
    if (!view) {
      view = new ViewDto();
      view.champs = new Map([
        ['select', ''],
        ['id', 'id'],
        ['nom', 'nom'],
      ]);

      view.id = '1';
      view.nom = 'Default';
      view.entite = this.tab.entite;
    }
    this.listedechamps = ['select'];
    for (const [key, value] of Object.entries(view.champs)) {
      if (!this.listedechamps.some((x) => x === value)) {
        this.listedechamps.push(value);
      }
    }

    if (
      this.listedechamps.length !== null &&
      this.listedechamps.find((x) => x === 'id') === undefined
    ) {
      this.listedechamps.push('id');
    }

    if (this.tab.entite == 'TachePlanifiee') {
      this.listedechamps = this.listedechamps.filter((x) => {
        return x != 'select';
      });
    }

    this.defaultView = view;
    this.defaultView.isselected = true;
  }
  ngOnChanges(change: SimpleChanges) {
    this.loadDefaultView();
    if (change['tab']) {
      this.tab = change['tab'].currentValue;
      // this.listedechamps = this.tab.listedechamps;
      this.entiteName = this.tab.entite;

      this.filters = this.tab.filresappliques;
    }
  }

  hasMultiTemplates() {
    return (
      this.templates !== undefined &&
      this.templates !== null &&
      this.templates.length > 0
    );
  }

  sortData(sort: Sort) {
    // Name of the active column
    this.sortdirection = sort.direction;

    // Here you can perform any additional actions based on the sort event
  }
  loadSortedData(sortColumn: string, sortDirection: string) { }

  isFavoriView(view: ViewDto): boolean {
    return view?.nom === this.favoriView?.nom;
  }
  setFavoriView(view: ViewDto) {
    view.favori = true;
    view.ownerid = localStorage.getItem('userid');
    this.favoriView = view;
    this.viewService.setFavoriView(view);
  }

  rafraichir() {
    this.selectView(this.defaultView);
  }

  filtreMotCles(event: Event) {
    const code = (event.target as HTMLInputElement).value;
    //this.datasource.filter = filterValue.trim().toLowerCase();

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.applyCodeFilter(code);
    }, 300); // 300 ms de délai
  }

  applyCodeFilter(code: string) {
    if (this.filters === undefined || this.filters === null) {
      this.filters = [];
    }
  
    let champValue = 'code';
    if (this.tab.title === 'Conditionnements') {
      champValue = 'externalId';
    } else if (this.tab.title === 'Adaptation pots/plaques') {
      champValue = 'produit';
    }
  
    this.filters['code'] = {
      champ: champValue,
      conditions: [
        {
          "condition": "CONTAINS",
          "valeur": code
        }
      ]
    };
  
    this.pageIndex = 0;
    this.paginator.pageIndex = this.pageIndex;
  

    this.populateTableByfiltersAndSorts(this.filters, this.sorts);
  }
  

//   applyCodeFilter(code: string) {
//     if (this.filters === undefined || this.filters === null) {
//       this.filters = [];
//     }
//     this.filters['code'] = {
//       champ: (this.tab.title === 'Conditionnements') ? 'externalId' : 'code',
//       conditions: [
//         {
//           "condition": "CONTAINS",
//           "valeur": code
//         }
//       ]
//     };

//     this.pageIndex = 0;
//     // this.pageSize = 10;
//     this.paginator.pageIndex = this.pageIndex;
//     // this.paginator.pageSize = this.pageSize;
// console.log(this.filters,)
//     this.populateTableByfiltersAndSorts(this.filters, this.sorts);
//   }

  supprime(view: ViewDto, entitname: string) {
    this.tab.entite = entitname;
    this.tab.totalElements = this.totalElements;

    this.tab.view = view;
    this.tab.dialogName = 'supprime';
    this.tab.msg = `Voulez-vous vraiment supprimer cette visualisation?`;
    let dialogRef = this.dialog.open(DiaologHostComponent, {
      panelClass: 'filtre-dialog-component',
      data: {
        title: 'Confirmation de la suppression',
        tab: this.tab,
      },
    });
  }
  importerfichier() {
    this.tab.dialogName = 'import-fichier';
    this.tab.locales = this.getLocales();

    let dialogRef = this.dialog.open(DiaologHostComponent, {
      panelClass: 'filtre-dialog-component',
      data: {
        title: "Importer à partir d'un fichier CSV, XLS, XLXS",
        msg: ``,
        tab: this.tab,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.rafraichir();
    });
  }
  exporterfichier() {
    this.tab.dialogName = 'export-fichier';
    this.tab.view = this.defaultView;
    this.tab.filresappliques = this.filters;
    this.tab.ids = this.selection.selected.map((s) => s.id);
    this.tab.locales = this.getLocales();
    let dialogRef = this.dialog.open(DiaologHostComponent, {
      panelClass: 'filtre-dialog-component',
      data: {
        title: "Exporter à partir d'un fichier CSV, XLS, XLXS",
        msg: ``,
        tab: this.tab,
      },
    });
  }

  suppressiondemasse() {
    this.tab.totalElements = this.totalElements;
    this.deleteReq.idList = this.selection.selected.map((cont) => {
      return cont.id;
    });
    //this.tab.dialogName = 'scheduler';
    this.tab.dialogName = 'supprime';
    this.tab.deleteReq = this.deleteReq;

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
      if (result) {
        this.datasource.data = this.datasource.data.filter((x) => {
          return !this.selection.selected.includes(x);
        });

        this.initData = this.datasource.data;
        this.initFiltres();
      }
    });
  }

  planifierUneTache() {
    this.tab.totalElements = this.totalElements;
    this.deleteReq.idList = this.selection.selected.map((cont) => {
      return cont.id;
    });
    this.tab.dialogName = 'scheduler';

    this.tab.deleteReq = this.deleteReq;

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
      if (result) {
        this.datasource.data = this.datasource.data.filter((x) => {
          return !this.selection.selected.includes(x);
        });

        this.initData = this.datasource.data;
        this.initFiltres();
      }
    });
  }
  supprimView(view: ViewDto) {
    if (view.isfavori) {
      this.tab.deleteReq = {
        idList: [view.id],
        isfavori: true,
        ownerid: localStorage.getItem('userid'),
        view: view,
      };
    } else {
      this.tab.deleteReq = {
        idList: [view.id],
        isfavori: false,
        ownerid: localStorage.getItem('userid'),
        view: view,
      };
    }

    let enttemp = this.tab.entite;
    this.tab.entite = 'view';
    this.tab.dialogName = 'supprime';
    this.tab.msg = `Voulez-vous vraiment supprimer cette visualisation?`;
    let dialogRef = this.dialog.open(DiaologHostComponent, {
      panelClass: 'filtre-dialog-component',
      data: {
        title: 'Confirmation de la suppression',
        tab: this.tab,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.tab.entite = enttemp;
      this.loadDefaultView();
    });
  }

  updatetableListItem(searchprop: any, newValue: any) {
    const users = this.datasource.data; // Get current data
    const index = users.findIndex((item) => item.id === searchprop);

    if (index >= 0) {
      users[index] = newValue; // Replace user with new data
      this.datasource.data = [...users]; // Set new data to the dataSource
    }
  }

  ngOnDestroy() {
    this.rxStompService.deactivate();
    // this.subscriptions.forEach((element) => {
    //   element.unsubscribe();
    // });
    // this.deleteSubscription.unsubscribe();
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
    return `${this.selection.isSelected(element) ? 'deselect' : 'select'
      } element ${element.id + 1}`;
  }

  removeTab(index: number) {
    this.tables.splice(index, 1);
  }

  removeTabList(index: number) {
    this.tabList.splice(index, 1);
  }

  creerVisualisation() {
    this.tab.dialogName = 'visualisation';
    this.tab.view = new ViewDto();
    this.tab.entite = this.entiteName;

    let dialogRef = this.dialog.open(DiaologHostComponent, {
      panelClass: 'filtre-dialog-component',
      data: {
        title: "Création d'une visualisation",
        msg: ``,
        tab: this.tab,
      },
    });

    dialogRef.afterClosed().subscribe((newView) => {
      if (newView) this.views.push(newView);
      this.selectView(newView);
    });
  }
  selectView(view: ViewDto) {
    let el = this.views.find((el) => el.id === view.id);
    if (el) {
      this.views.map((elx) => (elx.isselected = false));
      el.isselected = true;
    }
    this.defaultView = view;

    this.defaultVisualisation = view !== undefined ? view.nom : '';
    this.filters = view?.filter;

    this.tab.filresappliques = view.filter;

    //clear existing filters

    this.updatetable(view);
  }

  updatetable(view: ViewDto) {
    this.populateListeChamps(view);
    this.populateTableByfiltersAndSorts(view?.filter, this.sorts);
  }

  retrieveLabel(column: string): string {
    const champKey = this.retrieveChampKey(column);
    if (champKey !== null) {
      const labels = this.defaultView.labels;
      if (labels !== undefined && labels !== null && (<any>labels)[champKey]) {
        if (
          column?.toLocaleLowerCase() == 'code' &&
          this.tab?.title?.toLocaleLowerCase() == 'articles'
        ) {
          (<any>labels)[champKey] = 'code article';
        }
        return (<any>labels)[champKey];
      }
    }

    return column;
  }

  retrieveChampKey(champ: string): number | null {
    if (
      this.defaultView === undefined ||
      this.defaultView.champs === undefined ||
      this.defaultView.champs === null
    ) {
      return null;
    }
    for (let i = 0; i < Object.keys(this.defaultView.champs).length; i++) {
      if ((<any>this.defaultView.champs)[i] === champ) {
        return i;
      }
    }
    return null;
  }

  editVisualisation(id: string) {
    this.tab.entite = this.entiteName;
    this.tab.listedechamps = this.listedechamps;
    this.tab.filterTypes = this.filterTypes;
    let editView = this.views.find((x) => x.id === id);
    if (editView !== undefined) {
      this.tab.view = editView;
    }

    this.tab.dialogName = 'visualisation';
    this.tab.listedechamps = this.listedechamps.filter((x) => x !== 'select');
    let dialogRef = this.dialog.open(DiaologHostComponent, {
      panelClass: 'filtre-dialog-component',
      data: {
        title: 'Modifier la visualisation',
        msg: ``,
        tab: this.tab,
      },
    });
  }

  visualiser() {
    if (
      this.userService.userHasRight(
        'Lecture/Affichage dans le menu',
        this.tab.droitTitle
      )
    ) {
      this.selection.selected.filter((value) => {
        this.ouvrirOnglet(value);
      });
      this.selection = new SelectionModel<any>(true, []);
    }
  }

  ouvrirOnglet(value: any) {
    if (
      !this.userService.userHasRight(
        'Lecture/Affichage dans le menu',
        this.tab.droitTitle
      )
    ) {
      this.tab.dialogName = 'popup';
      this.tab.msg = `Vous n'avez pas le droit de lecture sur ce fichier!`;
      let dialogRef = this.dialog.open(DiaologHostComponent, {
        panelClass: 'filtre-dialog-component',
        data: {
          title: 'Attention !',
          msg: this.tab.msg,
          tab: this.tab,
        },
      });
      return;
    }
    this.tab.totalElements = this.totalElements;

    const locales: string[] = this.getLocales();

    switch (this.tab.entite) {
      case 'catalog':
        this.dash.visualisation(
          value.title,
          this.tab.entite,
          value.id,
          this.tab.typeName,
          this.tab.totalElements,
          this.tab.droitTitle
        );
        break;
      case 'personnephysique':
        this.dash.visualisation(
          value.nom,
          this.tab.entite,
          value.id,
          this.tab.typeName,
          this.tab.totalElements,
          this.tab.droitTitle
        );
        break;
      case 'categorie':
        var titre = value.code;
        if (value.titre === undefined && value.titre === '') {
          titre = value.code;
        }
        this.dash.visualisation(
          titre,
          this.tab.entite,
          value.id,
          '',
          this.tab.totalElements,
          this.tab.droitTitle
        );
        break;
      case 'produit':
        titre = '';
        if (value.reference) {
          titre = value.code;
        } else if (value.code) {
          titre = value.code;
        } else if (value.titre) {
          titre = value.titre;
        }
        this.dash.visualisation(
          titre,
          this.tab.entite,
          value.id,
          value.typeName,
          this.tab.totalElements,
          this.tab.droitTitle
        );
        break;

        case 'produitarchive':
          titre = '';
          if (value.reference) {
            titre = value.code;
          } else if (value.code) {
            titre = value.code;
          } else if (value.titre) {
            titre = value.titre;
          }
          this.dash.visualisation(
            titre,
            this.tab.entite,
            value.id,
            value.typeName,
            this.tab.totalElements,
            this.tab.droitTitle
          );
          break;
      case 'personnemorale':
        this.dash.visualisation(
          value.nom,
          this.tab.entite,
          value.id,
          '',
          this.tab.totalElements,
          this.tab.droitTitle
        );
        break;
      case 'user':
        this.dash.visualisation(
          value.lastname,
          this.tab.entite,
          value.id,
          '',
          this.tab.totalElements,
          this.tab.droitTitle
        );
        break;
      case 'role':
        this.dash.visualisation(
          value.name,
          this.tab.entite,
          value.id,
          '',
          this.tab.totalElements,
          this.tab.droitTitle
        );
        break;
      case 'actualite':
        this.dash.visualisation(
          value.titre,
          this.tab.entite,
          value.id,
          '',
          this.tab.totalElements,
          this.tab.droitTitle
        );
        break;
      case 'parametre':
        this.dash.visualisation(
          value.valeur,
          this.tab.entite,
          value.id,
          '',
          this.tab.totalElements,
          this.tab.droitTitle
        );
        break;
      case 'variablelogistique':
        let conditionnemet: any;
        this.datasource.data.map((item) => {
          if (item.id === value.id) {
            conditionnemet = item;
          }
        });
        let description;
        if (conditionnemet?.mapDescriptionVl) {
          for (let item of Object.entries(conditionnemet?.mapDescriptionVl)) {
            if (item[0] === 'fr_FR') {
              description = item[1];
            }
          }
        }
        
        this.dash.visualisation(
          description,
          this.tab.entite,
          value.id,
          '',
          this.tab.totalElements,
          this.tab.droitTitle
        );
        break;
        case 'variablelogistiquearchive':
          
          let conditionnemetarchive: any;
          this.datasource.data.map((item) => {
            if (item.id === value.id) {
              conditionnemetarchive = item;
            }
          });
          let descriptionarchive;
          if (conditionnemetarchive?.mapDescriptionVl) {
            for (let item of Object.entries(conditionnemetarchive?.mapDescriptionVl)) {
              if (item[0] === 'fr_FR') {
                descriptionarchive = item[1];
              }
            }
          }

        this.dash.visualisation(
          descriptionarchive,
          this.tab.entite,
          value.id,
          '',
          this.tab.totalElements,
          this.tab.droitTitle
        );
        break;
      case 'pictocatalogue':
        this.dash.visualisation(
          value.famille,
          this.tab.entite,
          value.id,
          '',
          this.tab.totalElements,
          this.tab.droitTitle
        );
        break;
      case 'picto':
        this.dash.visualisation(
          value.label !== undefined && value.label != null
            ? value.label[locales[0]]
            : value.id,
          this.tab.entite,
          value.id,
          '',
          this.tab.totalElements,
          this.tab.droitTitle
        );
        break;
      case 'profile':
        this.dash.visualisation(
          value.titre,
          this.tab.entite,
          value.id,
          '',
          this.tab.totalElements,
          this.tab.droitTitle
        );
        break;
      case 'page':
        this.dash.visualisation(
          value.url,
          this.tab.entite,
          value.id,
          '',
          this.tab.totalElements,
          this.tab.droitTitle
        );
        break;
      case 'adaptationplaque':
        this.dash.visualisation(
          value?.produit + '-' + value?.plaque,
          this.tab.entite,
          value.id,
          '',
          this.tab.totalElements,
          this.tab.droitTitle
        );
        break;
      default:
        break;
    }
  }

  async ajouterUnEntite(entite: any, template: Template | null): Promise<void> {
    this.isOpenAddElement = false;

    const tab = new Tables();
    tab.type = this.type.get(this.tab.title);
    tab.title = 'Création ' + this.tab.title;
    tab.entite = entite;
    tab.id = this.tab.id;
    tab.value = 'edition';
    tab.droitTitle = this.tab.droitTitle;
    tab.typeName = this.tab.typeName;

    let firstElement;
    if (this.datasource.data[0] === undefined) {
      const data: any = await this.httpClient
        .post<any[]>(`/view/filtres-and-sorts/${this.tab.entite}/0/1/fr_FR`, {
          filters: [],
          sorts: {},
        })
        .toPromise();
      firstElement = data.response[0];
    } else {
      firstElement = this.datasource.data[0];
    }

    if (template === null) {
      const url: string = `template/${this.tab.entite.toLowerCase() + 'dto'}`;
      const templates: any = await this.httpClient.get(url).toPromise();
      if (templates !== null) {
        tab.template = this.findGoodTemplate(templates, firstElement);
      }
    } else {
      tab.template = template;
    }

    this.dash.ajouterUnEntite(tab);
  }

  private findGoodTemplate(templates: any, firstElement: any) {
    for (const index in templates) {
      const template = templates[index];

      const layout = template.layout;
      if (
        layout === undefined ||
        layout === null ||
        layout.hasCondition === false ||
        layout.keyCondition === null
      ) {
        continue;
      }

      const v = firstElement[layout.keyCondition];
      if (v === undefined || v === null) {
        continue;
      }

      if (typeof v === 'boolean') {
        if (
          v === true &&
          (layout.valueCondition === true ||
            layout.valueCondition === 'true' ||
            layout.valueCondition === 1 ||
            layout.valueCondition === '1')
        ) {
          return template;
        } else if (
          v === false &&
          (layout.valueCondition === false ||
            layout.valueCondition === 'false' ||
            layout.valueCondition === 0 ||
            layout.valueCondition === '0')
        ) {
          return template;
        }
      }

      if (typeof v === 'object' && v.valeur !== undefined) {
        if (
          v.valeur === layout.valueCondition ||
          v.valeur.toString() == layout.valueCondition.toString()
        ) {
          return template;
        }
      }

      if (
        v === layout.valueCondition ||
        v.toString() == layout.valueCondition.toString()
      ) {
        return template;
      }
    }

    return templates[0];
  }

  ouvrirPlusieursentites() {
    this.selection.selected.map((personne) => this.tables.push(personne));
    for (let i = 0; i < this.tables.length; i++) { }
  }

  processUserAction(useraction: MenuActions) {
    switch (useraction) {
      case MenuActions.REFRESH:
        this.rafraichir();
        break;
      case MenuActions.ADD:
        this.ajouterUnEntite(this.tab.entite, null);
        break;
      case MenuActions.VIEW:
        this.ouvrirPlusieursentites();
        break;
    }
  }

  refreshDataSource() {
    return this.datasource;
  }

  filtrer($event: Event, champ: string) {
 
    $event.preventDefault();
    $event.stopPropagation();

    this.tab.entite = this.entiteName;
    this.tab.dialogName = 'filter-champ';
    this.tab.champ = champ;
    this.tab.locales = this.getLocales();

    try {
      this.tab.champType = this.filterTypes[champ];
    } catch (e) {
      this.tab.champType = 'UNKNOWN';
    }

    if (this.tab.champType === undefined) {
      this.tab.champType = 'UNKNOWN';
    }

    this.tab.filter =
      Object.keys(this.filters).length > 0 && this.filters[champ] !== undefined
        ? this.filters[champ]
        : null;

    //pour afficher le label de la colonne sur la pop-up
    const label = this.retrieveLabel(this.tab.champ);
    let dialogRef = this.dialog.open(DiaologHostComponent, {
      panelClass: 'filtre-dialog-component',
      data: {
        title: `Recherche sur le champ : ${label.toUpperCase()}`,
        msg: ``,
        tab: this.tab,
      },
    });
    dialogRef.afterClosed().subscribe((filter: any) => {
      if (filter !== undefined && filter !== null) {
        this.filters[filter.champ] = filter;

        if (
          this.tab.entite !== 'personnemorale' &&
          this.tab.typeName !== undefined &&
          this.tab.typeName !== null
        ) {
          this.filters['type'] = {
            champ: 'type',
            conditions: [
              {
                id: 0,
                type: 'TEXT',
                condition: 'EQUALS',
                valeur: this.tab.typeName,
              },
            ],
            defaultValue: false,
          };
        }

        this.pageIndex = 0;
        // this.pageSize = 10;
        this.paginator.pageIndex = this.pageIndex;
        // this.paginator.pageSize = this.pageSize;
        

        this.populateTableByfiltersAndSorts(this.filters, this.sorts);
      } else if (filter === null) {
        delete this.filters[champ];

        this.pageIndex = 0;
        // this.pageSize = 10;
        this.paginator.pageIndex = this.pageIndex;
        // this.paginator.pageSize = this.pageSize;

        this.populateTableByfiltersAndSorts(this.filters, this.sorts);
      }
    });
  }

  populateTableByfiltersAndSorts(filters: any, sorts: any) {
    if (Object.keys(sorts).length == 0) {
      let firstChamp = this.listedechamps?.[1];
      sorts[firstChamp] = this.sortdirection;
    }
    if (
      this.tab.entite === 'produit' &&
      (this.tab.filresappliques === undefined ||
        this.tab.filresappliques === null ||
        Object.values(this.tab.filresappliques).length === 0)
    ) {
      try {
        const filresappliques = this.userService.roles
          .map((role) => role.backofficeRestrictions)
          .flatMap((backofficeRestriction) => backofficeRestriction.menu)
          .flatMap((menu) => menu.children)
          .filter((child) => child !== null)
          .filter(
            (child) =>
              child.text ===
              (this.tab.droitTitle === 'Accueil'
                ? 'Produits'
                : this.tab.droitTitle)
          )
          .map((child) => child.filresappliques)[0];

        this.tab.filresappliques = filresappliques;
      } catch (e) { }
    } else if (
      (this.tab.entite === 'produit' || this.tab.entite === 'categorie') &&
      (this.tab.filresappliques === undefined ||
        this.tab.filresappliques === null ||
        Object.values(this.tab.filresappliques).length === 0)
    ) {
      try {
        const filresappliques = this.userService.roles
          .map((role) => role.backofficeRestrictions)
          .flatMap((backofficeRestriction) => backofficeRestriction.menu)
          .flatMap((menu) => menu.children)
          .filter((child) => child !== null)
          .filter((child) => child.text === this.tab.droitTitle)
          .map((child) => child.filresappliques)[0];

        this.tab.filresappliques = filresappliques;
      } catch (e) { }
    }

    if (
      this.tab.filresappliques !== undefined &&
      this.tab.filresappliques !== null
    ) {
      this.filters = this.tab.filresappliques;
    } else if (filters && Object.keys(filters).length === 0) {
      this.filters = [];
    }

    if (filters === undefined || filters === null) {
      filters = [];
    } else if (Array.isArray(filters)) {
      for (let filter of filters) {
        if (this.filters) {
          this.filters[filter.champ] = filter;
        }
      }
    }

    if (this.filters === undefined || this.filters === null) {
      this.filters = [];
    }
    if ((this.tab.entite === 'produit' && this.tab.title === 'Produits') || (this.tab.entite === 'produitarchive' && this.tab.title === 'Produits Archivés')) {
      this.filters['estProduit'] = {
        champ: 'estProduit',
        conditions: [
          {
            "condition": "EQUALS",
            "valeur": true
          }
        ]
      };
    } else if ((this.tab.entite === 'produit' && this.tab.title === 'Articles') || (this.tab.entite === 'produitarchive' && this.tab.title === 'Articles Archivés')) {
      this.filters['estArticle'] = {
        champ: 'estArticle',
        conditions: [
          {
            "condition": "EQUALS",
            "valeur": true
          }
        ]
      };
    }

    const locales: string[] = this.getLocales();

    if (this.tab.entite === 'categorie' && !this.hasTreeFlat) {
      this.hasTreeFlat = true;
      this.switchOn = 'tree';
    }

    if (this.switchOn === 'tree') {
      let depth: number = 1;

      if (
        this.filters['depth'] !== undefined &&
        this.filters['depth'] !== null
      ) {
        depth = this.filters['depth']['conditions'][0]['valeur'];
      }
      this.httpClient
        .post<any[]>(
          `/view/tree/${this.tab.entite}/${depth}/${this.pageIndex}/${this.pageSize}/${locales}`,
          { filters: Object.values(this.filters), sorts: sorts }
        )
        .subscribe((data: any) => {
          this.totalElements = data.totalItems;
          this.columnDefs = data.columndefs;

          const treeFlatData: { id: string; name: any; subChildren: any }[] =
            [];

          for (const parent of data.response) {
            const subChildren: any[] = [];

            if (parent.children) {
              for (const child of parent.children) {
                if (typeof child === 'string') {
                  continue;
                }

                const subChild: any = {
                  id: child.id,
                  name: child,
                  subChildren: this.retrieveChildren(child),
                };

                subChildren.push(subChild);
              }
            }

            treeFlatData.push({
              id: parent.id,
              name: parent,
              subChildren: subChildren,
            });
          }

          this.treeFlatDataSource.data = treeFlatData;
        });
    } else {

      
      this.httpClient
        .post<any[]>(
          `/view/filtres-and-sorts/${this.tab.entite}/${this.pageIndex}/${this.pageSize}/${locales}`,
          { filters: Object.values(this.filters), sorts: sorts }
        )
        .subscribe((data: any) => {
          this.datasource.data = data.response;
          this.totalElements = data.totalItems;
          this.columnDefs = data.columndefs;

          this.myTableService.setDataSource(this.tab.entite, this.datasource);

          this.sort.sortChange.subscribe(() => {
            this.loadSortedData(this.sort.active, this.sort.direction);
          });
          this.datasource.sort = this.sort;
        });
    }
  }

  private retrieveChildren(parent: any): any[] | null {
    if (parent.children) {
      const subChildren: any[] = [];

      for (const child of parent.children) {
        if (typeof child === 'string') {
          continue;
        }

        const subChild: any = {
          id: child.id,
          name: child,
          subChildren: this.retrieveChildren(child),
        };

        subChildren.push(subChild);
      }

      return subChildren;
    }

    return [];
  }

  public retrieveTreeName(element: any): string {
    let name = '';

    // if (element.code !== undefined && element.code !== null) {
    //   name = element.code;
    // }

    if (
      element.maplocaletitre !== undefined &&
      element.maplocaletitre !== null &&
      Object.keys(element.maplocaletitre).length > 0
    ) {
      const titre = element.maplocaletitre[this.getLocales()[0]];
      if (titre !== undefined && titre !== null && titre !== '') {
        if (name !== '') {
          name += ' - ';
        }
        name += titre;
      }
    }

    if (name === '') {
      name = element.id;
    }

    return name;
  }

  filtreActive(champ: string): boolean {
    if (this.filters === undefined || this.filters === null) {
      return false;
    }
    return this.filters[champ] !== undefined && this.filters[champ] !== null;
  }

  viderfiltres() {
    Object.keys(this.filters).forEach((key) => {
      if (!this.filters[key]?.defaultValue) {
        delete this.filters[key];
      }
    });
    this.tab.filresappliques = this.filters;

    this.datasource.data = this.initData;

    this.pageIndex = 0;
    this.pageSize = 25;
    this.paginator.pageIndex = this.pageIndex;
    this.paginator.pageSize = this.pageSize;

    this.selectView(this.defaultView);
  }

  hasFiltres() {
    if (this.filters === undefined || this.filters === null) {
      return false;
    }

    return (
      Object.keys(
        Object.values(this.filters).filter((f) => {
          return f !== null && f.defaultValue !== undefined && !f.defaultValue;
        })
      ).length > 0
    );
  }

  isDefaultFilter(column: string): boolean {
    if (this.filters === undefined || this.filters === null) {
      return false;
    }

    const filter = this.filters[column];
    if (filter !== undefined && filter !== null) {
      return filter?.defaultValue !== undefined && filter?.defaultValue;
    }

    return false;
  }

  getSelectedLanguageKey(): string | null {
    const selectedLanguage = this.languages.find((l) => l.selected);
    return selectedLanguage ? selectedLanguage.key : null;
  }

  onChangeLanguageByKey(key: string) {
    this.languages.forEach((l) => (l.selected = false));
    const language = this.languages.find((l) => l.key === key);
    if (language !== undefined) {
      language.selected = true;
      this.onChangeLanguage(language);
    }
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
  }

  private updateLanguagesFilter() { }

  isVisible(locale: string): boolean {
    return (
      this.languages.find((l) => l.key === locale && l.selected) !== undefined
    );
  }

  initFiltres() {
    this.httpClient
      .get<any[]>(`/view/filtres/type/${this.tab.entite}`)
      .subscribe((data: any) => {
        this.filterTypes = data;
        this.tab.filterTypes = this.filterTypes;
      });
  }

  nextPage(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    if (this.defaultView !== undefined && this.defaultView !== null) {
      //this.populateListeChamps();

      this.defaultView.isselected = true;

      this.selectView(this.defaultView);
    }
  }

  hasImages(element: any): boolean {
    return Object.keys(element.images).length > 0;
  }

  pictoNameToLabel(pictoName: string): string {
    return PictosUtils.toLabel(pictoName);
  }

  private getLocales(): string[] {
    return this.languages
      .filter(
        (language: Language) => language.key !== 'all' && language.selected
      )
      .map((language: Language) => language.key);
  }

  @ViewChild('addElementRef') addElementRef: ElementRef;

  @ViewChild('languagesElementRef') languagesElementRef: ElementRef;

  @HostListener('document:click', ['$event'])
  onCloseLanguages(event: any) {
    if (
      this.isOpenAddElement &&
      !this.addElementRef.nativeElement.contains(event.target)
    ) {
      this.isOpenAddElement = false;
    }

    if (
      this.isOpenLanguages &&
      !this.languagesElementRef.nativeElement.contains(event.target)
    ) {
      this.isOpenLanguages = false;
      this.updateLanguagesFilter();
    }
  }

  onOpenLanguages(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.isOpenLanguages = !this.isOpenLanguages;
  }

  onOpenAddElement(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.isOpenAddElement = !this.isOpenAddElement;
  }

  onSwitchOn() {
    if (this.switchOn === 'tree') {
      this.switchOn = 'table';
    } else {
      this.switchOn = 'tree';
    }
    this.populateTableByfiltersAndSorts(this.filters, this.sorts);
  }
}
