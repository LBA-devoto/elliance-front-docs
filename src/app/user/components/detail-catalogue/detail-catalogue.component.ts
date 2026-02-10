import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, distinctUntilChanged, map } from 'rxjs';
import { PATHS } from 'src/app/app-routing.module';
import { ProductService } from 'src/app/shared/services/product.service';
import { Categorie } from 'src/app/shared/entities/categorie';
import { HttpClient } from '@angular/common/http';
import { Produit } from 'src/app/shared/entities/produit';
import {
  Alert,
  AlertService,
  AlertType,
} from 'src/app/shared/services/alert-service';
import { DevisService } from 'src/app/shared/services/devis.service';
import { ExtranetService } from 'src/app/shared/services/extranet.service';
import { environment } from 'src/environments/environment';
import { Extranet } from 'src/app/shared/entities/extranet';
import { EntityService } from 'src/app/admin/core/services/entity.service';
import { UserService } from 'src/app/admin/core/services/user.service';
import { User } from 'src/app/shared/entities/authentication/user';

@Component({
  selector: 'app-detail-catalogue',
  templateUrl: './detail-catalogue.component.html',
  styleUrls: ['./detail-catalogue.component.css'],
})
export class DetailCatalogueComponent implements OnInit, OnDestroy {
  alert?: Alert;
  routeSub = new Subscription();
  product: Produit;
  quantity: number = 1;

  productsCarousel: Produit[] = []; // Pour les carousel
  accessoiresCarousel: Produit[] = []; // Pour les carousel
  optionsCarousel: Produit[] = []; // Pour les carousel

  extranet: Extranet;
  champs: any;

  categories: Categorie[];
  category?: Categorie;
  logoCat?: string = '/assets/images/Pas-dimage-disponible.jpg';
  logos: any[];

  mainImage: string = '/assets/images/Pas-dimage-disponible.jpg';
  images: string[] = [this.mainImage];

  favorite = false;
  loadingError = false;

  caracOpenTabIndex = 0;
  lang = 'fr_FR';
  user: User;

  get picto() {
    if (this.extranet) {
      return this.extranet.elements[0].picto;
    } else {
      return false;
    }
  }

  get name() {
    if (this.extranet) {
      let val: string = this.extranet.elements[0].data;
      let obj: any = this.product;
      return obj[val]?.[this.lang] ? obj[val]?.[this.lang] : (obj[val] ? obj[val] : '-');
    } else {
      return this.product?.nom
        ? this.product?.nom
        : this.product?.designationrapide
          ? this.product?.designationrapide
          : '-';
    }
  }

  get extranetImages() {
    if (!this.extranet) return true;
    return this.extranet.elements[1].data == 'images';
  }

  get extranetTexte() {
    if (!this.extranet) return '-';
    let val = this.extranet.elements[1].data.champ;
    let obj: any = this.product;

    return obj[val]?.[this.lang] ? obj[val]?.[this.lang] : obj[val];
  }

  get extranetDroiteChamps() {
    if (!this.extranet) return [];

    return this.extranet.elements[2].data;
  }

  get isFavorite() {
    return this.favorite;
  }

  constructor(
    private entityService: EntityService,
    private productService: ProductService,
    private extranetService: ExtranetService,
    private router: Router,
    private http: HttpClient,
    private devisService: DevisService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.watchRoute();
    this.loadLogos();
  }

