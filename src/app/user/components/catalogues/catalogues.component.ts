import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, map, Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PATHS } from 'src/app/app-routing.module';
import { Personnemorale } from 'src/app/shared/entities/personnemorale';
import { ProductService } from 'src/app/shared/services/product.service';
import { Categorie } from 'src/app/shared/entities/categorie';
import { Produit } from 'src/app/shared/entities/produit';
import { EntityService } from 'src/app/admin/core/services/entity.service';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { UserService } from 'src/app/admin/core/services/user.service';
import { User } from 'src/app/shared/entities/authentication/user';

@Component({
  selector: 'app-catalogues',
  templateUrl: './catalogues.component.html',
  styleUrls: ['./catalogues.component.css'],
})
export class CataloguesComponent implements OnInit, OnDestroy {
  loaded = false;
  productsError = false;
  products: Produit[] = [];
  displayedProducts: Produit[] = [];

  activeRecherche: boolean;
  displayFournisseurs: boolean;
  displayRecherche: boolean;
  displayAssocies: boolean;
  favoritesView: boolean;

  id: string;
  rs: string;
  titre: string;
  defaultLogo = '/assets/images/Pas-dimage-disponible.jpg';
  imgErr = false;
  logo: any = this.defaultLogo;
  logos: any = [];
  type: any;
  recherche: string;

  filtres: string[] = [];

  // Paginator
  paginatorSize = 21;
  paginatorValues = [21, 42, 84];
  paginatorIndex = 0;
  paginatorLength = 0;
  paginatorSubject = new Subject();
  routeSubscription = new Subscription();

  fournisseurId?: string;

  get logoUrl() {
    if (this.imgErr) return '/assets/images/Pas-dimage-disponible.jpg';
    return this.logo;
  }

  alimentations: string[] = ['Électrique', 'Gaz'];
  categories: Categorie[] = [];
  fournisseurs: Personnemorale[] = [];
  fournisseur?: Personnemorale;
  champs: any[] = [];

  user: User;

  constructor(
    private router: Router,
    private http: HttpClient,
    private productService: ProductService,
    private userService: UserService,
    private entiteService: EntityService,
    private categorieService: CategoryService,
    private fournisseurService: FournisseurService
  ) {
    this.watchRoute();
  }

