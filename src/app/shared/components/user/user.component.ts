import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Tables } from '../../entities/tables';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { ExtranetRestrictions, User } from '../../entities/authentication/user';
import { Subscription } from 'rxjs';
import { Role } from '../../enums/user-roles';
import { DashboardComponent } from 'src/app/admin/core/components/dashboard/dashboard.component';
import { Tel } from '../../entities/tel';
import { Fonction } from '../../entities/fonction';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ViewDto } from '../../entities/viewdto';
import { DiaologHostComponent } from '../dialogs/dialog-host/dialog-host';
import { MatDialog } from '@angular/material/dialog';
import { DeleteReq } from '../../entities/deleteReq';
import {} from '../dynamic-component-shared/table/table.component';
import { TabService } from '../../services/tab.service';
import { HttpClient } from '@angular/common/http';
import { IDroit } from 'src/app/admin/core/interfaces/IDroit';
import { IMenuItem } from 'src/app/admin/core/interfaces/IMenu';
import { RestrictionsComponent } from '../dialogs/restrictions/restrictions/restrictions.component';
import { Personnephysique } from '../../entities/personnephysique';
import { UserService } from 'src/app/admin/core/services/user.service';
import { Language } from '../../entities/language';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  edition: boolean = false;
  myForm: FormGroup;
  lecture: boolean = true;
  datasource = new MatTableDataSource<Role>([]);
  selection = new SelectionModel<any>(true, []);
  userroles: Role[] = [];
  userdroits: IDroit[] = [];
  usermenu: IMenuItem[] = [];
  personnePhysique: Personnephysique;
  utilisateur: string;
  clickSelection = new Set<any>();
  @Input() public value: string;
  @Input() public tab: Tables = new Tables();
  subscriptions: Subscription[] = [];
  userDefault: User = new User();
  status: string[] = ['Actif', 'Inactif'];
  defaultVisualisationId: string = '';
  nomsDeChamps: string[] = [
    'select',
    // 'nom',
    'name',
    // 'prénom',
    // 'tels',
    // 'email',
    // 'statut',
  ];
  motCle: string;
  title: string;
  creer: boolean = false;
  info: boolean = false;
  tabList: string[] = [];
  tabs: string[] = [];
  user: User = new User();
  role: Role;
  fonction: Fonction;
  tempUser = new User();
  tel: Tel;
  customSelection: Role[] = [];
  listedechamps: any[] = ['select'];
  selectedroles: any[] = [];
  languages: Language[] = [];

  errorMessages = {
    lastname: false,
    firstname: false,
    email: false,
    statut: false,
    fonction: false,
    roles: false,
  };
  submitted: boolean = false;
  entiteName: string = '';
  defaultVisualisation: string = '';
  defaultView: ViewDto;
  views: ViewDto[] = [];
  deleteReq = new DeleteReq();
  selected = new FormControl();
  checked: false;
  pageIndex: number = 0;
  pageSize: number = 25;
  filters: { [key: string]: any } = {};
  filterTypes: any = null;
  initData: any = null;
  totalElements: number = 0;
  extranetRestrictions: ExtranetRestrictions = new ExtranetRestrictions();

  get noRestriction() {
    return (
      this.extranetRestrictions.menu.length +
        this.extranetRestrictions.champs.length +
        this.extranetRestrictions.fonctions.length ==
      0
    );
  }

  constructor(
    private httpClientService: HttpclientService,
    private dash: DashboardComponent,
    private dialog: MatDialog,
    private myTableService: TabService,
    private httpclientService: HttpclientService,
    private httpClient: HttpClient,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.tab.droitTitle = 'utilisateurs';
    if (this.tab.value === 'edition') {
      this.user = new User();

      this.user.tels.push(new Tel());
      this.role = new Role();
      this.fonction = new Fonction();
      this.user.fonction = this.fonction;
      this.modeEdition();
    } else if (this.tab.value == 'lecture') {
      this.edition = false;
      this.lecture = true;
      this.getAllRoles();
      let subs = this.httpClientService
        .getObjet(this.tab.entite, this.tab.id)
        .subscribe((res) => {
          this.user = res;
          if (this.user.extranetRestrictions)
            this.extranetRestrictions = this.user.extranetRestrictions;

          if (this.user.tels == null) {
            this.user.tels = [];
            this.user.tels.push(new Tel());
          }
          if (this.user.fonction == null) {
            this.user.fonction = new Fonction();
          }
          this.user.password = '';
          this.role = new Role();
          if (this.role.dernieremiseajour != null) {
            let year = this.role.dernieremiseajour.toString().substring(0, 4);
            let month = this.role.dernieremiseajour.toString().substring(4, 6);
            let day = this.role.dernieremiseajour.toString().substring(6, 8);
            this.role.dernieremiseajour = day + '/' + month + '/' + year;
          }

          if (this.user.personnePhysique && this.user.personnePhysique[0]) {
            this.getPersonnePhysique(this.user.personnePhysique[0]);
          }
        });
      this.subscriptions.push(subs);
    }
  }

  getPersonnePhysique(id: string) {
    this.httpClient
      .post<any[]>(`/view/filtrerById/personnephysique`, [id])
      .subscribe((data: any) => {
        if (data.response[0]) {
          this.personnePhysique = data.response[0];
        }
      });
  }

  // COMPUTED PROPERTIES
  public get isFonctionValid() {
    return !!this.user.fonction.valeur?.length;
  }

  public get userHasRole() {
    return !!this.user.roles?.length;
  }

  public get isFormValid() {
    let errorStatus = Object.values(this.errorMessages);

    return errorStatus.every((errStatus) => errStatus === false);
  }

  public isSelected(row: any) {
    let index = this.user.roles?.findIndex((roleid) => roleid === row.id);

    if (index !== -1) {
      return true;
    } else {
      return false;
    }
  }

  public handleSelectRole(e: any, role: Role) {
    if (e.checked) {
      if (this.user.roles.indexOf(role.id) === -1)
        this.user.roles.push(role.id);
    } else {
      const index = this.user.roles.findIndex((roleId) => roleId === role.id);

      if (index !== -1) {
        this.user.roles.splice(index, 1);
      }
    }
  }

  modeEdition() {
    this.edition = true;
    this.lecture = false;
    this.tempUser = this.user;

    //   let subs = this.httpClientService
    //     .getList<Role>(roleUrl)
    //     .subscribe((data) => {
    //       //
    //       this.datasource.data = data;
    //       alert(JSON.stringify(data));
    //     });

    //
    //
    //   return true;
    // }
    if (this.defaultView !== undefined && this.defaultView !== null) {
      this.listedechamps = ['selected', 'nom'];
      this.selectView(this.defaultView);
    } else {
      this.listedechamps = ['select', 'nom', 'description', 'statut'];
    }
    this.getAllRoles();
  }

  getAllRoles() {
    let roleUrl = `role/getroles/${this.pageIndex}/${this.pageSize}`;
    this.httpclientService.get(roleUrl).subscribe((data) => {
      this.datasource.data = data.roles;
      this.userroles = data.roles;
      this.userroles = this.userroles.filter((x) =>
        this.user.roles?.includes(x.id)
      );

      this.loadUserDroitsMenu();

      this.totalElements = data.totalItems;
      this.initData = this.datasource.data;
      this.selection.select(...this.datasource.data);
      this.initFiltres();
    });
  }

  loadUserDroitsMenu() {
    let reqDroits = this.userroles.map((el) => el.droits);
    let droits: IDroit[] = [];
    for (let i = 0; i < reqDroits[0]?.length; i++) {
      droits[i] = reqDroits[0][i];
      reqDroits?.forEach((droit) => {
        if (droit) droits[i].selected = droit[i]?.selected;
      });
    }
    this.userdroits = droits;

    let reqMenus = this.userroles.map((el) => el.menu);

    let menus: IMenuItem[] = [];
    for (let i = 0; i < reqMenus[0]?.length; i++) {
      menus[i] = reqMenus[0][i];
      reqMenus?.forEach((menu) => {
        if (menu[i].selected) menus[i].selected = menu[i].selected;
        menu[i].subItems?.forEach((subMenu: IMenuItem, j: number) => {
          if (subMenu.selected) {
            if (menus[i].subItems && menus[i].subItems[j]) {
              menus[i].subItems[j].selected = subMenu.selected;
            } else {
              menus[i].subItems = [subMenu];
              menus[i].subItems[j].selected = subMenu.selected;
            }
          }
        });
      });
    }
    this.usermenu = menus;
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
      data: { restrict: this.extranetRestrictions, user: this.user },
    });

    dialogRef.updateSize('80vw', '100vh');
    dialogRef.afterClosed().subscribe((res) => {
      if (res == 'save') this.enregistrer();
    });
  }

  selectView(view: ViewDto) {
    this.views.forEach((x) => {
      if (view.nom === x.nom) {
        x.isselected = true;
      } else {
        x.isselected = false;
      }
    });
    this.updatetable(view);
  }
  updatetable(view: ViewDto) {
    let defaultView = this.views.find((x) => x.id === view.id);
    this.defaultVisualisation =
      defaultView !== undefined ? defaultView.nom : '';

    if (defaultView !== undefined) {
      this.defaultView = defaultView;
    }

    this.defaultVisualisation =
      defaultView !== undefined ? defaultView.nom : '';
    this.defaultVisualisationId =
      defaultView !== undefined ? defaultView.id : '';

    this.listedechamps = ['select'];
    if (defaultView !== undefined && defaultView?.champs !== undefined) {
      for (const [key, value] of Object.entries(defaultView.champs)) {
        if (!this.listedechamps.some((x) => x === value)) {
          this.listedechamps.push(value);
        }
      }
    }
  }

  initFiltres() {
    this.httpClient
      .get<any[]>(`/view/filtres/type/${this.tab.entite}`)
      .subscribe((data: any) => {
        this.filterTypes = data;
        this.tab.filterTypes = this.filterTypes;
      });
  }
  ajoutTel() {
    this.user.tels.push(new Tel());
  }

  retirerTel(val: any) {
    this.user.tels.splice(val, 1);
  }

  rafraichir() {
    this.tempUser = this.user;
    this.user = this.userDefault;
  }
  add() {
    const tab = new Tables();
    this.edition = true;
    this.lecture = false;
    tab.title = "Groupe d'utilisateurs";
    tab.entite = 'role';
    tab.title = "Créer un nouveau Groupe d'utilisateurs";
    tab.value = 'edition';
    this.dash.ajouterUnEntite(tab);
  }

  annuler() {
    this.lecture = true;
    this.edition = false;
    this.user = this.tempUser;
  }

  suppressiondemasse() {
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
  enregistrer() {
    if (
      !this.user.lastname?.length ||
      !this.user.firstname?.length ||
      !this.user.email?.length ||
      this.user.statut === undefined ||
      this.user.fonction === undefined ||
      !this.user.roles?.length
    ) {
      this.errorMessages = {
        lastname: this.user.lastname.length ? false : true,

        firstname: this.user.firstname.length ? false : true,
        email: this.user.email.length ? false : true,
        statut: this.user.statut === undefined ? true : false,
        fonction: !this.isFonctionValid ? true : false,
        roles: !this.userHasRole,
      };
      return false;
    } else {
      let roleUrl = 'user/adduser';
      this.user.extranetRestrictions = this.extranetRestrictions;
      let subs = this.httpClientService
        .post(this.user, roleUrl)
        .subscribe((data) => {
          this.user = data;

          this.edition = false;
          this.lecture = true;
          this.user.nom = this.user.lastname;
          this.user.prénom = this.user.firstname;
          this.myTableService.updateOrAddItem(this.user, this.tab.entite);
          this.dash.changeNameOrTitleAfterSave(
            this.tab,
            this.myTableService.getTabTitle(
              data,
              this.languages,
              this.tab.entite
            )
          );
        });

      this.getAllRoles();
      this.tab.deleteReq = this.deleteReq;
      this.tab.value = 'lecture';

      this.tab.msg = `Un email de création de mot de passe a été envoyé à l'adresse :  ${this.user.email}`;
      this.tab.dialogName = 'popup';
      this.tab.deleteReq = this.deleteReq;
      if (this.user.id === undefined) {
        this.tab.msg = `Un email de création de mot de passe a été envoyé à l'adresse :  ${this.user.email}`;
      } else {
        this.tab.msg = 'Vos modifications ont été enregistrées avec succès';
      }
      let dialogRef = this.dialog.open(DiaologHostComponent, {
        panelClass: 'filtre-dialog-component',
        data: {
          title: 'Attention!',
          msg: this.tab.msg,
          tab: this.tab,
        },
      });
      return true;
    }
  }

  public isAllSelected() {
    // const numSelected = this.selection.selected.length;
    // const numRows = this.datasource.data.length;
    // return numSelected === numRows;
    const rolesCount = this.datasource.data?.length;
    const selectedRolesCount = this.user.roles?.length;

    return rolesCount === selectedRolesCount;
  }

  masterToggle(e: any) {
    if (this.isAllSelected()) {
      this.user.roles = [];
      return;
    }
    this.user.roles = [...this.datasource.data];
  }

  checkboxLabel(element?: Role): string {
    if (!element) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(element) ? 'deselect' : 'select'} row ${
      element.id + 1
    }`;
  }

  filtreMotCles(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  ouvrirOnglet(value: any) {
    const tab = new Tables();
    tab.title = "Groupe d'utilisateurs";
    tab.entite = 'role';
    tab.title = "Groupe d'utilisateurs";
    tab.value = 'lecture';
    tab.id = value.id;
    this.dash.ajouterUnEntite(tab);
  }

  ouvrirOngletUser(value: any) {
    const tab = new Tables();
    tab.entite = 'personnephysique';
    tab.title = `${value.nom}`;
    tab.value = `lecture`;
    tab.id = value.id;
    this.dash.ajouterUnEntite(tab);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((element) => {
      element.unsubscribe();
    });
  }
}
