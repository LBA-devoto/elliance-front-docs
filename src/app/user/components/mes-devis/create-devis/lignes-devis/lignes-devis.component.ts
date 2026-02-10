import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { PATHS } from 'src/app/app-routing.module';
import { Produit } from 'src/app/shared/entities/produit';
import { Alert, AlertService, AlertType } from 'src/app/shared/services/alert-service';
import { ProductService } from 'src/app/shared/services/product.service';
import { ModaleOrdreDevisComponent } from './modale-ordre-devis/modale-ordre-devis.component';
@Component({
  selector: 'app-lignes-devis',
  templateUrl: './lignes-devis.component.html',
  styleUrls: ['./lignes-devis.component.css']
})
export class LignesDevisComponent implements OnInit, OnDestroy {
  ref: string = '';
  $ref: Subject<string> = new Subject();
  quantity: number = 1;
  refreshDataSource = false;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  selectedProduct?: Produit;

  displayedColumns = ['check', 'num', 'prod', "prixAchat", "prixVente", 'qte', 'remises', 'ecoPart', 'prixHT', 'tva', 'prixTTC', 'marge'];
  autocompleteSearchList: Produit[] = [];

  separators: any = [];
  subTotals: number[] = [];

  alert?: Alert;
  selectedItems: number[] = [];
  countriesVAT: Map<string, number> = new Map();
  countriesVATarray: any[] = [];
  currentCountry = 'France';

  comment = '';
  remiseTaux = 0;
  remiseMontant = 0;

  percentView = true;

  @Output() selectedLines: EventEmitter<any> = new EventEmitter(); // "Any" en attendant le modèle idéal
  @Output() linesOutput: EventEmitter<any> = new EventEmitter();
  @Output() separatorsEventOut: EventEmitter<any> = new EventEmitter();
  @Output() subTotalsEventOut: EventEmitter<any> = new EventEmitter();
  @Output() totalsEventOut: EventEmitter<any> = new EventEmitter();
  @Input() linesInput: Subject<Produit[]>;
  @Input() switch: boolean = true;
  @Input() separatorsEvent: EventEmitter<any> = new EventEmitter();
  @Input() subTotalsEvent: EventEmitter<any> = new EventEmitter();

  draggedIndex: number | null = null;

  get hasData() {
    return this.refreshDataSource ? false : this.dataSource?.data.length > 0;
  }

  get productIsPresent() {
    return this.dataSource.data.map(el => el.id).includes(this.selectedProduct?.id)
  }

  get totalHT() {
    let sum = 0;
    this.dataSource.data.forEach((el, i) => {
      sum += this.getTotalPrixHT(i)
    })
    return sum * (1 - this.remiseTaux / 100) - this.remiseMontant
  }

  get totalTTC() {
    let sum = 0;
    this.dataSource.data.forEach((el, i) => {
      sum += this.getTotalPrixTTC(i)
    })
    return sum * (1 - this.remiseTaux / 100) - this.remiseMontant
    // return this.dataSource.data.map(el => el.prixVente * el.quantite).reduce((accumulator, currentValue) => accumulator + currentValue) * (1 - this.remiseTaux / 100) - this.remiseMontant
  }

  get tauxTVA() {
    return this.countriesVAT.get(this.currentCountry);
  }

  get totalTVA() {
    let sum = 0;
    this.dataSource.data.forEach((el, i) => {
      sum += this.getValeurTVA(i) * el.quantite
    })
    return sum
  }

  get totalMarge() {
    return this.totalTTC - this.totalAchat
  }

  get totalAchat() {
    let sum = 0;
    this.dataSource.data.forEach((el) => {
      sum += el.prixAchat * el.quantite
    })
    return sum
  }

  get totalEcoPart() {
    let sum = 0;
    this.dataSource.data.forEach((el) => {
      sum += el.ecoPart * el.quantite
    })
    return sum
  }

  get countriesMap() {
    return this.countriesVATarray
  }

  get allSelected() {
    return this.selectedItems.length == this.dataSource.data.length
  }

  get isSwitchActive() {
    return this.switch
  }

