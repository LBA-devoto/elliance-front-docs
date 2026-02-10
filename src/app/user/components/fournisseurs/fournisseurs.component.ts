import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { EntityService } from 'src/app/admin/core/services/entity.service';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { Personnemorale } from 'src/app/shared/entities/personnemorale';
import { ExportService } from 'src/app/shared/services/export.service';

@Component({
  selector: 'app-fournisseurs',
  templateUrl: './fournisseurs.component.html',
  styleUrls: ['./fournisseurs.component.css']
})
export class FournisseursComponent implements OnInit {
  loaded = false;
  champs: any[] = [];

  fournisseurss: Personnemorale[] = [];
  displayedFournisseurs: Personnemorale[] = [];
  associes: Personnemorale[] = []
  results: Personnemorale[] = []
  nbFournisseurs: number;
  nbAssocies: number;
  recherche: string = '';
  math = Math;
  delayAnim = 1000; //ms
  private searchTerm$ = new Subject<string>(); // Pour le debounceTime (delai lors de la saisie)

  // Paginator
  paginatorValues = [21, 42, 84];
  paginatorSize = this.paginatorValues[0];
  paginatorIndex = 0;
  paginatorLength = 0;
  paginatorSubject = new Subject();

  tabIndex = 0;

  constructor(private fournisseurService: FournisseurService, private exportService: ExportService, private entityService: EntityService) { }

  ngOnInit(): void {
    this.setSearchTerm();
    this.getChampsFournisseurs();
    this.loadFournisseurs(2);
  }

  setSearchTerm() {
    this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((term) => {
      if (term == '') {
        this.results = [];
        this.loadFournisseurs(2);
      } else {
        this.fournisseurService.getFournisseursAutocomplete(term).then((res: any) => {
          this.results = res.content;
        })
      }
    })
  }

  getChampsFournisseurs() {    
    const entite = 'personnemorale';
    try {
      this.entityService.recouperChampsdEntite(entite).then((res) => {
        this.champs = res;
        this.entityService.setReqMap(entite, res);
      }).catch(() => {        
        setTimeout(() => {
          this.getChampsFournisseurs();
        }, 500);
      })
    } catch (error) {
      console.error('Error getting entity fields:', error);
    }
  }

  loadFournisseurs(tries: number) {
    if (tries > 0) {
      this.fournisseurService.getFournisseurs(this.paginatorIndex, this.paginatorSize).then((fournisseurs: any) => {        
        this.fournisseurss = fournisseurs.personnemorale;
        this.paginatorLength = fournisseurs.totalItems;
      }).catch(() => {
        this.loadFournisseurs(tries - 1);
      })
    }
  }

  onsearcheFours() {
    this.searchTerm$.next(this.recherche);
  }

  export() {
    this.exportService.exportFournisseurs('xlsx', ['fr_FR'])
  }

  goTo(id: string) {
    this.fournisseurService.getFournisseurById(id).then((res: any) => {
      this.fournisseurss = [res];
      this.paginatorIndex = 0;
      this.paginatorLength = 1;
    })
  }

  displayfournisseur(value: number) {
    this.nbFournisseurs = value
  }

  displayResult(event: any) {
    this.recherche = event;
  }

  paginatorChange(event: any) {
    this.paginatorIndex = event.pageIndex;
    this.paginatorSize = event.pageSize;

    this.loadFours();
  }


  loadFours() {
    if (this.recherche !== '') {
      this.onsearcheFours()
    } else {
      this.loadFournisseurs(2);
    }
  }

  changeTab(event: any) {
    this.tabIndex = event.index;
    this.paginatorIndex = 0;
    this.paginatorSize = this.paginatorValues[0];
    setTimeout(() => {
      this.paginatorSubject.next({ ind: this.paginatorIndex, size: this.paginatorSize, tab: this.tabIndex });
    }, this.delayAnim + 100)

  }
}
