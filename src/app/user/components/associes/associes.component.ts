import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { EntityService } from 'src/app/admin/core/services/entity.service';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { Personnemorale } from 'src/app/shared/entities/personnemorale';

@Component({
  selector: 'app-associes',
  templateUrl: './associes.component.html',
  styleUrls: ['./associes.component.css'],
})
export class AssociesComponent implements OnInit {
  loaded = false;
  associes: Personnemorale[] = [];
  results: Personnemorale[] = [];
  recherche: string;
  math = Math;
  champs: any[] = [];

  delayAnim = 1000; //ms
  private searchTerm$ = new Subject<string>(); // Pour le debounceTime (delai lors de la saisie)

  // Paginator
  paginatorValues = [21, 42, 84];
  paginatorSize = this.paginatorValues[0];
  paginatorIndex = 0;
  paginatorLength = 0;
  paginatorSubject = new Subject();

  tabIndex = 0;

  constructor(private fournisseurService: FournisseurService, private entityService: EntityService) {}

  ngOnInit(): void {
    this.setSearchTerm();
    this.loadAssocies(3);
    this.getChampsFournisseurs();
  }

  loadAssocies(tries: number) {
    if (tries > 0) {
      this.fournisseurService
        .getAssocies(this.paginatorIndex, this.paginatorSize)
        .then((associes: any) => {
          this.associes = associes.personnemorale;
          this.paginatorLength = associes.totalItems;
          this.loaded = true;
        })
        .catch(() => {
          this.loadAssocies(tries - 1);
        });
    }
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

  setSearchTerm() {
    this.searchTerm$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        if (term == '') {
          this.results = [];
          this.loadAssocies(2);
        } else {
          this.fournisseurService
            .getFournisseursAutocomplete(term)
            .then((res: any) => {
              this.results = res.content;
            });
        }
      });
  }

  onsearcheFours() {
    this.searchTerm$.next(this.recherche);
  }

  goTo(id: string) {
    this.fournisseurService.getFournisseurById(id).then((res: any) => {
      this.associes = [res];
      this.paginatorIndex = 0;
      this.paginatorLength = 1;
    });
  }

  displayResult(event: any) {
    this.recherche = event;
  }

  paginatorChange(event: any) {
    this.paginatorIndex = event.pageIndex;
    this.paginatorSize = event.pageSize;
    this.loadAssocies(2);
  }
}