  constructor(private productService: ProductService, private alertService: AlertService, private decimalPipe: DecimalPipe, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadDataSource();
    this.setSearchPipe();
    this.loadCountriesVATmap();
  }

  loadDataSource() {
    let ds = localStorage.getItem('ds-data');
    let dsSep = localStorage.getItem('ds-data-sep');
    let dsSubs = localStorage.getItem('ds-data-sub-total');
    this.dataSource.data = ds ? JSON.parse(ds) : [];
    this.separators = dsSep ? JSON.parse(dsSep) : [];
    this.subTotals = dsSubs ? JSON.parse(dsSubs).sort((a: number, b: number) => a - b) : [];

    this.refreshDS();

    this.linesInput.subscribe((lines: any) => {
      this.dataSource.data = lines;
      this.refreshDS();
    })

    this.separatorsEvent.subscribe((sep: any) => {
      this.separators = sep;
      this.refreshDS();
    })

    this.subTotalsEvent.subscribe((sub: any) => {
      this.subTotals = sub;
      this.refreshDS();
    })
  }

  loadCountriesVATmap() {
    this.countriesVAT.set('France', 20);
    this.countriesVAT.set('Belgique', 21);
    this.countriesVAT.set('Bulgarie', 20);
    this.countriesVAT.set('République Tchèque', 21);
    this.countriesVAT.set('Danemark', 25);
    this.countriesVAT.set('Allemagne', 19);
    this.countriesVAT.set('Grèce', 23);
    this.countriesVAT.set('Estonie', 20);
    this.countriesVAT.set('Espagne', 21);
    this.countriesVAT.set('Croatie', 25);
    this.countriesVAT.set('Irlande', 23);
    this.countriesVAT.set('Italie', 22);
    this.countriesVAT.set('Chypre', 19);
    this.countriesVAT.set('Lettonie', 21);
    this.countriesVAT.set('Lituanie', 21);
    this.countriesVAT.set('Luxembourg', 17);
    this.countriesVAT.set('Hongrie', 27);
    this.countriesVAT.set('Malte', 18);
    this.countriesVAT.set('Pays Bas', 21);
    this.countriesVAT.set('Autriche', 20);
    this.countriesVAT.set('Pologne', 23);
    this.countriesVAT.set('Portugal', 23);
    this.countriesVAT.set('Roumanie', 19);
    this.countriesVAT.set('Slovénie', 22);
    this.countriesVAT.set('Slovaquie', 20);
    this.countriesVAT.set('Finlande', 24);
    this.countriesVAT.set('Suède', 25);
    this.countriesVAT.set('Royaume Uni', 20);
    this.countriesVATarray = Array.from(this.countriesVAT.entries());
  }

  add(incr: 1 | -1) {
    incr == 1 ? this.quantity++ : this.quantity--;
    if (this.quantity < 1) this.quantity = 1;
  }

  selectLine(dataSourceIndex: number) {
    if (!this.switch) {
      if (this.selectedItems.includes(dataSourceIndex)) {
        this.selectedItems = this.selectedItems.filter((el) => el !== dataSourceIndex)
      } else {
        this.selectedItems.push(dataSourceIndex)
      }

      this.emitSelectedLines();
    }
  }


  emitSelectedLines() {
    let lines: any = [];
    this.selectedItems.forEach(el => {
      lines.push(this.dataSource.data[el]);
    })

    this.selectedLines.emit(lines);
  }

  search(event: any) {
    this.$ref.next(event.target.value);
  }

  autocomplete(term: string) {
    if (term.length >= 3) {
      this.productService.searchProductsByTerm(term).then((res: any) => {
        this.autocompleteSearchList = res;
      })
    }
  }

  openDevisOrden() {
    this.dialog.open(ModaleOrdreDevisComponent, { data: { lines: this.dataSource.data, separators: this.separators, subtotals: this.subTotals } }).afterClosed().subscribe((res) => {
      if (res) {
        if (res.lines) {
          this.dataSource.data = res.lines;
        }
        if (res.separators) {
          this.separators = res.separators
        }
        if (res.subtotals) {
          this.subTotals = res.subtotals
        }
        this.refreshDS()
      }
    })
  }


