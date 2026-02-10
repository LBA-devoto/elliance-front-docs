import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { LoadingIndicator as loadingIndicators } from '../../../../shared/enums/loading.indicators';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Tables } from 'src/app/shared/entities/tables';
import { Location } from '@angular/common';
import { ViewService } from '../../services/viewservice';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { HttpclientService } from '../../services/httpclientService';
import { IMenuItem } from '../../interfaces/IMenu';
import { PATHS } from 'src/app/app-routing.module';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmRemoveComponent } from './confirm-remove/confirm-remove.component';
import { environment } from 'src/environments/environment';
import { TemporaryIdService } from 'src/app/shared/services/temporary-id.service';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/shared/entities/authentication/user';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { TabService } from 'src/app/shared/services/tab.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  client: String = environment.client;
  loadingInd: loadingIndicators = loadingIndicators.OPERATOR;
  isExpanded: boolean = false;
  menuList: any = [];
  showSubmenu: boolean = false;
  tabs = new Array<Tables>();
  tab: Tables = new Tables();
  @Input() public value: string;
  isShowing = false;
  widthSideBar = 80;
  grey = 75;
  widthSideBarExpanded = 340;
  widthSideBarCollapsed = 80;
  isExpaned = false;
  subscriptionText = '';
  manualText = '';

  loadCounter = 1;

  anyList: any[];

  tabHistory: any[] = [];

  /*** tables dynamics */
  public tables: Tables[] = [];
  public tables1: Tables[] = [];
  @Input() table: Tables = new Tables();

  disable: boolean = false;

  selected = new FormControl();

  lastHovered: number = 0;

  routerSubscription?: Subscription;

  loaded = false;
  user: User;
  tabContainer: Tables[] = [];

  constructor(
    public loadingService: LoadingService,
    public location: Location,
    private temporaryIdService: TemporaryIdService,
    private httpService: HttpclientService,
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService,
    private vieWService: ViewService,
    private authService: AuthenticationService,
    private tabService: TabService // update tab container via a subscription
  ) {}

  async ngOnInit(): Promise<void> {
    this.initDashboard();
    this.loadHome();
    this.listenRouter();

    await this.loadUser(5);
    // console.log(this.authService.currentUser());
  }

  async loadUser(tries: number) {
    if (tries > 0) {
      let user: any = await this.userService.getCurrentUser();

      if (user.firstname) {
        user.password = '';
        this.user = user;
        this.loaded = true;
      } else {
        setTimeout(async () => {
          await this.loadUser(tries - 1);
        }, 400);
      }
    } else {
      this.router.navigate([PATHS.logout]);
    }
  }

  initDashboard() {
    let tabs = localStorage.getItem('tabs');
    let tabHistory = localStorage.getItem('tabHistory');

    if (tabs && tabs.split('-').length > 1) {
      this.loadEntities();
    } else {
      localStorage.setItem('tabs', 'accueil');
    }

    if (tabHistory && tabHistory.length > 1) {
      this.tabHistory = JSON.parse(tabHistory);
      this.setLastViewId();
    } else {
      let genId = this.temporaryIdService.generateId();
      let val = { id: genId, tab: 'accueil' };
      this.tabHistory.push(val);
      localStorage.setItem('tabHistory', JSON.stringify([val]));
      this.router.navigate([PATHS.admin, genId]);
    }
  }

  setLastViewId() {
    let tab = this.tabHistory
      .map((el) => el.id.split('-')[1])
      .sort((a, b) => b - a);
    this.temporaryIdService.idCounter = tab[0];
  }

  loadHome() {
    this.tab.entite = 'accueil';
    this.tab.title = 'Accueil';
    this.tab.isTable = false;
    this.openOnglet(this.tab);
    this.vieWService.saveViews();
  }

  loadEntities() {
    this.httpService
      .getList<IMenuItem>('assets/mock-apis/menu-' + this.client + '.json')
      .subscribe((el: any) => {
        this.menuList = el;
        let arr: any = localStorage.getItem('tabs')?.split('-');
        if (arr) {
          for (let i = 1; i < arr.length; i++) {
            let entite: any = this.findEntityInMenu(arr[i]);

            if (entite) {
              let table: Tables = new Tables();
              table.entite =
                typeof entite == 'string' ? entite : entite.entityName;
              table.title = entite.text;
              table.droitTitle = entite.droitTitle;
              table.isTable = true;
              table.filresappliques = this.tab.filresappliques;
              this.openOnglet(table, false);
            }
          }

          this.selectUrlViewId();
        }
      });
  }

  selectUrlViewId() {
    let tabHistory = localStorage.getItem('tabHistory');
    let url = window.location.href;
    let arr = url.split('/');
    let viewId = arr[arr.length - 1];
    if (tabHistory) {
      let el = JSON.parse(tabHistory).find((el: any) => el.id == viewId);
      let index = this.tables.findIndex((elx: any) => elx.title == el?.tab);
      this.selectTab({ index: index });
    }
  }

  selectLastTab(index: number) {
    this.selected.setValue(index);
  }

  listenRouter() {
    let watch = false;
    this.routerSubscription = this.router.events.subscribe((data) => {
      if (
        data instanceof NavigationStart &&
        data.navigationTrigger == 'popstate'
      ) {
        watch = true;
      }
      if (watch && data instanceof NavigationEnd) {
        let urlArray = data.url.split('/');
        let id = urlArray[urlArray.length - 1];
        let el = this.tabHistory.find((el) => el.id == id);
        if (el) {
          let tabIndex = this.tables.findIndex(
            (elx) => elx.title.toLowerCase() == el.tab.toLowerCase()
          );
          this.selectLastTab(tabIndex);
        }

        watch = false;
      }
    });
  }

  findEntityInMenu(entityName: string) {
    let ntt = this.menuList.find((el: any) => el.entityName == entityName);
    if (ntt) return ntt;

    for (let i = 0; i < this.menuList.length; i++) {
      let ntt = this.menuList[i].children
        ? this.menuList[i].children.find(
            (el: any) => el.entityName == entityName
          )
        : undefined;
      if (ntt) return ntt;
    }
  }

  toggle() {
    if (this.widthSideBar == this.widthSideBarExpanded) {
      this.widthSideBar = this.widthSideBarCollapsed;
      this.grey = 75;
    } else {
      this.widthSideBar = this.widthSideBarExpanded;
      this.grey = 323;
    }
    this.isExpaned = !this.isExpaned;
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  changeNameOrTitleAfterSave(tab: any, value: string) {
    const index = this.tables.findIndex((e) => {
      if (e.title === tab.title) {
        e.title = value;
      }
      /* e.title === tab.title*/
    });
  }

  openPrev(tab: any) {
    const index = this.tables.findIndex((e) => e.title === tab.title);
    this.removeTab(index);
    this.selected.setValue(index - 1);
  }

  openOnglet(tab: Tables, select: boolean = true) {
    tab.isExtranet = tab.title == 'Extranet';

    if (tab.entite == 'deconnexion') {
      this.router.navigate([PATHS.logout]);
      return 0;
    }
    if (tab.title !== '' && !this.tables.some((e) => e.title === tab.title)) {
      this.tables.push(tab);
      if (select) this.selected.setValue(this.tables.length + 1);
    } else {
      const index = this.tables.findIndex((e) => e.title === tab.title);
      this.selected.setValue(index);
    }

    return 0;
  }

  selectTab(event: any) {
    this.selected.setValue(event.index);
    this.setTabHist(event);
    this.saveTables();
  }

  setTabHist(event: any) {
    let el: any;
    if (event.tab) {
      el = this.tabHistory.find(
        (el) => el?.tab?.toLowerCase() == event?.tab?.textLabel?.toLowerCase()
      );
    }

    if (el) {
      setTimeout(() => {
        this.router.navigate([PATHS.admin, el.id]);
      }, 50);
    } else {
      let viewid = this.temporaryIdService.generateId();
      if (event.tab)
        this.tabHistory.push({ id: viewid, tab: event.tab.textLabel });
      this.router.navigate([PATHS.admin, viewid]);
    }
  }

  saveTables() {
    localStorage.setItem('tabs', this.tables.map((el) => el.entite).join('-'));
    localStorage.setItem('tabHistory', JSON.stringify(this.tabHistory));
  }

  ajouterUnEntite(entite: any) {
    this.openOnglet(entite);
  }

  visualisation(
    title: any,
    entite: any,
    id: any,
    typeName: any = '',
    totalElements: number = 0,
    droitTitle: any = ''
  ) {
  
    const tab = new Tables();
    tab.entite = entite;
    tab.title = title;
    tab.droitTitle = droitTitle;

    tab.id = id;
    tab.value = 'lecture';
    tab.typeName = typeName;
    tab.totalElements = totalElements;
    this.table = tab;
    this.openOnglet(this.table);
  }

  onDrop(event: any) {
    moveItemInArray(this.tables, event.previousIndex, this.lastHovered + 1);
    this.selectLastTab(this.tabHistory[this.tabHistory.length - 1]);
  }

  onHover(index: number) {
    this.lastHovered = index;
  }

  trackByFn(index: number, tab: any): string {
    return tab.id; // Replace "id" with the unique identifier property of your tab object
  }

  removeTab(index: number) {
    if (this.tables[index].value == 'edition') {
      let dialogRef = this.dialog.open(ConfirmRemoveComponent, {
        width: '80%',
        maxWidth: '500px',
        data: [this.tables[index].title],
      });

      dialogRef.afterClosed().subscribe((resp) => {
        if (resp == 'OK') {
          this.closeTab(index);
        }
      });
    } else {
      this.closeTab(index);
    }
  }

  closeTab(index: number) {
    this.tables.splice(index, 1);

    this.tabHistory = this.tabHistory.filter((el, i) => i != index);

    for (let i = 0; i < this.tabHistory.length; i++) {
      if (this.tabHistory[i] > index) this.tabHistory[i]--;
    }

    //correction pour eviter de retourner à longlet accueil à chaque fois que l'on ferme un onglet
    // this.selected.setValue(this.tabHistory[this.tabHistory.length - 1]);
  }

  closeAllTabs() {
    let confirmTabs = this.tables.filter((el) => el.value == 'edition');
    if (confirmTabs.length > 0) {
      let dialogRef = this.dialog.open(ConfirmRemoveComponent, {
        maxWidth: '500px',
        data: confirmTabs.map((el) => el.title),
      });

      dialogRef.afterClosed().subscribe((resp) => {
        if (resp == 'OK') {
          localStorage.removeItem('tabs');
          localStorage.removeItem('tabHistory');
          this.tables = [];
          this.tabHistory = [];
          this.loadHome();
        } else if ('CANCEL') {
          this.tables = this.tables.filter((el) => el.value == 'edition');
          this.loadHome();
        }
      });
    } else {
      localStorage.removeItem('tabs');
      localStorage.removeItem('tabHistory');
      this.tables = [];
      this.tabHistory = [];
      this.loadHome();
    }
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }
}
