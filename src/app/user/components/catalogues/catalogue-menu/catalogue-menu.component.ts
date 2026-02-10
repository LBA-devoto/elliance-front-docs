import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { Categorie } from 'src/app/shared/entities/categorie';
import { Personnemorale } from 'src/app/shared/entities/personnemorale';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-catalogue-menu',
  templateUrl: './catalogue-menu.component.html',
  styleUrls: ['./catalogue-menu.component.css'],
  providers: [],
})
export class CatalogueMenuComponent implements OnInit {
  @Input()
  filtres: string[] = [];

  @Input()
  vueFournisseur: boolean = false;
  @Input()
  extranetFournisseur: boolean = false;
  @Input()
  fournisseurx: Personnemorale;

  selectable = true;
  removable = true;
  addOnBlur = true;

  categorie = true;
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
  lang = 'fr_FR';

  alimentations: string[] = ['Électrique', 'Gaz'];
  categories: Categorie[] = [];
  fournisseurs: any[] = [];

  arborescenceCategories: Map<string, Categorie[]> = new Map();
  openCats: string[] = [];

  // Autocomplete pour les fournisseurs
  searchTerm = '';
  private searchTerm$ = new Subject<string>(); // Pour le debounceTime (delai lors de la saisie)
  autocompleteList: any[] = [];

  get depth1cat(): Categorie[] {
    let cats = this.arborescenceCategories.get('depth1');
    return cats ? cats : [];
  }

  @Output()
  filterOut: EventEmitter<string[]> = new EventEmitter();

  constructor(
    private categoryService: CategoryService,
    private fournisseurService: FournisseurService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.setSearchPipe();
    this.getFournisseur();
    this.filtres = Array.from(new Set([...this.filtres]));
  }

  getFournisseur() {
    if (this.vueFournisseur) {
      let id = this.filtres.find((el) => el.includes('Fournisseur'))?.split(':')?.[1]?.trim();
      if (id) {
        this.fournisseurService.getFournisseurById(id).then((res: any) => {
          this.fournisseur = res;
        })
      }

    }
  }

  setSearchPipe() {
    this.searchTerm$
      .pipe(
        debounceTime(300), // 300ms delay
        distinctUntilChanged()
      )
      .subscribe((searchTerm: string) => {
        this.fournisseurService.getFournisseursAutocomplete(searchTerm).then((resp: any) => {
          this.autocompleteList = resp.content;
        })
      });
  }

  onSearchInput() {
    this.searchTerm$.next(this.searchTerm);
  }

  disableList() {
    setTimeout(() => {
      this.autocompleteList = [];
    }, 200);
  }

  loadCategories() {
    this.categoryService.getCategories(3, 0, 1000).then((cats: any) => {
      this.categories = cats;
      this.sortCategories();
    });
  }

  sortCategories() {
    this.arborescenceCategories.set('depth1', []);
    this.arborescenceCategories.set('depth2', []);
    this.arborescenceCategories.set('depth3', []);
    this.categories.forEach((cat) => {
      if (cat.depth === 3) {
        let val = this.arborescenceCategories.get('depth3');
        this.arborescenceCategories.set('depth3', val ? val.concat([cat]) : []);
      } else if (cat.depth === 2) {
        let val = this.arborescenceCategories.get('depth2');
        this.arborescenceCategories.set('depth2', val ? val.concat([cat]) : []);
      }
      if (cat.depth === 1) {
        let val = this.arborescenceCategories.get('depth1');
        this.arborescenceCategories.set('depth1', val ? val.concat([cat]) : []);
      }
    });
    this.setOpenCats()
  }

  setOpenCats() {
    let catId = this.filtres.find(el => el.includes('Cat:'))?.split(':')?.[1]?.trim();
    let cat = this.categories.find(el => el.id === catId);
    if (cat?.depth === 3) {
      let cat2 = this.categories.find(el => el.id === cat?.pereid);
      let cat2name = cat2?.maplocaletitre?.[this.lang];
      let cat1name = this.categories.find(el => el.id === cat2?.pereid)?.maplocaletitre?.[this.lang];
      this.openCats.push(cat1name);
      this.openCats.push(cat2name);
    } else if (cat?.depth === 2) {
      let name = this.categories.find(el => el.id === cat?.pereid)?.maplocaletitre?.[this.lang];
      this.openCats.push(name);
    }

  }

  displayChip(chip: string) {
    if (chip.includes('Fournisseur')) {
      if (this.fournisseurx) {
        return `Fournisseur: ${this.fournisseurx?.nom ? this.fournisseurx?.nom : this.fournisseurx?.enseigne}`
      } else {
        let arr = window.location.pathname.split(':');
        let name = arr[arr.length - 1].trim();
        return `Fournisseur: ${name}`
      }

    } else if (chip.includes('Cat:')) {
      let id = chip.split(':')?.[1].trim();
      let el = this.categories.find(el => el.id == id);
      if (el) {
        return `Cat: ${el.maplocaletitre[this.lang] ? el.maplocaletitre[this.lang] : (el.titre ? el.titre : id)}`
      } else {
        return chip
      }
    } else {
      return chip
    }
  }