  // Pour le champ de recherche
  setSearchPipe() {
    this.$ref.pipe(
      debounceTime(300), // 300ms delay
      distinctUntilChanged()
    ).subscribe((searchTerm: string) => {
      this.selectedProduct = undefined;
      if (searchTerm) {
        this.autocomplete(searchTerm)
      } else {
        this.autocompleteSearchList = [];
      }
    });
  }

  selectProduct(prod: any) {
    this.selectedProduct = prod;
    if (prod.nom) this.ref = prod.nom;
    this.autocompleteSearchList = [];
  }

  addProduct(index?: number) {
    if (this.selectedProduct?.id)
      this.productService.getProductById(this.selectedProduct?.id).then((prod) => {
        this.selectedProduct = prod;

        let line = {
          id: this.selectedProduct?.id,
          num: null,
          ref: this.selectedProduct?.reference,
          image: '/assets/images/image_produit.png',
          titre: this.selectedProduct?.nom,
          description: this.selectedProduct?.description,
          prixAchat: this.selectedProduct?.prixachat,
          approche: this.selectedProduct?.accroche,
          coefMarge: null,
          prixVente: this.selectedProduct?.prixpublique,
          prixCoef: null, // prix coef ?
          prixPublic: this.selectedProduct?.prixpublique,
          quantite: this.quantity,
          remises: { taux: 0, montant: 0 },
          ecoPart: this.selectedProduct?.ecoparticipation,
          // prixHT: Math.round(100 * (this.selectedProduct?.prixpublique / (1 + (this.selectedProduct?.tva / 100)))) / 100,
          // prixTTC: this.selectedProduct?.prixpublique,
          // prixHT: this.selectedProduct?.prixpublique,
          // prixTTC: this.selectedProduct?.prixpublique * (1 + this.selectedProduct?.tva/100),
          // marge: this.selectedProduct?.prixpublique - this.selectedProduct?.prixachat,
          tva: this.selectedProduct?.tva
        }

        if (index != undefined) {
          this.dataSource.data.splice(index, 0, line);
        } else {
          this.dataSource.data.push(line);
        }
        this.refreshDS();
      }).catch(() => {
        this.alert = new Alert(AlertType.DANGER, `Une erreur s'est produite lors de l'ajout du produit`);
        setTimeout(() => {
          this.alert = undefined;
        }, this.alertService.alertDuration)
      })
  }

  refreshDS() {
    this.refreshDataSource = true;

    setTimeout(() => {
      localStorage.setItem('ds-data', JSON.stringify(this.dataSource.data));
      localStorage.setItem('ds-data-sep', JSON.stringify(this.separators));
      localStorage.setItem('ds-data-sub-total', JSON.stringify(this.subTotals));


      this.selectedItems = [];
      this.ref = '';
      this.selectedProduct = undefined;
      this.linesOutput.emit(this.dataSource.data);
      this.selectedLines.emit(this.selectedItems);
      this.totalsEventOut.emit(this.getTotals())
      this.refreshDataSource = false;
      this.displaySeparators();
      this.displaySubTotals();
    }, 50)
  }

  getTotals() {
    return {
      comment: this.comment,
      remiseTaux: this.remiseTaux,
      remiseMontant: this.remiseMontant,
      totalHT: this.totalHT,
      ecoPart: this.totalEcoPart,
      pays: this.currentCountry,
      tva: this.tauxTVA,
      totalTTC: this.totalTTC,
      marge: this.totalMarge
    }
  }

  saveTotals() {
    this.totalsEventOut.emit(this.getTotals())
  }

  removeSeparator(num: number) {
    this.separators = this.separators.filter((el: any) => el.index !== num);
    this.separatorsEventOut.emit(this.separators);
  }

  removeSubTotal(num: number) {
    this.subTotals = this.subTotals.filter((el: any) => el !== num);
    this.subTotalsEventOut.emit(this.subTotals);
  }

