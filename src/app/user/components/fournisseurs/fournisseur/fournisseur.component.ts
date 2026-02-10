import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EntityService } from 'src/app/admin/core/services/entity.service';
import { UserService } from 'src/app/admin/core/services/user.service';
import { PATHS } from 'src/app/app-routing.module';
import { Extranet } from 'src/app/shared/entities/extranet';
import { ExtranetService } from 'src/app/shared/services/extranet.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.css']
})
export class FournisseurComponent implements OnInit {
  @Input()
  fournisseur: any;
  @Input()
  champs: any[];

  displayAlerts: string[] = [];
  logo: string;

  imageError = false;
  defaultImg = '/assets/images/Pas-dimage-disponible.jpg';

  extranet?: Extranet;
  lang = 'fr_FR';

  get hasImage() {
    if (this.extranet) {
      return this.extranet.elements.find(el => el.element == 'image')?.data;
    } else {
      return false
    }
  }

  get logoUrl() {
    return this.imageError ? this.defaultImg : this.logo;
  }

  get fournisseurChamps() {
    if (this.extranet) {
      return this.extranet.elements.find(el => el.element == 'champs')?.data;
    } else {
      return []
    }
  }

  constructor(private router: Router, private extranetService: ExtranetService, private entityService: EntityService, private userService: UserService) { }

  ngOnInit(): void {
    this.logo = `/assets/images/Catalogue_fournisseur/${this.fournisseur.nom.toLowerCase()}.png`;
    this.loadExtranet();
  }

  loadExtranet() {
    this.extranetService.getExtranet(environment.client).then((ext) => {
      this.extranet = ext.find(el => el.ref == 'fournisseur');
    }).catch(() => {
      setTimeout(() => {
        this.loadExtranet();
      }, 1000)
    })
  }

  async isRestricted(ch: any) {
    let user: any = await this.userService.getCurrentUser();
    return user.extranetRestrictions.champs.includes('personnemorale:'+ch.champ);
  }
  
  getChampLabel(ch: any) {
    if (!this.champs) return '-';
    let champ = this.champs.find((el: any) => el.nom == ch.champ);
    if (!champ) return '-';
    return champ.label[this.lang];
  }

  getChampValue(ch: any) {
    let obj: any = this.fournisseur;
    let champ = ch.champ;
    if (obj[champ]?.[this.lang]) return obj[champ][this.lang];
    // Date
    if (obj[champ] > 29195528) {
      obj[champ] = `${obj[champ]}`.substring(0, 4) + '-' + `${obj[champ]}`.substring(4, 6) + '-' + `${obj[champ]}`.substring(6, 8)
    }

    // uniteTarifaire ou autre objet similaire
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

  copy(event: string) {
    navigator.clipboard.writeText(event).then(() => {
      // ALERTE, COPY SUCCESS
      this.displayAlerts.push(event + ' copié');
      setTimeout(() => {
        this.displayAlerts.shift();
      }, 2000)
    })
  }


  closeAlert(index: number) {
    this.displayAlerts.splice(index, 1)
  }

  goToCatalogue() {
    localStorage.setItem('filter', 'Fournisseur: ,'+this.fournisseur.id);
    let name = this.fournisseur.raisonsociale ? this.fournisseur.raisonsociale : (this.fournisseur.nom ?this.fournisseur.nom : this.fournisseur.enseigne )
    this.router.navigate([PATHS.catalogues, 'fournisseur:' + name])
  }

}