  async ngOnInit(): Promise<void> {
    await this.loadUser();

    this.loadCategories();
    this.getChampsProduit(2);
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  async loadUser(): Promise<void> {
    let user: any = await this.userService.getCurrentUser();
    this.user = user;
    if (!this.user.id) {
      setTimeout(() => {
        this.loadUser();
      }, 500);
    } else {
      // On a user
      this.loadFilter();
      let fonctions = this.user?.extranetRestrictions?.fonctions;
      if (
        fonctions.includes('fournisseurOnly') &&
        this.user.personneMoraleObj
      ) {
        this.imposeFilterWithFournisseur();
      }
    }
  }

  imposeFilterWithFournisseur() {
    let el = this.filtres.find((el) => el.includes('Fournisseur:'));
    if (el) {
      el = `Fournisseur: ${this.user?.personneMoraleObj?.id}`;
      let ind = this.filtres.findIndex((el) => el.includes('Fournisseur:'));
      if (ind != -1) {
        this.filtres[ind] = el;
      }
    } else {
      this.filtres.push(`Fournisseur: ${this.user?.personneMoraleObj?.id}`);
    }
    this.products = [];
    this.displayedProducts = [];
    localStorage.setItem(
      'filter',
      `Fournisseur: ${this.user?.personneMoraleObj?.id}`
    );
    this.loadFilter();
  }

  loadCategories() {
    this.categorieService.getCategories(3, 0, 200).then((res) => {
      this.categories = res;
    });
  }

  async getChampsProduit(tries: number) {
    if (tries > 0) {
      const entite = 'produit';
      try {
        const res = await this.entiteService.recouperChampsdEntite(entite);
        if (res) {
          this.champs = res;
          this.entiteService.setReqMap(entite, res);
        }
      } catch (error) {
        console.error('Error getting product entity fields:', error);
      }
    } else {
      this.champs = [];
    }
  }

  loadLogos() {
    this.http
      .get<Categorie[]>('/assets/mock-apis/sous-menu-extranet.json')
      .subscribe((data) => {
        this.logos = data;
        if (this.recherche)
          this.logo = this.logos.find(
            (el: any) => el.titre == this.recherche
          )?.logo;
      });
  }

  parseFilter(filter: any) {
    let fi = [...filter];
    for (let i = 0; i < fi.length; i++) {
      if (fi[i].includes('Cat:')) {
        let arr = fi[i].split(':');
        try {
          fi[i] = `Cat: ${this.getDepth3Cat(arr[1].trim())}`;
        } catch (err) {
          return [null];
        }
      }
    }
    return fi;
  }

  getDepth3Cat(catId: string) {
    let res: any = [];
    let cat = this.categories.find((el) => el.id == catId);

    if (cat) {
      if (cat.depth == 3) return catId;
      if (cat.depth == 2) {
        res = this.categories
          .filter((el) => el.pereid == catId)
          .map((el) => el.id);
        return res;
      }
      if (cat.depth == 1) {
        let dep2catsId = this.categories
          .filter((el) => el.pereid == catId)
          .map((el) => el.id);
        for (let i = 0; i < dep2catsId.length; i++) {
          let dep3 = this.categories
            .filter((el) => el.pereid == dep2catsId[i])
            .map((el) => el.id);
          res = res.concat(dep3);
        }
        return res.length > 0 ? res : catId;
      }
    } else if (cat == undefined) {
      throw new Error();
    } else {
      return catId;
    }
  }

  getCatId(nom: string): string {
    let id = this.categories.find(
      (el) => el.titre.toUpperCase() === nom.toUpperCase()
    )?.id;
    return id ? id : '';
  }

  loadProducts(tries: number = 1) {
    if (this.loaded && tries > 0) {
      this.productsError = false;
      let filtres = this.parseFilter(this.filtres);
      //console.log(filtres);

      if (filtres[0] !== null) {
        this.productService
          .getFilteredProducts(filtres, this.paginatorIndex, this.paginatorSize)
          .then((prod: any) => {
            this.paginatorLength = prod.totalElements;
            this.products = prod.content;
            this.displayedProducts = prod.content;
            window.scrollTo({ top: 0, behavior: 'smooth' });
          })
          .catch(() => {
            this.loadProducts(tries - 1);
          });
      } else {
        setTimeout(() => {
          this.loadProducts(tries - 1);
        }, 500);
      }
    } else if (this.loaded) {
      this.productsError = true;
    }
  }

  watchRoute() {
    this.routeSubscription = this.router.events
      .pipe(
        distinctUntilChanged(),
        map((ev) => {
          if (ev instanceof NavigationEnd) {
            this.setSearch();
          }
        })
      )
      .subscribe();
  }

  loadFilter() {
    let filterString = localStorage.getItem('filter');
    let filterArray = filterString?.split(',');

    if (!filterArray) {
      // avoid undefined case
      this.router.navigate([PATHS.catalogues, 'products&search:']);
      this.fournisseur = undefined;
    } else {
      let filterMap = new Map();
      for (let i = 0; i < filterArray.length; i += 2) {
        filterMap.set(filterArray[i], filterArray[i + 1]);
      }
      Array.from(filterMap.entries()).forEach((el) => {
        if (el[1]) {
          this.filtres.push(this.parseFilterItem(`${el[0]} ${el[1]}`));
        }
      });
    }

    this.filtres = [...new Set(this.filtres)]; // Evite les doublons
    this.loaded = true;
    this.setSearch();
  }

  parseFilterItem(item: string): string {
    let res = item.replace('Min:', ': >').replace('Max:', ': <');
    if (res.includes('Larg') || res.includes('Long') || res[0] == 'H') {
      res = res + 'mm';
    } else if (res.includes('Puiss')) {
      res = res + 'W';
    } else if (res.includes('Poids')) {
      res = res + 'kg';
    } else if (res.includes('Prix')) {
      res = res + '€';
    }
    return res;
  }

  setSearch() {
    this.displayRecherche = false;
    this.displayAssocies = false;
    this.displayFournisseurs = false;
    this.activeRecherche = false;
    this.favoritesView = false;
    this.rs = '';

    if (this.user?.personneMoraleObj) {
      this.displayFournisseurs = true;
      this.fournisseur = this.user.personneMoraleObj;
      let name = this.fournisseur?.nom
        ? this.fournisseur?.nom
        : this.fournisseur?.enseigne;
      this.rs = name;
      this.router.navigate([PATHS.catalogues, 'fournisseur:' + name]);
      let filtreFour = this.filtres.find((el) => el.includes('Fournisseur:'));
      if (filtreFour) {
        filtreFour = 'Fournisseur: ' + this.fournisseur.id;
      } else {
        this.filtres.push('Fournisseur: ' + this.fournisseur.id);
      }
    } else {
      if (this.filtres.find((el) => el.includes('Fournisseur'))) {
        this.displayFournisseurs = true;
        let arr = window.location.pathname.split(':');
        this.rs = arr[arr.length - 1]
          .replace(/%20/g, ' ')
          .replace(/%C3%A9/g, 'é');
        this.logo = `/assets/images/Catalogue_fournisseur/${this.rs.toLowerCase()}.png`;
        this.getFournisseur();
      } else if (
        window.location.pathname.includes('&search') ||
        window.location.pathname.includes('categorie')
      ) {
        this.fournisseur = undefined;
        // Recherche manuelle
        this.activeRecherche = true;
        this.displayRecherche = true;
        let arr = window.location.pathname.split(':');
        this.recherche = arr[arr.length - 1]
          .replace(/%20/g, ' ')
          .replace(/%C3%A9/g, 'é');
      } else if (window.location.pathname.includes('favoris')) {
        this.fournisseur = undefined;
        this.favoritesView = true;
        this.titre = 'MES FAVORIS';
      } else {
        this.displayFournisseurs = true;
        let arr = window.location.pathname.split(':');
        this.rs = arr[arr.length - 1]
          .replace(/%20/g, ' ')
          .replace(/%C3%A9/g, 'é');
        this.logo = `/assets/images/Catalogue_fournisseur/${this.rs.toLowerCase()}.png`;
        this.getFournisseur();
      }
    }

    this.loadProducts(3);
  }

  getFournisseur() {
    let id = this.filtres
      .find((el) => el.includes('Fournisseur'))
      ?.split(':')?.[1]
      ?.trim();
    if (id) {
      this.fournisseurService.getFournisseurById(id).then((res: any) => {
        this.fournisseur = res;
        this.router.navigate([
          PATHS.catalogues,
          'fournisseur:' +
            (this.fournisseur?.nom
              ? this.fournisseur?.nom
              : this.fournisseur?.enseigne),
        ]);
      });
    }
  }

  displayResult(event: any) {
    this.activeRecherche = true;
    this.recherche = event;
  }

  paginatorChange(event: any) {
    this.paginatorIndex = event.pageIndex;
    this.paginatorSize = event.pageSize;
    this.loadProducts(3);
  }

  saveFilter(event: any) {
    this.filtres = event;
    if (this.filtres.find((el) => el.includes('Fournisseur'))) {
      this.getFournisseur();
    } else {
      this.recherche = '';
      this.router.navigate([PATHS.catalogues, 'products&search:']);
    }
    this.loadProducts(2);
  }

  canAddSearch(filter: string[] = []) {
    return (
      this.recherche &&
      filter.findIndex((el) => el.includes('text')) == -1 &&
      !this.recherche.includes('fournisseur:')
    );
  }

  /*** recupere la liste de produits favoris après ajout ou suppressionn de la liste dans produitComponent.ts  */
  getFavorisProduit(prods: any) {
    //cette affichage prendra effet que lorsqu'on favoritesView est actif ou lorsque l'on affiche que les favoris
    if (this.favoritesView) {
      this.displayedProducts = prods;
      this.products = prods;
      this.paginatorLength = prods.length;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
