import { Injectable } from '@angular/core';
import { HttpclientService } from './httpclientService';
import { ViewDto } from 'src/app/shared/entities/viewdto';
import { ConnectableObservable, Observable, Subject } from 'rxjs';
import { FournisseurService } from 'src/app/services/fournisseur.service';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  private visualisationSubject = new Subject<ViewDto>();
  get visualisationEvent(): Observable<ViewDto> {
    return this.visualisationSubject.asObservable();
  }

  private deleteViewSubject = new Subject<string[]>();

  get deleteEvent(): Observable<string[]> {
    return this.deleteViewSubject.asObservable();
  }
  constructor(
    private httpClientService: HttpclientService,
    private fournisseurService: FournisseurService
  ) {}
  viewObj: ViewDto[] = [];
  updateView(view: ViewDto) {
    this.visualisationSubject.next(view);
  }
  saveViews() {
    this.httpClientService
      .get<ViewDto[]>('view/')

      .subscribe((res) => {
        this.viewObj = res;

        this.viewObj = this.viewObj.filter((x) => {
          return (
            (x.ownerid !== null &&
              x.ownerid === localStorage.getItem('userid')) ||
            x.shared === true
          );
        });

        localStorage.setItem('views', JSON.stringify(this.viewObj));
      });
  }

  deleteListItems(itemIds: string[]) {
    this.deleteViewSubject.next(itemIds);
  }

  getViews(type: string, entite: string) {
    let userId = localStorage.getItem('userid');

    if (localStorage.getItem('views') !== null) {
      let userViews = localStorage.getItem('views')!;

      this.viewObj = JSON.parse(userViews);

      this.viewObj = this.viewObj.filter((x) => {
        return (
          x.type !== null &&
          x.ownerid !== null &&
          x.entite !== null &&
          (x.ownerid === userId || x.shared) &&
          x.type.toLocaleLowerCase() === type.toLocaleLowerCase() &&
          x.entite.toLocaleLowerCase() === entite.toLocaleLowerCase()
        );
      });
    }
    return this.viewObj;
  }
  bulkSaveViews(viewdtos: ViewDto[]) {
    let url = '/view/add';
    viewdtos.forEach((x) => {
      this.httpClientService.post(x, url).subscribe((res) => {});
    });
    this.saveViews();
  }

  // setFavoriView(views: ViewDto[], view: ViewDto, idUser: any) {
  //   let url = '/view/setFavori';

  //   this.httpClientService.post(views, url).subscribe((res) => {
  //     this.saveViews();
  //   });
  //   this.visualisationSubject.next(view);
  // }

  setFavoriView(view: ViewDto) {
    view.ownerid = localStorage.getItem('userid');
    let url = '/view/setFavoriView';

    this.httpClientService.post(view, url).subscribe((res) => {
      view = res;
    });
    this.visualisationSubject.next(view);
  }

  getFavoriView(view: ViewDto): any {
    let url = '/view/getFavoriView';

    return this.httpClientService.post(view, url);
  }

  getUserViews(view: ViewDto) {
    let url = '/view/getUserViews';

    return this.httpClientService.post(view, url);
  }
  filterConditions(): { [key: string]: any[] } {
    return {
      TEXT: [
        { label: 'Contient', value: 'CONTAINS' },
        { label: 'Ne contient pas', value: 'NOT_CONTAINS' },
        { label: 'Est égale à', value: 'EQUALS' },
        { label: 'Est différent de', value: 'NOT_EQUALS' },
        { label: 'Commence par', value: 'STARTS_WITH' },
        { label: 'Fini par', value: 'ENDS_WITH' },
        { label: 'Est vide', value: 'IS_EMPTY' },
        { label: "N'est pas vide", value: 'IS_NOT_EMPTY' },
      ],
      NUMBER: [
        { label: 'Est égale à', value: 'EQUALS' },
        { label: 'Est différent de', value: 'NOT_EQUALS' },
        { label: 'Est inferieur à', value: 'LESS_THAN' },
        { label: 'Est inferieur ou égal à', value: 'LESS_THAN_OR_EQUALS' },
        { label: 'Est supérieur à', value: 'GREATER_THAN' },
        { label: 'Est supérieur ou égal à', value: 'GREATER_THAN_OR_EQUALS' },
        { label: 'Est compris entre (min - max)', value: 'BETWEEN' },
        { label: 'Est vide', value: 'IS_EMPTY' },
        { label: "N'est pas vide", value: 'IS_NOT_EMPTY' },
      ],
      DATE: [
        { label: 'Est égale à', value: 'EQUALS' },
        { label: 'Est différent de', value: 'NOT_EQUALS' },
        { label: 'Est inferieur à', value: 'LESS_THAN' },
        { label: 'Est inferieur ou égal à', value: 'LESS_THAN_OR_EQUALS' },
        { label: 'Est supérieur à', value: 'GREATER_THAN' },
        { label: 'Est supérieur ou égal à', value: 'GREATER_THAN_OR_EQUALS' },
        { label: 'Est compris entre (min - max)', value: 'BETWEEN' },
        { label: 'Est vide', value: 'IS_EMPTY' },
        { label: "N'est pas vide", value: 'IS_NOT_EMPTY' },
      ],
      UNKNOWN: [
        { label: 'Contient', value: 'CONTAINS' },
        { label: 'Ne contient pas', value: 'NOT_CONTAINS' },
        { label: 'Est égale à', value: 'EQUALS' },
        { label: 'Est différent de', value: 'NOT_EQUALS' },
        { label: 'Commence par', value: 'STARTS_WITH' },
        { label: 'Fini par', value: 'ENDS_WITH' },
        { label: 'Est vide', value: 'IS_EMPTY' },
        { label: "N'est pas vide", value: 'IS_NOT_EMPTY' },
      ],
    };
  }
}