  ngOnInit(): void {
    this.loadExtranet();
    this.getChampsProduits();
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  watchRoute() {
    this.routeSub = this.router.events
      .pipe(
        distinctUntilChanged(),
        map((ev) => {
          if (ev instanceof NavigationEnd && ev.url.includes(PATHS.product)) {
            this.switchToProduct();
          }
        })
      )
      .subscribe();
  }

  loadLogos() {
    this.http
      .get<Categorie[]>('/assets/mock-apis/sous-menu-extranet.json')
      .subscribe((data) => {
        this.logos = data;
      });
  }

  loadExtranet() {
    this.extranetService.getExtranet(environment.client).then((ext) => {
      if (ext[0]) this.extranet = ext[0];
    });
  }

  async getChampsProduits() {
    try {
      const entite = 'produit';
      const res = await this.entityService.recouperChampsdEntite(entite);

      this.champs = res;
      this.entityService.setReqMap(entite, res);
    } catch (error) {
      console.error('Error getting product entity fields:', error);
    }
  }

  async isRestricted(ch: any) {
    let user: any = await this.userService.getCurrentUser();
    return user.extranetRestrictions?.champs?.includes('produit:' + ch.champ);
  }

  getChampLabel(ch: any) {
    if (!this.champs) return '-';
    let champ = this.champs.find((el: any) => el.nom == ch.champ);
    if (!champ) return '-';
    return champ.label[this.lang];
  }

  getChampValue(ch: any) {
    let obj: any = this.product;
    let champ = ch.champ;
    if (obj[champ]?.[this.lang]) return obj[champ][this.lang];
    // Date
    if (obj[champ] > 29195528) {
      obj[champ] = `${obj[champ]}`.substring(0, 4) + '-' + `${obj[champ]}`.substring(4, 6) + '-' + `${obj[champ]}`.substring(6, 8)
    }

    // uniteTarifaire iou autre objet similaire
    if (obj[champ]?.['mapLocalLibelle']) {
      return obj[champ]?.['mapLocalLibelle'][this.lang]
    }

    // fournisseur
    if (obj[champ]?.['nom']) {
      return obj[champ]?.['nom']
    }

    // adresse
    if (obj[champ]?.[0]?.['adresseligne']) {
      let el = obj[champ]?.[0];
      let lignes = el?.['adresseligne'].join(', ');
      let cp = el?.['codepostal']?.valeur;
      let ville = el?.['ville'] ? el?.['ville'].nom : null;

      let arr = [];
      if (lignes) arr.push(lignes);
      if (cp) arr.push(cp);
      if (ville) arr.push(ville);
      return arr.join(', ');
    }

    return obj[champ] ? obj[champ] : '-';
  }

  getChampExtension(ch: any) {
    ch = ch.champ;
    if (!this.extranet) return '';
    let el = this.extranet.elements[2].data.find((el: any) => el.champ == ch);
    return el ? el.extension : '';
  }

  getChampCSS(ch: any) {
    ch = ch.champ;
    if (!this.extranet) return '';
    let el = this.extranet.elements[2].data.find((el: any) => el.champ == ch);
    return el ? el.css : '';
  }

  loadProduct(tries: number = 1) {
    if (tries > 0) {
      this.loadingError = false;
      let arr = window.location.pathname.split('/');
      let id = arr[arr.length - 1];
      this.productService
        .getProductById(id)
        .then((prod: any) => {
          this.product = prod;
          this.setCat();
          this.setImages();
          this.setCarouselProducts();
        })
        .catch((err) => {
          this.loadProduct(tries - 1);
        });
    } else {
      this.loadingError = true;
    }
  }

  setCat() {
    if (this.product.categories[0]) {
      let cat = this.product.categories[0];
      this.category = cat;
    }
  }

  switchToProduct() {
    this.loadProduct(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setImages() {
    let imgMap: Map<any, any> = new Map(Object.entries(this.product?.images ? this.product?.images : this.product?.imagesmap ? this.product?.imagesmap : []));

    if (imgMap.size > 0) {
      let arr = Array.from(imgMap.values());
      this.mainImage = arr[0].url;
      this.images = arr.map((el) => el.url) ? arr.map((el) => el.url) : [];
    }
  }

  setCarouselProducts() {
    this.productsCarousel = [];
    this.accessoiresCarousel = [];
    let limit = 10;
    let prodIds = this.category?.produits?.filter(el => el != null);

    prodIds?.forEach((el: any, i) => {
      if (i < limit) {
        this.productService.getProductById(el).then((prod) => {
          if (prod) this.productsCarousel.push(prod);
        })
      }

    })

    if (this.product?.produits) {
      let prods = this.product.produits.filter(el => el != null)
      prods.forEach((el, i) => {
        if (i < limit) {
          this.productService.getProductById(el).then((prod) => {
            if (prod) this.accessoiresCarousel.push(prod);
          })
        }
      })
    }
  }

  add(incr: 1 | -1) {
    incr == 1 ? this.quantity++ : this.quantity--;
    if (this.quantity < 1) this.quantity = 1;
  }

  addDevis() {
    try {
      this.devisService.addProd2Devis(this.product, this.quantity);
    } catch {
      this.alert = new Alert(
        AlertType.WARNING,
        `Cet article est déjà présent dans le devis`
      );
      setTimeout(() => {
        this.alert = undefined;
      }, this.alertService.alertDuration);
    }
  }

  setFavorite() {
    this.favorite = !this.favorite;
    // Envoyer requete pour mettre a jour la table des favoris
  }

  scrollDown() {
    this.caracOpenTabIndex = 0;
    window.scroll({ top: 500, behavior: 'smooth' });
    setTimeout(() => {
      this.caracOpenTabIndex = 1;
    }, 100);
  }
}
