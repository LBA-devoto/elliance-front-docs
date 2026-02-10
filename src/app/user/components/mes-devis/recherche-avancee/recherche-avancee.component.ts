import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recherche-avancee',
  templateUrl: './recherche-avancee.component.html',
  styleUrls: ['./recherche-avancee.component.css']
})
export class RechercheAvanceeComponent implements OnInit {
  displayForm = true;
  etats = ['En cours', 'Commande', 'Commande annulée', 'Envoyé', 'Perdu', 'Supprimé'];
  contraintes = ['Contient', 'Egale à', 'Supérieur à', 'Inférieur à'];
  searchForm: FormGroup;

  @Output()
  search: EventEmitter<any> = new EventEmitter()

  constructor() {
    this.searchForm = new FormGroup({
      titre: new FormControl('', []),
      elaborePar: new FormControl('', []),
      commercial: new FormControl('', []),
      etat: new FormControl('', []),
      client: new FormControl('', []),
      clientFacturation: new FormControl('', []),
      dateContrainte: new FormControl('', []),
      dateValeur: new FormControl('', []),
      prixHTContrainte: new FormControl('', []),
      prixHTValeur: new FormControl('', [Validators.min(0)]),
      prixTTCContrainte: new FormControl('', []),
      prixTTCValeur: new FormControl('', [Validators.min(0)])
    })
  }

  ngOnInit(): void {
  }

  resetFilter() {
    this.searchForm.reset();
  }

  emitSearch() {
    this.search.emit(this.searchForm.value)
  }

}