  displaySeparators() {
    setTimeout(() => {
      this.separators.forEach((sep: { index: number, text: string }) => {
        let row = document.getElementById('table-row-' + sep.index);
        let newEl = document.createElement('tr');
        let newElRef = document.createElement('tr');
        let closeBtn = document.createElement('mat-icon');
        closeBtn.innerHTML = 'close';
        closeBtn.id = sep.index.toString();
        closeBtn.classList.add(...['mat-icon', 'material-icons', 'sep-icon'])
        closeBtn.addEventListener('click', () => {
          this.removeSeparator(parseInt(closeBtn.id))
        })

        // Create up button
        if (sep.index > 1) {
          let upBtn = document.createElement('mat-icon');
          upBtn.innerHTML = 'arrow_upward';
          upBtn.id = sep.index.toString();
          upBtn.classList.add(...['mat-icon', 'material-icons', 'sep-icon', 'up-icon'])
          upBtn.addEventListener('click', () => {
            this.moveSeparatorIndex(parseInt(upBtn.id), true)
          })
          newElRef.appendChild(upBtn);
        }

        // Create down button
        if (sep.index < this.dataSource.data.length) {
          let downBtn = document.createElement('mat-icon');
          downBtn.innerHTML = 'arrow_downward';
          downBtn.id = sep.index.toString();
          downBtn.classList.add(...['mat-icon', 'material-icons', 'sep-icon', 'down-icon'])
          downBtn.addEventListener('click', () => {
            this.moveSeparatorIndex(parseInt(downBtn.id), false)
          })
          newElRef.appendChild(downBtn);
        }

        newEl.innerHTML = sep.text;
        newEl.classList.add('devisSeparator');

        newElRef.appendChild(newEl);
        newElRef.appendChild(closeBtn);
        newElRef.classList.add('devisSeparatorRef');
        row?.insertAdjacentElement('afterend', newElRef)
      })
    }, 50)
  }

  getPrixUnitaireHT(index: number) {
    return this.dataSource.data[index].prixVente + this.dataSource.data[index].ecoPart;
  }

  getPrixUnitaireTTC(index: number) {
    return this.getPrixUnitaireHT(index) + this.getValeurTVA(index);
  }

  getValeurTVA(index: number) {
    let res = this.dataSource.data[index].prixVente * this.dataSource.data[index].tva / 100;
    return Math.round(res * 100) / 100;
  }

  getTotalRemises(index: number) {
    let res = (this.dataSource.data[index].prixVente * this.dataSource.data[index].remises.taux / 100) + this.dataSource.data[index].remises.montant;
    return Math.round(res * 100) / 100;
  }

  getTotalPrixHT(index: number) {
    return (this.getPrixUnitaireHT(index) - this.getTotalRemises(index)) * this.dataSource.data[index].quantite;
  }

  getTotalPrixTTC(index: number) {
    return (this.getPrixUnitaireTTC(index) - this.getTotalRemises(index)) * this.dataSource.data[index].quantite;
  }

  getMarge(index: number) {
    return (this.getPrixUnitaireTTC(index) - this.dataSource.data[index].prixAchat) * this.dataSource.data[index].quantite;
  }

  getPercentMarge(index: number) {
    let res = this.getPrixUnitaireTTC(index) / this.dataSource.data[index].prixAchat * 100
    return Math.round(res);
  }


