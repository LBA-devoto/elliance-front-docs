import { Component, Input, OnInit } from '@angular/core';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { Prix } from '../../entities/prix';
import { Produit } from '../../entities/produit';
import { Tables } from '../../entities/tables';

@Component({
  selector: 'app-produit-admin',
  templateUrl: './produit-admin.component.html',
  styleUrls: ['./produit-admin.component.css'],
})
export class ProduitAdminComponent implements OnInit {
  produit: Produit = new Produit();
  prix: Prix[] = [];

  /** mode d'affichage  */

  @Input() public value: string;
  @Input() public tab: Tables = new Tables();
  edition: boolean = false;
  lecture: boolean = false;

  constructor(private httpClientService: HttpclientService) {}

  ngOnInit(): void {
    if (this.tab.value === 'edition') {
      this.edition = true;
      this.produit.prix.push(new Prix());
      this.produit.remises.set('remise1', '');
      this.produit.classification.set('classification1', '');
    } else if (this.tab.value === 'lecture') {
      this.httpClientService.getProduit(this.tab.id).subscribe((res) => {
        this.produit = res;
      });
      this.lecture = true;
    }
  }

  ajoutRemise() {}

  ajoutPrix() {
    this.produit.prix.push(new Prix());
  }

  retirerPrix(index: number) {
    this.produit.prix.splice(index, 1);
  }

  modeEdition() {
    this.edition = true;
    this.lecture = false;
  }

  rafraichir() {
    //this.personnephysique = this.personneDefault;
    //alert("ok")
  }

  annuler() {
    this.lecture = true;
    this.edition = false;
    // this.personnephysique = this.personneDefault;
  }

  supprimer() {}

  enregistrer() {}

  ajoutClassification() {}
}
