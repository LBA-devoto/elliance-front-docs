import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EntityService } from 'src/app/admin/core/services/entity.service';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { UserService } from 'src/app/admin/core/services/user.service';
import { PATHS } from 'src/app/app-routing.module';
import { Extranet } from 'src/app/shared/entities/extranet';
import { Produit } from 'src/app/shared/entities/produit';
import {
  Alert,
  AlertService,
  AlertType,
} from 'src/app/shared/services/alert-service';
import { DevisService } from 'src/app/shared/services/devis.service';
import { ExtranetService } from 'src/app/shared/services/extranet.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css'],
})
export class ProduitComponent implements OnInit {
  @Input()
  product: Produit = new Produit();
  quantity = 1;

  @Input()
  hideEstim: boolean = false; // Affiche ou non les boutons d'ajout au devis

  @Input()
  champs: any[] = [];

  favorite = false;

  @Input()
  favorisListId: string[] = [];
  extranet: Extranet;

  lang = 'fr_FR';

  // ce output permet de communiquer avec le composant catalogue a chaque qu'il y'aura une suppression d'un porduit dans la liste favoris
  @Output() sendFavoris: EventEmitter<Produit> = new EventEmitter<Produit>();

  defaultImg = '/assets/images/Pas-dimage-disponible.jpg';
  alert?: Alert;

  get isFavorite() {
    return this.favorite;
  }

  // get title() {
  //   return this.product.nom;
  // }

  // get publicPrice() {
  //   return this.product.prixpublique;
  // }

  // get purchasePrice() {
  //   return this.product.prixachat;
  // }

  // get supplier() {
  //   return this.product.marque
  //     ? this.product.marque
  //     : this.product.reffournisseur
  //       ? this.product.reffournisseur
  //       : '-';
  // }

  get imgUrl() {
    return this.product?.images ? this.getFirstImg() : this.defaultImg;
  }

  // get reference() {
  //   return this.product.reference ? this.product.reference : this.product.code;
  // }

  get lettreProduit() {
    return this.product?.reference ? 'e' : this.product?.code ? 'a' : 'f';
  }

  get hasPicto() {
    return this.extranet?.elements?.[0]?.data
  }

  get hasFavoris() {
    return this.extranet?.elements?.[1]?.data
  }

  get hasImage() {
    return this.extranet?.elements?.[2]?.data
  }

  get champsProduit() {
    return this.extranet?.elements?.[3]?.data
  }

  constructor(
    private router: Router,
    private devisService: DevisService,
    private alertService: AlertService,
    private userService: UserService,
    private extranetService: ExtranetService,
    private entiteService: EntityService,
    private httpclientService: HttpclientService
  ) { }

  getFirstImg() {
    let imgMap: Map<any, any> = new Map(Object.entries(this.product.images));
    if (imgMap) {
      let arr = Array.from(imgMap.values())
      return arr[0].url
    } else {
      return this.defaultImg;
    }
  }

  ngOnInit(): void {
    this.loadExtranet(3);

    //on verifie si l'id du produit se trouve dans la liste de favoris ou pas
    if (this.favorisListId.includes(this.product.id)) {
      this.favorite = true;
    } else {
      this.favorite = false;
    }
  }

  loadExtranet(tries: number) {
    if (tries > 0) {
      // load extranet      
      this.extranetService.getExtranet(environment.client).then((res) => {
        this.extranet = res[1];
      }).catch(() => {
        setTimeout(() => {
          this.loadExtranet(tries - 1);
        }, 1000)
      })
    } else {
      this.extranet = new Extranet()
    }

    // load champs
    if (!this.champs) {
      this.getChampsProduit(3);
    }
  }

  // getChampsProduit(tries: number) {
  //   if (tries > 0) {
  //     let entite = 'produit'
  //     this.entiteService
  //       .recouperChampsdEntite(entite)
  //       .subscribe((res: any) => {
  //         if (res.waiting) {
  //           setTimeout(() => {
  //             this.getChampsProduit(tries - 1)
  //           }, 200)
  //         } else {
  //           this.champs = res;
  //           this.entiteService.setReqMap(entite, res)
  //         }
  //       })
  //   } else {
  //     this.champs = [];
  //   }
  // }

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

  getChampLabel(ch: any) {
    if (!this.champs) return '-';
    let champ = this.champs.find((el: any) => el.nom == ch.champ);
    if (!champ) return '-';
    return champ.label[this.lang];
  }

  async isRestricted(ch: any) {
    let user: any = await this.userService.getCurrentUser();
    return user.extranetRestrictions?.champs?.includes('produit:' + ch.champ);
  }

  getChampValue(ch: any) {
    let obj: any = this.product;
    let champ = ch.champ;
    if (obj?.[champ]?.[this.lang]) return obj?.[champ]?.[this.lang];
    // Date
    if (obj?.[champ] > 29195528) {
      obj[champ] = `${obj?.[champ]}`.substring(0, 4) + '-' + `${obj?.[champ]}`.substring(4, 6) + '-' + `${obj?.[champ]}`.substring(6, 8)
    }

    // uniteTarifaire iou autre objet similaire
    if (obj?.[champ]?.['mapLocalLibelle']) {
      return obj?.[champ]?.['mapLocalLibelle'][this.lang]
    }

    // fournisseur
    if (obj?.[champ]?.['nom']) {
      return obj?.[champ]?.['nom']
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

    return obj?.[champ] ? obj?.[champ] : '-';
  }

  goToProduct() {
    this.router.navigate([PATHS.product, this.product.id]);
  }

  add(incr: 1 | -1) {
    incr == 1 ? this.quantity++ : this.quantity--;
    if (this.quantity < 1) this.quantity = 1;
  }

  setFavorite() {
    this.favorite = !this.favorite;
    // envoyer requête de modif de favoris
    if (this.favorite) {
      this.httpclientService
        .get(`produit/favoris/add/${this.product.id}`)
        .subscribe((data) => { });
    } else {
      this.httpclientService
        .get(`produit/favoris/delete/${this.product.id}`)
        .subscribe((data) => {
          this.sendFavoris.emit(data);
        });
    }
  }

  addProd() {
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
}
