import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs/internal/Subscription';
import { DashboardComponent } from 'src/app/admin/core/components/dashboard/dashboard.component';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { Tables } from '../../entities/tables';
import { IMenuItem } from 'src/app/admin/core/interfaces/IMenu';
import { EntityService } from 'src/app/admin/core/services/entity.service';
import {
  BackofficeRestrictions,
  ExtranetRestrictions,
  User,
} from '../../entities/authentication/user';
import { Role } from '../../enums/user-roles';
import { IDroit } from 'src/app/admin/core/interfaces/IDroit';
import { ExtractEntityNamePipe } from '../../core/pipes/entitynamepipe';
import { Entite } from '../../entities/entite';
import { DeleteReq } from '../../entities/deleteReq';
import { DiaologHostComponent } from '../dialogs/dialog-host/dialog-host';
import { TabService } from '../../services/tab.service';
import {
  RestrictionEntite,
  RestrictionsComponent,
} from '../dialogs/restrictions/restrictions/restrictions.component';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { UserService } from 'src/app/admin/core/services/user.service';
import { E } from '@angular/cdk/keycodes';
import { name } from '@azure/msal-angular/packageMetadata';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { TreeItem } from '../menu/app-menu-item/app-menu-item.component';

import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Language } from '../../entities/language';
export class FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  selected: boolean;
  parentId: string;
  entityName: string;
  droitTitle: string;
  typeName: string;
  icon: string;
  is_custom_icon: boolean;
  filterappliques: any;
  listedechamps: any[];

  // Add the parentId propIerty

  constructor(
    expandable: boolean,
    name: string,
    level: number,
    selected: boolean,
    parentId: string,
    icon: string,
    entityName: string,
    is_custom_icon: boolean,
    droitTitle: string,
    typeName: string,
    filresappliques: string,
    listedechamps: string[]
  ) {
    this.expandable = expandable;
    this.name = name;
    this.level = level;
    this.selected = selected;
    this.parentId = parentId;
    this.entityName = entityName;
    this.droitTitle = droitTitle;
    this.typeName = typeName;
    this.icon = icon;
    this.is_custom_icon = is_custom_icon;
    this.filterappliques = filresappliques;
    this.listedechamps = listedechamps;
  }
}

@Component({
  selector: 'app-admin-user-group-parameter',
  templateUrl: './admin-user-group-parameter.component.html',
  styleUrls: ['./admin-user-group-parameter.component.css'],
})
export class AdminUserGroupParameterComponent implements OnInit, OnDestroy {
  @Input() public tab: Tables = new Tables();
  @Input() public value: any;
  datasource = new MatTableDataSource<any>();
  datasourceEntities = new MatTableDataSource<any>();

  private _transformer = (node: any, level: number) => {
    return {
      expandable: !!node?.children && node?.children.length > 0,
      name: node?.text,
      level: level,
      parentId: node?.parentId,
      icon: node?.icon,
      is_custom_icon: node?.is_custom_icon,
      entityName: node?.entityName,
      droitTitle: node?.droitTitle,
      typeName: node?.typeName,
      selected: node?.selected || false,
      filterappliques: node?.filterappliques,
      listedechamps: node?.listedechamps, // Set the selected property
    };
  };

