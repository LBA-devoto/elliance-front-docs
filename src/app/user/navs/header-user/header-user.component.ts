import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PATHS } from 'src/app/app-routing.module';
import { NotificationComponent } from '../../components/notification/notification.component';
import { BurgerComponent } from './burger/burger.component';
import { environment } from 'src/environments/environment';
import { Categorie } from 'src/app/shared/entities/categorie';
import { CategoryService } from 'src/app/shared/services/category.service';
import { SousMenu } from '../../entites/sous-menu';
import { RestrictService } from 'src/app/shared/services/restrict.service';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { map } from 'rxjs';

export class HeaderOption {
  ref?: string;
  title?: string;  // matToolTip
  icon?: string;   // mat-icon
  text?: string;   // additional text
  route?: string;
  action?: CallableFunction;
}

export class NavOption {
  ref?: string;
  title?: string;
  route?: string;
  subMenu?: NavOption[];
}

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css'],
})
export class HeaderUserComponent implements OnInit {
  loaded = false;
  headerOptions: HeaderOption[] = [];
  navOptions: NavOption[] = [];
  categories: Categorie[] = [];
  sousMenu: SousMenu[] = [];
  client: string = environment.client;
  defaultIcon = '/assets/images/Pas-dimage-disponible.jpg';
  devisLinesCount: number = 0;

  get isCatalogueActive(): boolean {
    return this.router.url.includes(PATHS.catalogues);
  }
  get isGestionActive(): boolean {
    return this.router.url.includes(PATHS.gestion);
  } 
  
  get clientLogo(): string {    
    return '/assets/images/logo_elliance.png'
  }

  constructor(public router: Router, public dialog: MatDialog, public categoryService: CategoryService, public restrictService: RestrictService, public http: HttpclientService) {
    this.client = environment.client;
  }

  ngOnInit(): void {
    this.countDevisLines();
    this.fillNavOptions();
  }

  fillHeaderOptions() {
    if (this.headerOptions.length==0)
    this.http.get<NavOption[]>(`assets/mock-apis/extranet-header-${environment.client}.json`).pipe(
      map((head) => {
        this.headerOptions = head;
      })
    ).subscribe();

    setTimeout(async () => {
      this.headerOptions = await this.restrictService.restrictNavOptions(this.headerOptions);
    }, 400)
    
  }

  fillNavOptions() {
    if (this.navOptions.length==0)
    this.http.get<NavOption[]>(`assets/mock-apis/extranet-menu-${environment.client}.json`).pipe(
      map((nav) => {
        this.navOptions = nav;
      })
    ).subscribe();

    setTimeout(async () => {
      this.navOptions = await this.restrictService.restrictNavOptions(this.navOptions);
      this.loaded = true;
    }, 400)
  }

  countDevisLines() {
    let ds = localStorage.getItem('ds-data');
    if (ds) {
      this.devisLinesCount = JSON.parse(ds).length;
    }
    this.fillHeaderOptions();
  }

  logo(cat: Categorie) {
    return this.sousMenu.find(el => el.titre == cat.titre.replace('/', '-'))?.logo ? this.sousMenu.find(el => el.titre == cat.titre.replace('/', '-'))?.logo : this.defaultIcon;
  }

  notifications() {
    this.dialog.open(NotificationComponent, {
      width: '300px',
      height: '100vh',
      position: {
        right: '0',
        top: '0'
      }
    })
  }

  goTo(name: string) {
    this.router.navigate([PATHS.catalogues, name]);
  }

  openBurger() {
    this.dialog.open(BurgerComponent, { data: this.navOptions });
  }
}
