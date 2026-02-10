import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PATHS } from 'src/app/app-routing.module';

@Component({
  selector: 'app-create-edit-product',
  templateUrl: './create-edit-product.component.html',
  styleUrls: ['./create-edit-product.component.css'],
})
export class CreateEditProductComponent implements OnInit {
  title: any = window.location.pathname.includes('create')
    ? 'Créer un article'
    : 'Editer un article';
  articleForm: FormGroup;

  cats = ['CUISSON', 'HYGIENE'];
  etats = [
    'En cours',
    'Commande',
    'Commande annulée',
    'Envoyé',
    'Perdu',
    'Supprimé',
  ];
  types = ['Produit', 'Contrat', 'Service'];
  statuts = [
    'Publié',
    'En rédaction',
    'Archivé',
    'En attente de publication',
    'Fournisseur non reférencé',
  ];
  marques = ['EUROCHEF', 'ACO'];
  tvas = [0, 2.1, 5.5, 10, 20];
  devises = ['€', '$', '£'];
  promo = false;

  photoFilename = '';
  ficheFilename = '';

  gestionLink = `/${PATHS.gestion}/${PATHS.gestion_article}`;

  constructor() {
    this.articleForm = new FormGroup({
      reference: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      code: new FormControl('', [Validators.maxLength(100)]),
      titre: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      photo: new FormControl('', []),
      fiche: new FormControl('', [Validators.required]),
      type: new FormControl('', []),
      fournisseur: new FormControl('', [Validators.required]),
      descriptionCourte: new FormControl('', [Validators.maxLength(300)]),
      descriptionLongue: new FormControl('', [Validators.maxLength(5000)]),
      marque: new FormControl('', []),
      statut: new FormControl('', [Validators.required]),
      prixPublic: new FormControl('', [Validators.required, Validators.min(0)]),
      prixAchat: new FormControl('', [Validators.required, Validators.min(0)]),
      tva: new FormControl('', [Validators.required]),
      devise: new FormControl('', [Validators.required]),
      remise1: new FormControl('', [Validators.min(0), Validators.max(100)]),
      remise2: new FormControl('', [Validators.min(0), Validators.max(100)]),
      remise3: new FormControl('', [Validators.min(0), Validators.max(100)]),
      ecoPart: new FormControl('', [
        Validators.required,
        Validators.max(999999),
      ]),
      promo: new FormControl(false, []),
      promoDateDebut: new FormControl('2024-01-01'),
      promoDateFin: new FormControl('2024-01-01'),
      categorie: new FormControl('', [Validators.required]),
      hauteur: new FormControl('', [
        Validators.min(0),
        Validators.max(9999999),
      ]),
      largeur: new FormControl('', [
        Validators.min(0),
        Validators.max(9999999),
      ]),
      longueur: new FormControl('', [
        Validators.min(0),
        Validators.max(9999999),
      ]),
      poids: new FormControl('', [Validators.min(0), Validators.max(9999999)]),
      puissance: new FormControl('', [
        Validators.min(0),
        Validators.max(9999999),
      ]),
      alimentation: new FormControl('', [Validators.required]),
      carac1: new FormControl('', []),
      carac2: new FormControl('', []),
      carac3: new FormControl('', []),
    });
  }

  ngOnInit(): void {}

  loadFiche(event: any) {
    const htmlElement = event.target as HTMLInputElement;
    if (htmlElement.files) {
      const file = htmlElement.files[0];
      this.articleForm.get('fiche')?.patchValue(file);
      this.articleForm.get('fiche')?.updateValueAndValidity();
      this.ficheFilename = file.name;
    }
  }

  loadPhoto(event: any) {
    const htmlElement = event.target as HTMLInputElement;
    if (htmlElement.files) {
      const file = htmlElement.files[0];
      this.articleForm.get('photo')?.patchValue(file);
      this.articleForm.get('photo')?.updateValueAndValidity();
      this.photoFilename = file.name;
    }
  }

  selectPromo() {
    if (this.promo) {
      this.articleForm
        .get('promoDateDebut')
        ?.setValidators([Validators.required]);
      this.articleForm
        .get('promoDateFin')
        ?.setValidators([Validators.required]);
    } else {
      this.articleForm.get('promoDateDebut')?.clearValidators();
      this.articleForm.get('promoDateFin')?.clearValidators();
    }
  }

  save() {}
}
