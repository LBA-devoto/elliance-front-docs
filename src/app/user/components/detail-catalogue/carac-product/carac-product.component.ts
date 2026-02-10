import { Component, Input, OnInit } from '@angular/core';
import { Extranet } from 'src/app/shared/entities/extranet';
import { Produit } from 'src/app/shared/entities/produit';
import { ExtranetService } from 'src/app/shared/services/extranet.service';

@Component({
  selector: 'app-carac-product',
  templateUrl: './carac-product.component.html',
  styleUrls: ['./carac-product.component.css']
})
export class CaracProductComponent implements OnInit {
  @Input()
  product: Produit;

  @Input()
  openTabIndex = 0;

  @Input()
  extranet: Extranet;

  @Input()
  champs: any;

  @Input()
  lang: string;

  // documents: any;

  // get alim() {
  //   return this.product.alimentation ? this.product.alimentation : '-';
  // }

  // get puissance() {
  //   return this.product.puissanceenwatt ? this.product.puissanceenwatt : '-';
  // }

  // get hauteur() {
  //   return this.product.hauteur ? this.product.hauteur : '-';
  // }

  // get longueur() {
  //   return this.product.longueur ? this.product.longueur : '-';
  // }

  // get largeur() {
  //   return this.product.profondeur ? this.product.profondeur : '-';
  // }

  // get caracteristique1() {
  //   return this.product.caracteristique1 ? this.product.caracteristique1 : '-';
  // }

  // get caracteristique2() {
  //   return this.product.caracteristique2 ? this.product.caracteristique2 : '-';
  // }

  // get caracteristique3() {
  //   return this.product.caracteristique3 ? this.product.caracteristique3 : '-';
  // }

  // get documents() {
  //   return this.product.documents ? this.product.documents : [];
  // }


  get onglets() {
    return this.extranet.elements[3].data;
  }

  constructor(private extranetService: ExtranetService) { }

  ngOnInit(): void {    
    // this.documents = [
    //   {
    //     url: '/assets/mock-doc/etude_implantation_EUROCHEF_devischef_v2_version3_sans_planning_v2.pdf',
    //     name: 'Etude implémentation EUROCHEF',
    //     fileName: 'etude_implantation_EUROCHEF_devischef_v2_version3_sans_planning_v2.pdf',
    //     matIcon: 'attach_file'
    //   },
    //   {
    //     url: '/assets/mock-doc/etude_implantation_EUROCHEF_devischef_v2_version3_sans_planning_v2.pdf',
    //     name: 'Même doc, autre nom, autre icon',
    //     fileName: 'etude.pdf',
    //     matIcon: 'insert_drive_file'
    //   },
    // ]
  }

  getOngletChamps(onglet: any) {
    return onglet.content
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

    // fournisseur ou obj similaire
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
    return ch.extension;
  }

  getChampCSS(ch: any) {
    return ch.css;
  }
}