  depth2cat(pereId: string) {
    return this.arborescenceCategories
      .get('depth2')
      ?.filter((el) => el.pereid == pereId)
  }

  depth3cat(pereId: string) {
    return this.arborescenceCategories
      .get('depth3')
      ?.filter((el) => el.pereid == pereId);
  }

  loadFournisseurs(tries: number) {
    if (tries > 0) {
      this.fournisseurService
        .getAllFournisseurs()
        .then((four: any) => (this.fournisseurs = four))
        .catch(() => {
          this.loadFournisseurs(tries - 1);
        });
    }
  }

  saveFilter(
    event: any,
    section: string,
    minmax?: 'min' | 'max',
    unity?: '€' | 'mm' | 'cm' | 'kg' | 'W'
  ) {
    if (event.target) {
      // input text ou number
      if (event.target.value != '') {
        // input with data
        let index = this.indexOfExistingElement(
          `${section}:${minmax ? (minmax == 'min' ? '>' : '<') : ''}`
        );
        // If index == -1, element doesn't exist in this.filtres;
        // Otherwise, it exists at this.filtres[index];
        if (index == -1) {
          this.filtres.push(
            `${section}:${minmax ? (minmax == 'min' ? '>' : '<') : ''}${event.target.value}${unity ? unity : ''}`
          );
          this.filterOut.emit(this.filtres);
        } else {
          this.filtres[index] = `${section}:${minmax ? (minmax == 'min' ? '>' : '<') : ''}${event.target.value}${unity ? unity : ''}`;
          this.filterOut.emit(this.filtres);
        }
      } else {
        // empty input
        let index = this.indexOfExistingElement(
          `${section}:${minmax ? (minmax == 'min' ? '>' : '<') : ''}`
        );
        if (index != -1) {
          // exists in this.filtres
          this.filtres.splice(index, 1);
          this.filterOut.emit(this.filtres);
        }
      }
    } else if (event.source) {
      // input checkbox (pour l'alimentation) ou radio pour les catégories
      if (event.value) {
        // radio (categories)
        this.filtres = this.filtres.filter((el) => !el.includes(`${section}`));
        this.filtres.push(`${section}:${event.value.replace('/', '-')}`);
        this.filterOut.emit(this.filtres);
      } else {
        // checkbox (alimentation)
        let alim = event.source.name.includes('lectr') ? 'Électrique' : 'Gaz';
        event.checked
          ? this.filtres.push(`${section}:${alim}`)
          : (this.filtres = this.filtres.filter((el) => !el.includes(alim)));
        this.filterOut.emit(this.filtres);
      }
    }
  }

  saveFournisseur(id: string) {
    this.filtres = this.filtres.filter((el) => !el.includes('Fournisseur'));
    this.filtres.push(`Fournisseur: ${id}`);
    this.filterOut.emit(this.filtres);
  }

  indexOfExistingElement(text: string): number {
    return this.filtres.findIndex((el) => el.includes(text));
  }

  remove(value: any) {
    const index = this.filtres.indexOf(value);
    if (index >= 0) {
      this.filtres.splice(index, 1);
      this.filterOut.emit(this.filtres);
    }
  }

  isAlimChecked(alim: string): boolean {
    return this.filtres.includes('Alim:' + alim);
  }

  isCatChecked(cat: string): boolean {
    let fil = this.filtres.filter((el) => el.includes('Cat'));
    if (fil && fil[0]) {
      let arr = fil[0].split(':');
      return cat == arr[1].trim()
    }

    return this.filtres.includes('Cat: ' + cat) || this.filtres.includes('Cat:' + cat) || this.filtres.includes('Cat:,' + cat) || this.filtres.includes('Cat: ,' + cat);
  }

  isCatOpened(cat: string): boolean {
    return this.openCats.includes(cat);
  }

  clickCat(cat: string) {
    if (this.openCats.includes(cat)) {
      this.openCats = this.openCats.filter((el) => el !== cat);
    } else {
      this.openCats.push(cat);
    }
  }

  resetFilter() {
    localStorage.removeItem('filter');
    this.filtres = [];
    this.searchTerm = '';
    this.categorie = false;
    this.fournisseur = false;
    this.tarifPublic = false;
    this.alimentation = false;
    this.puissance = false;
    this.poids = false;
    this.longueur = false;
    this.largeur = false;
    this.hauteur = false;
    this.filterOut.emit(this.filtres);
  }
}
