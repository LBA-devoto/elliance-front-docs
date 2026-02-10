import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { Tables } from 'src/app/shared/entities/tables';
import { UserService } from '../../services/user.service';
import { IMenuItem } from '../../interfaces/IMenu';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
@Component({
  selector: 'app-admin-home-page',
  templateUrl: './admin-home-page.component.html',
  styleUrls: ['./admin-home-page.component.css'],
})
export class AdminHomePageComponent implements OnInit {
  @Output() open: EventEmitter<number> = new EventEmitter();
  @Input() public tab: Tables = new Tables();
  //@Output() open = new EventEmitter<Tables>();
  @Input() public value: string;
  public activeIcon = false;
  displayedColumns: string[] = ['id', 'code', 'reference'];

  cards: any[] = [
    {
      toolTip: 'Catégories',
      logo: '/assets/logo/arborescence.svg',

      text: 'Catégories',
      droitTitle: 'Catégories',
      entityName: 'categorie',
      parentId: "Gestion de l'arborescence",
      selected: true,
      filresappliques: {
        depth: {
          champ: 'depth',
          conditions: [
            {
              id: 0,
              type: 'NUMBER',
              condition: 'EQUALS',
              valeur: 1,
            },
          ],
          defaultValue: true,
        },
      },
      listedechamps: [
        'select',
        'code',
        'maplocaletitre',
        'mapdescriptioncourte',
        'mapdescriptionlongue',
        'perecode',
        'ordre',
      ],
      routerLink: '/product/category',
      children: [],
    },
    {
      text: 'Produits',
      logo: '/assets/logo/arborescence.svg',
      selected: true,
      children: [],
      entityName: 'produit',
      toolTip: 'Produits',
      parentId: "Gestion de l'arborescence",
      droitTitle: 'Produits',
      filter: 'PRODUIT',
      listedechamps: [
        'select',
        'code',
        'descriptioncourte',
        'designationrapide',
        'marque',
        'reffournisseur',
        'codebarreean',
      ],
      id: '',
      filresappliques: {
        estProduit: {
          champ: 'estProduit',
          conditions: [
            {
              id: 0,
              type: 'UNKNOWN',
              condition: 'EQUALS',
              valeur: true,
            },
          ],
          defaultValue: true,
        },
      },
      routerLink: '/admin/produits',
    },
    {
      toolTip: 'Articles',
      logo: '/assets/logo/arborescence.svg',

      text: 'Articles',
      selected: true,
      children: [],
      entityName: 'produit',
      droitTitle: 'Articles',
      parentId: "Gestion de l'arborescence",
      filter: 'ARTICLE',
      listedechamps: [
        'select',
        'code',
        'descriptioncourte',
        'designationrapide',
        'marque',
        'reffournisseur',
        'codebarreean',
      ],
      id: '',
      filresappliques: {
        estArticle: {
          champ: 'estArticle',
          conditions: [
            {
              id: 0,
              type: 'UNKNOWN',
              condition: 'EQUALS',
              valeur: true,
            },
          ],
          defaultValue: true,
        },
      },
      routerLink: '/admin/produits',
    },

    {
      toolTip: 'Gestions des utilisateurs',
      text: 'Gestions des utilisateurs',
      droitTitle: 'Utilisateurs',
      listedechamps: ['select', 'prénom', 'nom', 'email', 'active'],
      entityName: 'user',
      parentId: 'Parametres',
      routerLink: '/purchases/history',
      selected: true,
      children: [],
      logo: '/assets/logo/surface1.svg',
      route: ['/admin/tous-les-personnemorale'],
    },
  ];

  name: any;
  pageIndex: number = 0;
  pageSize: number = 25;
  totalElements: number = 0;

  adminTab = {
    isMenuVisible: true,
    entite: 'produit',
    title: 'Produits',
    isTable: true,
    droitTitle: 'Accueil',
  };

  constructor(
    public userService: UserService,
    private dash: DashboardComponent
  ) {}

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('sidenav') sidenav: MatSidenav;

  ngOnInit(): void {
    this.setName();
  }

  setName() {
    let firstname =
      localStorage.getItem('name') !== undefined
        ? localStorage.getItem('name')
        : '';
    let surname =
      localStorage.getItem('surname') !== undefined
        ? localStorage.getItem('surname')
        : '';
    this.name = firstname + ' ' + surname;
  }

  openOnglet(menuItem: any) {
    const tab = new Tables();
    tab.title = menuItem.text;
    tab.entite = menuItem.entityName;
    tab.droitTitle = menuItem.droitTitle;
    tab.id = menuItem.id;
    tab.typeName = menuItem.typeName;
    tab.filresappliques = menuItem.filresappliques;
    tab.listedechamps = menuItem.listedechamps;
    tab.isTable = true;
    tab.activeTable = 'actif';

    /*application d'un filtre ex : categorie de niveau 1 */
    tab.filter = menuItem.filter;
    tab.filresappliques = menuItem.filresappliques;
    this.dash.openOnglet(tab);
  }

  hasMenuAccess(ref: any): boolean {
    let hasaccess = false;
    if (this.userService.role.backofficeRestrictions) {
      this.userService.role.backofficeRestrictions.menu.forEach(
        (restriction: any) => {
          if (restriction?.text === ref && restriction?.selected) {
            hasaccess = true;
          }
          if (restriction.children) {
            restriction.children.forEach((child: any) => {
              if (child?.text === ref && child?.selected) {
                hasaccess = true;
              }
            });
          }
        }
      );
    }
    return hasaccess;
  }
}
