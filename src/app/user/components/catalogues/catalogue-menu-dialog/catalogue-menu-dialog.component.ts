import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { Categorie } from 'src/app/shared/entities/categorie';
import { Personnemorale } from 'src/app/shared/entities/personnemorale';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-catalogue-menu-dialog',
  templateUrl: './catalogue-menu-dialog.component.html',
  styleUrls: ['./catalogue-menu-dialog.component.css']
})
export class CatalogueMenuDialogComponent implements OnInit {
  filtres: string[] = [];
  vueFournisseur: boolean = false;
  extranetFournisseur: boolean = false;

  selectable = true;
  removable = true;
  addOnBlur = true;

  categorie = false;
  fournisseur = false;
  tarifPublic = false;
  alimentation = false;
  puissance = false;
  poids = false;
  longueur = false;
  largeur = false;
  hauteur = false;
  marque = false;
  prixAchat = false;

  alimentations: string[] = ["Électrique", "Gaz"];
  categories: Categorie[] = [];
  fournisseurs: Personnemorale[] = [];

  arborescenceCategories: Map<string, Categorie[]> = new Map();
  openCats: string[] = [];

  // Autocomplete pour les fournisseurs
  searchTerm = '';
  private searchTerm$ = new Subject<string>(); // Pour le debounceTime (delai lors de la saisie)
  autocompleteList: any[] = [];

  @Output()
  filterOut: EventEmitter<string[]> = new EventEmitter();

  get depth1cat(): Categorie[] {
    let cats = this.arborescenceCategories.get('depth1')
    return cats ? cats : [];
  }


  constructor(private router: Router, private categoryService: CategoryService, private fournisseurService: FournisseurService, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<CatalogueMenuDialogComponent>) {
    this.filtres = data.filtre
    this.vueFournisseur = data.vueFournisseur
    this.extranetFournisseur = data.extranetFournisseur
  }

  ngOnInit(): void {
    // this.loadCategories();
    // this.loadFournisseurs(2);
    this.setSearchPipe();

    this.dialogRef.beforeClosed().subscribe(() => {
      this.validate();
    })
  }

  setSearchPipe() {
    this.searchTerm$.pipe(
      debounceTime(300), // 300ms delay
      distinctUntilChanged()
    ).subscribe((searchTerm: string) => {

      if (searchTerm) {
        this.autocompleteList = this.fournisseurs.filter(el => el.nom?.toUpperCase()?.includes(searchTerm.toUpperCase()))
      } else {
        this.autocompleteList = [];
      }
    });
  }

  onSearchInput() {
    this.searchTerm$.next(this.searchTerm)
  }

  disableList() {
    setTimeout(() => {
      this.autocompleteList = []
    }, 200)
  }


  // loadCategories() {
  //   this.categoryService.getCategories(3, 0, 1000).then((cats) => {
  //     this.categories = cats;
  //     this.sortCategories();
  //   })
  // }


  // sortCategories() {
  //   this.arborescenceCategories.set('depth1', []);
  //   this.arborescenceCategories.set('depth2', []);
  //   this.arborescenceCategories.set('depth3', []);
  //   this.categories.forEach(cat => {
  //     if (cat.depth === 3) {
  //       let val = this.arborescenceCategories.get('depth3');
  //       this.arborescenceCategories.set('depth3', val ? val.concat([cat]) : []);
  //     }
  //     else if (cat.depth === 2) {
  //       let val = this.arborescenceCategories.get('depth2');
  //       this.arborescenceCategories.set('depth2', val ? val.concat([cat]) : []);
  //     } if (cat.depth === 1) {
  //       let val = this.arborescenceCategories.get('depth1');
  //       this.arborescenceCategories.set('depth1', val ? val.concat([cat]) : []);
  //     }
  //   })

  // }
  
  depth2cat(code: string) {
    return this.arborescenceCategories.get('depth2')?.filter(el => new RegExp(`^${code}`).test(el.code));
  }
  
