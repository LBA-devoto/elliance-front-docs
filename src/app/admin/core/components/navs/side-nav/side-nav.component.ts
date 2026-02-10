import {
  Component,
  OnInit,
  ViewChild,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable, Subject, catchError, map, of, takeUntil } from 'rxjs';
import { Tables } from 'src/app/shared/entities/tables';
import { IMenuItem } from '../../../interfaces/IMenu';
import { HttpclientService } from '../../../services/httpclientService';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/shared/entities/authentication/user';
import { HttpClient } from '@angular/common/http';
import { Role } from 'src/app/shared/enums/user-roles';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent implements OnInit {
  widthSideBar = 80;
  widthSideBarExpanded = 500;
  widthSideBarCollapsed = 80;
  public activeIcon = false;
  client: String = '-' + environment.client;

  menuList: IMenuItem[] = [];
  isShowing = false;
  grey = 75;
  // @ViewChild('sidenav') sidenav: MatSidenav;  side-nav.component
  // @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  @Input() user: User;
  @Input() isExpaned = false;
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild('menu') menu: MatMenuModule;
  @Output() open = new EventEmitter<Tables>();
  /** tables dynamics onglet  */
  tables: Tables[] = [];
  table: Tables = new Tables();
  role: Role;
  constructor(private httpService: HttpClient) {}

  private destroy$: Subject<void> = new Subject<void>(); // Create a subject for unsubscribing

  ngOnInit() {
    let urlmenu = 'role/getbyname';
    let userRole = localStorage.getItem('role');
    if (userRole === null) {
      urlmenu = 'role/getbyname';
    } else {
      urlmenu = 'role/getbyname/' + userRole;

      urlmenu = urlmenu.replace(/\[|\]/g, '');
    }

    this.httpService
      .get(urlmenu)
      .pipe(takeUntil(this.destroy$)) // Use takeUntil to automatically unsubscribe when the component is destroyed
      .subscribe((res: any) => {
        this.role = res;

        if (
          this.role.backofficeRestrictions !== null &&
          this.role.backofficeRestrictions.menu !== null
        ) {
          this.menuList = this.role.backofficeRestrictions.menu;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(); // Emit a signal to unsubscribe from observables
    this.destroy$.complete(); // Complete the subject
  }

  loadMenu() {
    this.httpService
      .get(`assets/mock-apis/menu${this.client}.json`)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.menuList = res;
      });
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
  openOnglet(menuItem: IMenuItem) {
    const tab = new Tables(); //testing recovery
    tab.title = menuItem.text;
    tab.entite = menuItem.entityName;
    tab.droitTitle = menuItem.droitTitle;
    tab.id = menuItem.id;
    tab.typeName = menuItem.typeName;
    tab.filresappliques = menuItem.filresappliques;
    tab.listedechamps = menuItem.listedechamps;
    tab.isTable = true;
    tab.activeTable = 'actif';
    if (menuItem.apply === 'submenu') {
      this.activeIcon = true;
    }
    /*application d'un filtre ex : categorie de niveau 1 */
    tab.filter = menuItem.filter;
    tab.filresappliques = menuItem.filresappliques;
   
    this.open.emit(tab);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isExpaned']) {
      this.isExpaned = changes['isExpaned'].currentValue;
    }
  }

  hasMenuAccess(ref: any): boolean {
    let hasaccess = false;
    if (this.role.backofficeRestrictions) {
      this.role.backofficeRestrictions.menu.forEach((restriction: any) => {
        if (
          restriction?.text.toLocaleLowerCase() === ref.toLocaleLowerCase() &&
          restriction?.selected
        ) {
          hasaccess = true;
        }
        if (restriction.children) {
          restriction.children.forEach((child: any) => {
            if (child?.text === ref && child?.selected) {
              hasaccess = true;
            }
          });
        }
      });
    }
    return hasaccess;
  }
}