  private _transformerdroit = (node: any, level: number) => {
    return {
      expandable: !!node?.children && node?.children.length > 0,
      name: node.text,
      level: level,
      parentId: node?.parentId,
      icon: node?.icon,
      entityName: node?.entityName,
      droitTitle: node?.droitTitle,
      typeName: node?.typeName,
      is_custom_icon: node?.is_custom_icon,
      selected: node?.selected || false,
      filterappliques: node?.filterappliques,
      listedechamps: node?.listedechamps,
    };
  };
  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node?.level,
    (node) => node?.expandable
  );
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node?.level,
    (node) => node?.expandable,
    (node) => node?.children
  );

  droittreeControl = new FlatTreeControl<FlatNode>(
    (node) => node?.level,
    (node) => node?.expandable
  );
  droittreeFlattener = new MatTreeFlattener(
    this._transformerdroit,
    (node) => node?.level,
    (node) => node?.expandable,
    (node) => node?.children
  );
  treeFlatDataSource = new MatTreeFlatDataSource(
    this.treeControl,
    this.treeFlattener
  );

  droitTreeFlatDataSource = new MatTreeFlatDataSource(
    this.droittreeControl,
    this.droittreeFlattener
  );

  hasTreeFlat: boolean = false;

  hasChild = (_: number, node: FlatNode) => node.expandable;

  selection = new SelectionModel<any>(true, []);
  public entityNamePipe: ExtractEntityNamePipe;
  entites: RestrictionEntite[] = [
    { entite: 'produit', label: 'Produit' },
    { entite: 'produitarchive', label: 'Produit Archivé' },
    {
      entite: 'personnemorale',
      label: 'Personne morale (fournisseur, associé)',
    },
    { entite: 'actualite', label: 'Actualité' },
    { entite: 'personnephysique', label: 'Personne physique (contact)' },
    { entite: 'role', label: 'Rôle & profil' },
    { entite: 'categorie', label: 'Catégorie' },
    { entite: 'pictocatalogue', label: 'Picto catalogue' },
    { entite: 'picto', label: 'Pictos' },
    { entite: 'variablelogistique', label: 'Conditionnements' },
    { entite: 'variablelogistiqueArchive', label: 'Conditionnements Archivé' },
    { entite: 'parametre', label: 'Parametre' },
    { entite: 'adaptationplaque', label: 'Adaptation pots/plaques' },
    { entite: 'catalog', label: 'Catalogue' },
  ];
  selectedEntity = this.entites[0];

  champs: any = [];

  utilisateur: string;
  @Input() public usertab: Tables = new Tables();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  listedechamps: any[] = [
    'select',
    'nom',
    'firstname',
    'lastname',
    'email',
    'prenom',
  ];
  entities: Entite[] = [];
  roleDefault: Role = new Role();
  temprole: Role = new Role();
  pageIndex: number = 0;
  pageSize: number = 25;
  totalElements: number = 0;
  selectedMenu: any;
  nomsDeChamps: string[] = [
    'Table',
    'Lecture',
    'Modification',
    'Création',
    'Suppression',
    'Archivage',
  ];
  status: string[] = ['Actif', 'Inactif'];
  clickSelection = new Set<any>();
  title: string;
  creer: boolean = false;
  info: boolean = false;
  tabList: string[] = [];
  tabs: string[] = [];
  deleteReq = new DeleteReq();

  selected = new FormControl();
  edition: boolean = false;
  lecture: boolean = true;
  subscriptions: Subscription[] = [];

  menu: IMenuItem[] = [];

  droit: IDroit[] = [];
  role: Role = new Role();
  user: User;
  users: User[] = [];
  motCle: string;
  roleusers: User[] = [];
  extranetRestrictions: ExtranetRestrictions = new ExtranetRestrictions();
  backofficeRestrictions: BackofficeRestrictions = new BackofficeRestrictions();
  languages: Language[] = [];
  constructor(
    private httpClientService: HttpclientService,
    private dash: DashboardComponent,
    private dialog: MatDialog,
    private myTableService: TabService,
    public userService: UserService,
    private entiteService: EntityService
  ) {}

  ngOnInit(): void {
    this.tab.droitTitle = 'Rôles et profils';
    this.init();
    if (this.tab.value === 'edition') {
      this.modeEdition();
    } else if (this.tab.value === 'lecture') {
      this.tab.listedechamps = this.listedechamps;

      this.edition = false;
      this.lecture = true;
    }
  }

  init() {
    this.loadUsers();
    this.loadEntite();

    let subs = this.httpClientService
      .getObjet(this.tab.entite, this.tab.id)
      .subscribe((res) => {
        this.role = res;
        if (this.role.extranetRestrictions)
          this.extranetRestrictions = this.role.extranetRestrictions;
        if (this.role.backofficeRestrictions)
          this.backofficeRestrictions = this.role.backofficeRestrictions;
        if (this.role?.backofficeRestrictions?.droits) {
          this.droit = this.role?.backofficeRestrictions?.droits;
          this.droitTreeFlatDataSource.data = this.droit;
        } else {
          this.loadDroits();
        }

        this.datasourceEntities.data = this.role.entities;
        if (this.role?.backofficeRestrictions?.menu.length > 0) {
          this.menu = this.role?.backofficeRestrictions?.menu;
          this.treeFlatDataSource.data = this.menu;
        } else {
          this.loadMenu();
        }
        if (!this.role.backofficeRestrictions) {
          this.role.backofficeRestrictions = new BackofficeRestrictions();
          this.role.backofficeRestrictions.champs = [];
        }
      });

    this.subscriptions.push(subs);
  }
  loadDroits() {
    this.httpClientService
      .get(`assets/mock-apis/droits-${environment.client}.json`)
      .pipe(
        map((res) => {
          this.droit = res;
          this.droitTreeFlatDataSource.data = res;

          //console.log(this.droitTreeFlatDataSource.data);
        })
      )
      .subscribe();
  }

  changeSelection() {}
  changeMenuSelection() {}
  changeSelections(event: Event) {}
  ouvrirOnglet(value: any) {
    const tab = new Tables();
    tab.title = 'utilisateur';
    tab.entite = 'user';
    tab.title = 'utilisateur';
    tab.value = 'lecture';
    tab.id = value.id;
    this.dash.ajouterUnEntite(tab);
  }
  selectAllDroits() {}

  pickDroitItem(index: number, event: any) {
    if (this.droit[index]?.children) {
      this.droit[index].children.map((el) => {
        el.selected = event?.target?.checked;
      });
    }
  }
  enregistrer() {
    let roleUrl = '/role/add';
    this.role.extranetRestrictions = this.extranetRestrictions;
    this.role.backofficeRestrictions = this.backofficeRestrictions;
    this.role.backofficeRestrictions.droits = this.droit;
    this.role.backofficeRestrictions.menu = this.menu;
    this.role.entities = this.datasourceEntities.data;

    this.selection.selected.map((user) => this.role.users.push(user));

    this.role.nom = this.role.name.trim();
    this.httpClientService.post(this.role, roleUrl).subscribe((data) => {
      this.role = data;

      this.role.nom = this.role.name;
      this.dash.changeNameOrTitleAfterSave(
        this.tab,
        this.myTableService.getTabTitle(data, this.languages, this.tab.entite)
      );
      this.myTableService.updateOrAddItem(this.role, this.tab.entite);
    });

    this.lecture = true;
    this.edition = false;
    this.tab.value = 'lecture';
    this.tab.dialogName = 'popup';
    this.tab.deleteReq = this.deleteReq;
    if (this.role.id === undefined) {
      this.tab.msg = `Un nouveau group d'utilisateur a été créé avec le nom :  ${this.role.name}`;
      return false;
    } else {
      this.tab.msg = 'Vos modifications ont été enregistrées avec succès';
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
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.datasource.data.length;
    return numSelected === numRows;
  }
  checkboxLabel(element?: any): string {
    if (!element) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(element) ? 'deselect' : 'select'} row ${
      element.id + 1
    }`;
  }

  loadUsers() {
    let userUrl = `user/${this.pageIndex}/${this.pageSize}`;
    this.httpClientService.get(userUrl).subscribe((data) => {
      this.users = data.users;
      this.users.forEach((x) => {
        x.nom = x.lastname;
        x.prénom = x.firstname;
        x.password = '';
      });
      this.datasource.data = this.users;
      this.roleusers = this.users;
      this.roleusers = this.roleusers.filter((x) =>
        this.role?.users?.includes(x.id)
      );
    });
  }

  selectAll(colonne: string) {
    if (colonne.includes('droit')) {
      if (colonne.includes('menu')) {
        // menu
        let full: boolean =
          this.menu.length ===
          this.menu.filter((el) => el.selected == true).length;
        this.menu.map((el) => {
          el.selected = !full;
          if (el.subItems || el.children) {
            let arr = el.subItems ? el.subItems : el.children;
            arr.map((ell) => (ell.selected = !full));
          }
        });
      } else {
        // fonctions
        // let full: boolean =
        //   this.droit.length ===
        //   //this.droit.filter((el) => el.selected == true).length;
        //   this.droit.map((el) => (el.selected = !full));
        // this.droit.map((el) => (el.selected = !full));
      }
    } else {
      let full: boolean =
        this.datasourceEntities.data.length ===
        this.datasourceEntities.data.filter((el) => el[colonne] == true).length;
      this.datasourceEntities.data.map((el) => (el[colonne] = !full));
    }
  }

  pickMenuItem(index: number, event: any) {
    if (this.menu[index]?.children) {
      this.menu[index].children.map((el) => {
        el.selected = event?.target?.checked;
      });
    }
  }

  pickSubMenuItem(index: number, event: any, name: string) {
    this.selectedMenu = name;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.datasource.data);
  }
  rafraichir() {
    this.temprole = this.role;
    this.role = this.roleDefault;
  }
  annuler() {
    this.lecture = true;
    this.edition = false;
    this.role = this.temprole;
  }

  filtreMotCles(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  loadMenu() {
    this.httpClientService
      .get(`assets/mock-apis/menu-${environment.client}.json`)
      .pipe(
        map((res) => {
          this.menu = res;
          this.treeFlatDataSource.data = res;
        })
      )
      .subscribe();
  }

  // loadDroits() {
  //   let urldroits = 'droit/allDroits';
  //   this.httpClientService.post({}, urldroits).subscribe((datadroits) => {
  //     this.droit = datadroits;
  //   });
  // }
  modeEdition() {
    this.temprole = this.role;
    this.edition = true;
    this.lecture = false;

    // if (this.role.entities === null) {
    //   this.loadEntities();
    // }
    // let userUrl = `user/${this.pageIndex}/${this.pageSize}`;
    // this.httpClientService.get(userUrl).subscribe((data) => {
    //
    // data.forEach((x) => {
    //   x.nom = x.lastname;
    //   x.prénom = x.firstname;
    // });
    // this.datasource.data = data.users;
    // alert(JSON.stringify(data));
    // });
    this.loadUsers();
    if (
      this.role?.backofficeRestrictions?.menu === null ||
      this.role?.backofficeRestrictions === undefined ||
      this.role?.backofficeRestrictions?.menu?.length === 0
    ) {
      this.loadMenu();
    }
    if (
      this.role?.backofficeRestrictions?.droits === null ||
      this.role?.backofficeRestrictions?.droits === undefined ||
      this.role?.backofficeRestrictions?.droits?.length === 0
    ) {
      this.loadDroits();
    }
  }

  setExtranetRestrictions(
    propriete: 'menu' | 'champs' | 'fonctions',
    event: any
  ) {
    let reg = new RegExp(' - |,', 'g');
    this.extranetRestrictions[propriete] = event.target.value
      .split(reg)
      .map((el: any) => el.trim());
  }

  openRestrictions() {
    let dialogRef = this.dialog.open(RestrictionsComponent, {
      data: { restrict: this.extranetRestrictions, user: this.role },
    });

    dialogRef.updateSize('80vw', '100vh');
    dialogRef.afterClosed().subscribe((res) => {
      if (res == 'save') this.enregistrer();
    });
  }

  openRestrictionsBackoffice() {
    let dialogRef = this.dialog.open(RestrictionsComponent, {
      data: {
        restrict: this.backofficeRestrictions,
        user: this.role,
        back: true,
      },
    });

    dialogRef.updateSize('80vw', '100vh');
    dialogRef.afterClosed().subscribe((res) => {
      if (res == 'save') this.enregistrer();
    });
  }
  setBackofficeRestrictions(
    propriete: 'menu' | 'champs' | 'fonctions',
    event: any
  ) {
    let reg = new RegExp(' - |,', 'g');
    this.backofficeRestrictions[propriete] = event.target.value
      .split(reg)
      .map((el: any) => el.trim());
  }

  openBackofficeRestrictions() {
    let dialogRef = this.dialog.open(RestrictionsComponent, {
      data: {
        restrict: this.backofficeRestrictions,
        user: this.role,
        back: true,
      },
    });

    dialogRef.updateSize('80vw', '100vh');
    dialogRef.afterClosed().subscribe((res) => {
      if (res == 'save') this.enregistrer();
    });
  }

  supprimer() {
    let roleUrl = 'user/role/bulkDelete';
    let subs = this.httpClientService
      .post(this.role, roleUrl)
      .subscribe((data) => {});
  }
  public get roleHasUser() {
    if (this.role.users != null) {
      return !!this.role.users.length;
    }
    return false;
  }

  // public handleSelectUser(e: any, user: User) {
  //
  //   if (e.checked) {
  //     this.role.users.push(user);
  //   } else {
  //     const index = this.role.users.findIndex((_user) => _user.id === user.id);

  //     if (index !== -1) this.role.users.splice(index, 1);
  //   }
  // }

  public handleSelectUser(e: any, user: User) {
    if (e.checked) {
      if (this.role.users == null) this.role.users = [];
      if (this.role.users.indexOf(user.id) === -1)
        this.role.users.push(user.id);
    } else {
      const index = this.role.users.findIndex((userId) => userId === user.id);

      if (index !== -1) {
        this.role.users.splice(index, 1);
      }
    }
  }
  public isSelected(element: any) {
    if (this.role.users != null) {
      let index = this.role.users.findIndex((userId) => userId === element.id);

      return index !== -1 ? true : false;
    }
    return false;
  }

  suppressiondemasse() {
    this.deleteReq.idList.push(this.tab.id);

    this.totalElements = this.tab.totalElements;
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
      this.dash.openPrev(this.tab);
    });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((element) => {
      element.unsubscribe();
    });
  }
  async loadEntite() {
    if (this.selectedEntity) {
      try {
        const res = await this.entiteService.recouperChampsdEntite(
          this.selectedEntity.entite
        );
        if (res) {
          this.champs = res;
          this.entiteService.setReqMap(this.selectedEntity.entite, res);
        }
      } catch (error) {
        this.champs = [];
        throw error;
      }
    } else {
      this.champs = [];
    }
  }

  pickChampItem(entite: any) {
    this.selectedEntity = entite;
    this.loadEntite();
  }

  isIn(ref: any): boolean {
    ref = `${this.selectedEntity.entite}:${ref}`;
    return this.backofficeRestrictions?.champs?.includes(ref);
  }

  select(ref: string) {
    let reff = `${this.selectedEntity.entite}:${ref}`;

    if (this.isIn(ref)) {
      this.backofficeRestrictions.champs =
        this.backofficeRestrictions.champs.filter((el: any) => el != reff);
    } else {
      if (this.backofficeRestrictions.champs == null)
        this.backofficeRestrictions.champs = [];
      this.backofficeRestrictions.champs.push(reff);
    }
  }

  onSelectedCheckboxesChange(selectedItems: any[]): void {
    // Handle the selectedItems data as needed, for example, save it to the database
    this.menu = selectedItems;
  }

  selectedDroitChange(selectedItems: any[]): void {
    // Handle the selectedItems data as needed, for example, save it to the database
    this.droit = selectedItems;
  }
}
