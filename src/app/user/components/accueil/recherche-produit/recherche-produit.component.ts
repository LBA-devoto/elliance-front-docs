import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { PATHS } from 'src/app/app-routing.module';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { Categorie } from 'src/app/shared/entities/categorie';
import { Produit } from 'src/app/shared/entities/produit';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-recherche-produit',
  templateUrl: './recherche-produit.component.html',
  styleUrls: ['./recherche-produit.component.css']
})
export class RechercheProduitComponent implements OnInit {
  recherche: boolean = false;
  categories: Categorie[] = [];

  searchTerm = '';
  fourTerm = '';
  fourId = '';
  private searchTerm$ = new Subject<string>();    // Pour le debounceTime (delai lors de la saisie)
  private fourTerm$ = new Subject<string>();

  autocompleteSearchList: Produit[] = [];
  autocompleteFournisseurList: any[] = [];

  searchForm: FormGroup;
  lang: string = 'fr_FR';
  controls: string[] = ['Cat', 'Fournisseur', 'Nom', 'Alim', 'PuissanceMin', 'PuissanceMax', 'PoidsMin', 'PoidsMax', 'LongMin', 'LongMax', 'LargMin', 'LargMax', 'HMin', 'HMax']

  @Output()
  result: EventEmitter<any> = new EventEmitter(); // Attribuer un type lorsque la req d'autocomplete sera opérationnelle

  get noCat() {
    return this.categories.length === 0;
  }

  // get noFour() {
  //   return this.fournisseurs.length === 0;
  // }

  constructor(private productService: ProductService, private fournisseurService: FournisseurService, private categoryService: CategoryService, private router: Router) {
    this.setSearchPipe();
    this.setFourPipe();
    this.setControls();
  }

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources() {
    // this.fournisseurService.getAllFournisseurs().then((fours: any) => {
    //   this.fournisseurs = fours;
    //   this.searchForm.controls['Fournisseur'].enable();
    // });
    this.categoryService.getCategories(3,0,1000).then((cats: any) => {
      this.categories = cats;
      this.searchForm.controls['Cat'].enable();
    });
  }

  setControls() {
    let obj: any = {};
    for (let i = 0; i < this.controls.length; i++) {
      obj[this.controls[i]] = new FormControl();
    }
    this.searchForm = new FormGroup(obj);
  }

  getLabel(cat: Categorie) {
    return cat.maplocaletitre[this.lang] ? cat.maplocaletitre[this.lang] : (cat.titre ? cat.titre : cat.id);
  }

  rechercheAvance() {
    this.recherche = !this.recherche;
  }

  // Pour le champ de recherche
  setSearchPipe() {
    this.searchTerm$.pipe(
      debounceTime(300), // 300ms delay
      distinctUntilChanged()
    ).subscribe((searchTerm: string) => {
      if (searchTerm) {
        this.autocomplete(searchTerm)
      } else {
        this.autocompleteSearchList = [];
      }
    });
  }

  // Pour le champ de fournisseur
  setFourPipe() {
    this.fourTerm$.pipe(
      debounceTime(300), // 300ms delay
      distinctUntilChanged()
    ).subscribe((fourTerm: string) => {
      if (fourTerm) {
        this.fournisseurService.getFournisseursAutocomplete(fourTerm).then((res: any) => {
          this.autocompleteFournisseurList = res.content
        })
        // this.autocompleteFournisseurList = this.fournisseurs.filter(el => el.nom.toUpperCase().includes(fourTerm.toUpperCase()));
      } else {
        this.autocompleteFournisseurList = [];
      }
    });
  }

  onSearchInput(): void {
    this.searchTerm$.next(this.searchTerm);
  }

  onFourInput(): void {
    let val = this.searchForm.get('Fournisseur')?.value;
    if (val) {
      this.fourTerm$.next(val);
    }

  }

  autocomplete(term: string) {
    if (term.length >= 3) {
      this.productService.searchProductsByTerm(term).then((res) => {
        this.autocompleteSearchList = res;
      })
    }
  }

  emptyList() {
    setTimeout(() => {
      this.autocompleteSearchList = [];
      this.autocompleteFournisseurList = [];
    }, 300)
  }

  onSearch() {
    this.autocompleteSearchList = [];
    this.autocompleteFournisseurList = [];
    this.result.emit(this.searchTerm);
    this.router.navigate([PATHS.catalogues, `products&search:${this.searchTerm}`]);
  }

  selectItem(item: any) { // select item in aucomplete list
    this.router.navigate([PATHS.product, item.id])
  }

  selectFour(item: any) { // select item in aucomplete list
    this.searchForm.get('Fournisseur')?.setValue(item.nom);
    this.fourId = item.id;
  }

  selectFirst() {
    this.fourTerm = this.autocompleteFournisseurList[0];
  }

  // getCodeFour(nom: string): string {
  //   return this.fournisseurs.find(el => el.nom.toUpperCase() === nom.toUpperCase())?.codefour;
  // }

  // getFourId(nom: string): string {
  //   let id = this.fournisseurs.find(el => el.nom.toUpperCase() === nom.toUpperCase())?.id;
  //   return id ? id : '';
  // }

  getCatId(nom: string): string {
    let id = this.categories.find(el => el.titre.toUpperCase() === nom.toUpperCase())?.id;
    return id ? id : '';
  }

  search() { // Click sur bouton rechercher ou press.enter
    let filterMap = new Map<string, string>(); // Pour stocker les valeurs des inputs non vides

    if (this.searchTerm) this.searchForm.get('Nom')?.setValue(this.searchTerm);

    for (let i = 0; i < this.controls.length; i++) {
      let val = this.searchForm.controls[this.controls[i]].value;
      if (val) {
        if (this.controls[i] == 'Fournisseur') {
          filterMap.set(this.controls[i] + ': ', this.fourId);
        } else {
          filterMap.set(this.controls[i] + ': ', val);
        }
      }
    }

    let standardFilter = Array.from(filterMap).toString(); // stringify
    if (standardFilter != '') {
      localStorage.setItem('filter', standardFilter); // save filter      
    }

    if (this.searchForm.get('Fournisseur')?.value) {
      this.router.navigate([PATHS.catalogues, `fournisseur:${this.searchForm.get('Fournisseur')?.value}`]);
    } else {
      this.router.navigate([PATHS.catalogues, `products&search:${this.searchTerm}`]);
    }
  }

}