  displaySubTotals() {
    setTimeout(() => {
      this.subTotals.forEach((sub: number, i: number) => {
        let row = document.getElementById('table-row-' + sub);
        let newEl = document.createElement('tr');
        let newElRef = document.createElement('tr');

        // Create close button
        let closeBtn = document.createElement('mat-icon');
        closeBtn.innerHTML = 'close';
        closeBtn.id = sub.toString();
        closeBtn.classList.add(...['mat-icon', 'material-icons', 'sep-icon'])
        closeBtn.addEventListener('click', () => {
          this.removeSubTotal(parseInt(closeBtn.id))
        })


        // Create up button
        if (sub > 1) {
          let upBtn = document.createElement('mat-icon');
          upBtn.innerHTML = 'arrow_upward';
          upBtn.id = sub.toString();
          upBtn.classList.add(...['mat-icon', 'material-icons', 'sep-icon', 'up-icon'])
          upBtn.addEventListener('click', () => {
            this.moveSubTotalIndex(parseInt(upBtn.id), true)
          })
          newElRef.appendChild(upBtn);
        }

        // Create down button
        if (sub < this.dataSource.data.length) {
          let downBtn = document.createElement('mat-icon');
          downBtn.innerHTML = 'arrow_downward';
          downBtn.id = sub.toString();
          downBtn.classList.add(...['mat-icon', 'material-icons', 'sep-icon', 'down-icon'])
          downBtn.addEventListener('click', () => {
            this.moveSubTotalIndex(parseInt(downBtn.id), false)
          })
          newElRef.appendChild(downBtn);
        }

        newEl.innerHTML = `SOUS-TOTAL : ${this.getSubTotal(sub, this.subTotals[i - 1])} - MARGE TOTALE : ${this.getSubMargin(sub, this.subTotals[i - 1])}`;
        newEl.classList.add('devisSubTotal');

        newElRef.appendChild(newEl);
        newElRef.appendChild(closeBtn);

        newElRef.classList.add('devisSubTotalRef');
        row?.insertAdjacentElement('afterend', newElRef)
      })
    }, 50)
  }

  moveSeparatorIndex(index: number, up: boolean) {
    this.separators = this.separators.map((el: any) => {
      if (el.index === index) {
        el.index += (up ? -1 : 1)
        return el
      } else {
        return el
      }
    })

    this.refreshDS();
  }

  moveSubTotalIndex(index: number, up: boolean) {
    this.subTotals = this.subTotals.map(el => {
      if (el === index) {
        return el + (up ? -1 : 1)
      } else {
        return el
      }
    })

    this.refreshDS();
  }


  getSubTotal(to: number, from: number) {
    if (from === undefined) from = 0;


    let el = this.separators.find((el: any) => el.index > from && el.index < to)
    if (el) {
      from = el.index
    }

    let total = 0;
    let tab = this.dataSource.data.slice(from, to);
    tab.forEach((el, i) => {
      total += this.getTotalPrixTTC(i + from);
    })

    return `${this.decimalPipe.transform(total, '0.2')}€`
  }

  getSubMargin(to: number, from: number) {
    if (from === undefined) from = 0;

    let el = this.separators.find((el: any) => el.index > from && el.index < to)
    if (el) {
      from = el.index
    }

    let total = 0;
    let tab = this.dataSource.data.slice(from, to);
    tab.forEach((el, i) => {
      total += this.getMarge(i + from);
    })

    return `${this.decimalPipe.transform(total, '0.2')}€`
  }

  isSeparator(index: number) {
    return this.separators.map((el: { index: number, text: string }) => el.index).includes(index)
  }

  scrollDown() {
    window.scroll({ top: 999999, behavior: 'smooth' });
    setTimeout(() => {
    }, 100)
  }

  changePays(event: any) {
    if (event.isUserInput) {
      this.currentCountry = event.source.value;
    }
  }

  lineChecked(index: number) {
    return this.selectedItems.includes(index);
  }

  dropRow(event: any) {
    let arr = this.dataSource.data;
    let el = arr[event.previousIndex];
    arr.splice(event.previousIndex, 1);
    arr.splice(event.currentIndex, 0, el);
    this.refreshDS();
  }

  move(index: number, event: any) {
    let val = parseInt(event.target.value);
    if (!(index == val || index < 1 || index > this.dataSource.data.length)) {
      let event = { previousIndex: index - 1, currentIndex: val - 1 };
      this.dropRow(event);
    }
  }

  selectAll() {
    if (this.allSelected) {
      this.selectedItems = [];
    } else {
      this.selectedItems = [...Array(this.dataSource.data.length).keys()];
    }
    this.emitSelectedLines();
  }

  goToProduct(element: any) {
    if (element.id) {
      this.router.navigate([`/${PATHS.product}/${element.id}`])
    }
  }

  ngOnDestroy(): void {

  }
}
