import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Produit } from 'src/app/shared/entities/produit';
import { PrintDevisComponent } from './print-devis/print-devis.component';

export enum DevisStatusEnum {
  SENT = 'Envoyé',
  LOST = 'Perdu',
  COMMAND = 'Commande',
  DRAFT = 'Brouillon',
  DELETED = 'Supprimé',
}

@Component({
  selector: 'app-create-devis',
  templateUrl: './create-devis.component.html',
  styleUrls: ['./create-devis.component.css'],
})
export class CreateDevisComponent implements OnInit {
  recherche: string;
  infos = { presta: '', factu: '', commercial: '' };
  devisForm: FormGroup;
  lines: any[] = [];
  lines$: Subject<Produit[]> = new Subject();
  selectedLines: any = [];
  status: DevisStatusEnum = DevisStatusEnum.DRAFT;
  switchLines = false;
  displayTools = false;
  separators: any = [];
  subTotals: number[] = [];
  totals: any = {};

  sepEmitter: EventEmitter<number[]> = new EventEmitter();
  subsEmitter: EventEmitter<number[]> = new EventEmitter();

  resetpp: EventEmitter<boolean> = new EventEmitter();

  constructor(private dialog: MatDialog) {
    this.devisForm = new FormGroup({
      titre: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.loadDS();
  }

  loadDS() {
    let dsSep = localStorage.getItem('ds-data-sep');
    this.separators = dsSep ? JSON.parse(dsSep) : [];

    let dsSubTotal = localStorage.getItem('ds-data-sub-total');
    this.subTotals = dsSubTotal ? JSON.parse(dsSubTotal) : [];
  }

  displayResult(event: any) {
    this.recherche = event;
  }

  saveLines(event: any) {
    this.lines = event;
  }

  saveSelectedLines(event: any) {
    this.selectedLines = event;
    this.resetPopups();
  }

  resetPopups() {
    this.resetpp.emit(true);
  }

  deleteLines() {
    this.lines = this.lines.filter(
      (el) => !this.selectedLines.map((el: any) => el.id).includes(el.id)
    );
    this.lines$.next(this.lines);
    this.selectedLines = [];
  }

  saveInfos(event: any) {
    this.infos = event;
  }

  saveDevis() {
    let titre = this.devisForm.get('titre')?.value;
    if (titre) {
      let devisPostBodyObject = {
        titre: titre,
        statut: this.status,
        infos: this.infos,
        lines: this.lines,
        separators: this.separators,
        subTotals: this.subTotals,
        totals: this.totals,
      };

      this.dialog.open(PrintDevisComponent, { data: devisPostBodyObject });
    }
  }

  cancelDevis() {
    localStorage.removeItem('ds-data');
    localStorage.removeItem('ds-data-sep');
    localStorage.removeItem('ds-data-sub-total');
    this.selectedLines = [];
    this.separators = [];
    this.subTotals = [];
    this.lines = [];

    this.sepEmitter.emit(this.separators);
    this.subsEmitter.emit(this.subTotals);
    this.lines$.next(this.lines);
    this.devisForm.reset();
  }

  changeQtt(event: any) {
    this.selectedLines.forEach((line: Produit) => {
      this.lines.find((el) => el.id == line.id).quantite = event;
    });
    this.lines$.next(this.lines);
  }

  changeNum(event: any) {
    this.selectedLines.forEach((line: Produit) => {
      this.lines.find((el) => el.id == line.id).num = event;
    });
    this.lines$.next(this.lines);
  }

  changePrix(event: any) {
    this.selectedLines.forEach((line: Produit) => {
      let el = this.lines.find((el) => el.id == line.id);
      el.prixVente = event.prixVente;
      el.approche = event.approche;
      el.coefMarge = event.marge;
    });
    this.lines$.next(this.lines);
  }

  changeTVA(event: any) {
    this.selectedLines.forEach((line: Produit) => {
      this.lines.find((el) => el.id == line.id).tva = event;
    });
    this.lines$.next(this.lines);
  }

  changeRemises(event: any) {
    this.selectedLines.forEach((line: Produit) => {
      let el = this.lines.find((el) => el.id == line.id);
      el.remises.taux = event.taux;
      el.remises.montant = event.montant;
    });
    this.lines$.next(this.lines);
  }

  changeCommentaire(event: any) {
    this.selectedLines.forEach((line: Produit) => {
      this.lines.find((el) => el.id == line.id).commentaire = event;
    });
    this.lines$.next(this.lines);
  }

  changeMultiCoefPrice(event: any) {
    this.selectedLines.forEach((line: Produit) => {
      let el = this.lines.find((el) => el.id == line.id);
      el.prixVente = el.prixAchat * event;
      el.coefMarge = event;
    });
    this.lines$.next(this.lines);
  }

  changePublicPrice() {
    this.selectedLines.forEach((line: Produit) => {
      let el = this.lines.find((el) => el.id == line.id);
      el.prixVente = el.prixPublic;
      el.coefMarge = 1;
    });
    this.lines$.next(this.lines);
  }

  changeStatus(event: any) {
    this.status = event;
  }

  hidePrice() {
    this.selectedLines.forEach((line: Produit) => {
      this.lines.find((el) => el.id == line.id).prixVente = null;
    });
    this.lines$.next(this.lines);
  }

  comment(event: any) {}

  switch() {
    this.switchLines = !this.switchLines;
  }

  openTools() {
    this.displayTools = !this.displayTools;
  }

  refreshSeparators(seps: any) {
    this.separators = seps;
    this.sepEmitter.emit(this.separators);
  }

  refreshSubTotals(subs: any) {
    this.subTotals = subs.filter((el: number) => el <= this.lines.length);
    this.subsEmitter.emit(this.subTotals);
  }

  refreshTotals(event: any) {
    this.totals = event;
  }

  addSeparator(event: { index: number; text: string }) {
    let index = parseInt(event.index.toString());
    let isPresent = this.separators.map((el: any) => el.index).includes(index);
    if (!isPresent) {
      this.separators.push({ index: event.index, text: event.text });
    } else if (
      isPresent &&
      !this.separators.map((el: any) => el.text).includes(event.text)
    ) {
      let el = this.separators.find((el: any) => el.index == event.index);
      if (el) el.text = event.text;
    } else if (isPresent && event.text === '') {
      let el = this.separators.find((el: any) => el.index == event.index);
      if (el) el.text = '';
    }

    this.sepEmitter.emit(this.separators);
  }

  addSubTotal(event: number) {
    let index = event;
    let isPresent = this.subTotals.map((el: any) => el.index).includes(index);
    if (!isPresent) {
      this.subTotals.push(index);
      this.subTotals.sort((a, b) => a - b);
    }

    this.subsEmitter.emit(this.subTotals);
  }

  addArticle(event: any) {
    this.lines.push({
      prixAchat: event.prixAchat,
      prixVente: event.prixVente,
      titre: event.libelle,
      ref: event.codeArticle,
      image: '/assets/images/image_produit.png',
      ecoPart: event.ecoParticipation ? event.ecoParticipation : 0,
      description: `Par ${event.nomFournisseur}`,
      remises: { taux: 0, montant: 0 },
      quantite: 1,
      tva: event.tva,
    });
    this.lines$.next(this.lines);
  }
}