  depth3cat(code: string) {
    return this.arborescenceCategories.get('depth3')?.filter(el => new RegExp(`^${code}`).test(el.code));
  }

  // loadFournisseurs(tries: number) {
  //   if (tries > 0) {
  //     this.fournisseurService.getAllFournisseurs()
  //       .then((four: any) => this.fournisseurs = four)
  //       .catch(() => {
  //         this.loadFournisseurs(tries - 1);
  //       })
  //   }
  // }

  saveFilter(event: any, section: string, minmax?: 'min' | 'max', unity?: '€' | 'mm' | 'cm' | 'kg' | 'W') {
    if (event.target) {  // input text ou number
      if (event.target.value != '') { // input with data
        let index = this.indexOfExistingElement(`${section}${minmax ? minmax == 'min' ? '>' : '<' : ':'}`);
        // If index == -1, element doesn't exist in this.filtres;
        // Otherwise, it exists at this.filtres[index];
        if (index == -1) {
          this.filtres.push(`${section}${minmax ? minmax == 'min' ? '>' : '<' : ':'}${event.target.value}${unity ? unity : ''}`);
          this.filterOut.emit(this.filtres)
        } else {
          this.filtres[index] = `${section}${minmax ? minmax == 'min' ? '>' : '<' : ':'}${event.target.value}${unity ? unity : ''}`;
          this.filterOut.emit(this.filtres)
        }
      } else {  // empty input
        let index = this.indexOfExistingElement(`${section}${minmax ? minmax == 'min' ? '>' : '<' : ':'}`);
        if (index != -1) { // exists in this.filtres
          this.filtres.splice(index, 1);
          this.filterOut.emit(this.filtres)
        }
      }
    } else if (event.source) { // input checkbox (pour l'alimentation) ou radio pour les catégories
      if (event.value) { // radio (categories)
        this.filtres = this.filtres.filter(el => !el.includes(`${section}`));
        this.filtres.push(`${section}:${event.value.replace('/', '-')}`);
        this.filterOut.emit(this.filtres)
      } else { // checkbox (alimentation)
        let alim = event.source.name.includes('lectr') ? 'Électrique' : 'Gaz';
        event.checked ? this.filtres.push(`${section}:${alim}`) : this.filtres = this.filtres.filter((el) => !el.includes(alim));
        this.filterOut.emit(this.filtres)
      }

    }
  }

  saveFournisseur(name: string) {
    this.filtres = this.filtres.filter(el => !el.includes('Fournisseur'));
    this.filtres.push(`Fournisseur: ${name}`);
    // this.router.navigate([PATHS.catalogues, 'fournisseur:' + name]);
    this.filterOut.emit(this.filtres);
  }

  indexOfExistingElement(text: string): number {
    return this.filtres.findIndex(el => el.includes(text));
  }

  remove(value: any) {
    const index = this.filtres.indexOf(value);
    if (index >= 0) {
      this.filtres.splice(index, 1);
      this.filterOut.emit(this.filtres)
    }
  }

  isAlimChecked(alim: string): boolean {
    return this.filtres ? this.filtres.includes('Alim:' + alim) : false;
  }

  isCatChecked(cat: string): boolean {
    return this.filtres ? this.filtres.includes('Cat:' + cat) : false;
  }

  isCatOpened(cat: string): boolean {
    return this.openCats.includes(cat);
  }

  clickCat(cat: string) {
    if (this.openCats.includes(cat)) {
      this.openCats = this.openCats.filter(el => el !== cat);
    } else {
      this.openCats.push(cat);
    }
  }


  resetFilter() {
    localStorage.removeItem('filter');
    this.filtres = [];
    this.searchTerm = ''
    this.categorie = false;
    this.fournisseur = false;
    this.tarifPublic = false;
    this.alimentation = false;
    this.puissance = false;
    this.poids = false;
    this.longueur = false;
    this.largeur = false;
    this.hauteur = false;
    this.filterOut.emit(this.filtres)
  }

  validate() {
    this.dialogRef.close(this.filtres);
  }
}
