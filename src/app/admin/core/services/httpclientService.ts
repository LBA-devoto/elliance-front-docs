import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { User } from 'src/app/shared/entities/authentication/user';
import { Personnephysique } from 'src/app/shared/entities/personnephysique';
import { AlertService } from 'src/app/shared/services/alert-service';
import { environment } from 'src/environments/environment';
import { IDroit } from '../interfaces/IDroit';
import { IMenuItem } from '../interfaces/IMenu';

@Injectable({
  providedIn: 'root',
})
export class HttpclientService {
  constructor(
    private _httpClient: HttpClient,
    private alertService: AlertService
  ) {}

  getFromclient(): Observable<any> {
    return this._httpClient
      .get(`${environment.API_URL}/personnemorale/form/add/CLIENT`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() method => Fetch details
  get<T>(url: string): Observable<any> {
    return this._httpClient
      .get<T>(`${environment.API_URL}/${url}`)
      .pipe(retry(3), catchError(this.handleError));
  }

  getSamlMetadata() {
    return this._httpClient.get('/assets/saml/metadata.xml', {
      responseType: 'text',
    });
  }
  // get<T>(url: string):Observable<any> {
  //   return this._httpClient
  //     .get<T>(`${environment.API_URL}/${url}`,{ observe: 'response' })
  // }

  getObjet(entite: string, id: string): Observable<any> {
    return this._httpClient
      .get<any>(`${environment.baseUrl}/${entite}/${id}`)
      .pipe(retry(3), catchError(this.handleError));
  }
  // HttpClient API get() method => Fetch details
  getList<T>(url: string) {
    return this._httpClient
      .get<any[]>(`${environment.API_URL}/${url}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  supprimer(entityName: string, id: string) {
    return this._httpClient.get(`${entityName}/delete/${id}`);
  }

  suppressionEnMasse(entityName: string, ids: any[]): Observable<any[]> {
    return this._httpClient.post<any[]>(`${entityName}/bulkdelete`, {
      idslist: ids,
    });
  }
  // HttpClient API post() method => Create new record
  post(paylods: any, url: string): Observable<any> {
    return this._httpClient
      .post<any>(url, paylods)
      .pipe(retry(2), catchError(this.handleError));
  }

  postWithHeader(paylods: any, headers: any, url: string): Observable<any> {
    return this._httpClient.post<any>(url, paylods, { headers: headers });
  }

  // supprimer(entityName:string,id: string){
  //     return this._httpClient.get(`${entityName}/delete/${id}`);
  //   }

  // suppressionEnMasse(entityName:string,ids: any[]): Observable<any[]> {
  // return this._httpClient.post<any[]>(`${entityName}/bulkdelete`, {
  // idslist: ids,
  // });

  // }
  // HttpClient API post() method => Create new record
  // post(paylods: any) {
  //     return this._httpClient.post(environment.API_URL, paylods).pipe(
  //         retry(1),
  //         catchError(this.handleError)
  //     );
  // }
  // HttpClient API get() method => Fetch details
  getTableData<T>(entityName: String, url: string) {
    return this._httpClient
      .get<T[]>(`${environment.API_URL}/${url}`)
      .pipe(retry(1), catchError(this.handleError));
  }
  getTableDataList(entityName: String) {
    entityName = 'typepersonnemorale/all';
    return this._httpClient
      .get<any[]>('/personnemorale/')
      .pipe(retry(1), catchError(this.handleError));
  }

  authenticate(username: string, password: string): Observable<User> {
    return this._httpClient
      .post<any>(environment.login, { username, password })
      .pipe(catchError(this.handleError));
  }
  getPersonnemoraleListByType(entityName: string, id: string) {
    return this._httpClient
      .get<any[]>(`${environment.baseUrl}/${entityName}/type/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  getListCategorie() {
    return this._httpClient
      .get<any[]>(`${environment.baseUrl}/entite/categorie/`)
      .pipe(retry(1), catchError(this.handleError));
  }
  getListCategorieByDepth(depth: number) {
    return this._httpClient
      .get<any[]>(`${environment.baseUrl}/entite/categorie/depth/${depth}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  getCategorie(id: string) {
    return this._httpClient
      .get<any>(`${environment.baseUrl}/entite/categorie/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  getProduitList(): Observable<any> {
    return this._httpClient
      .get<any[]>(`${environment.baseUrl}/produit/`)
      .pipe(retry(1), catchError(this.handleError));
  }
  getProduitListByType(type: string): Observable<any> {
    return this._httpClient
      .get<any[]>(`${environment.baseUrl}/produit/type/${type}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  getProduit(id: string) {
    return this._httpClient
      .get<any>(`${environment.baseUrl}/produit/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
  getPersonnephysiqueByType(entityName: string) {
    return this._httpClient
      .get<any[]>(`${environment.baseUrl}/${entityName}/`)
      .pipe(retry(1), catchError(this.handleError));
  }
  // Error handling
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(errorMessage);
  }

  personMoraleMapData(map: Object, type: string) {
    let personemoral: Personnephysique[] = [];
    switch (type) {
      case 'CLIENT':
    }
  }

  getImages(path: string) {
    return this._httpClient
      .get<any>(`${environment.baseUrl}/images/${path}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  getColumnsOfClass(entite: string) {
    return (
      this._httpClient
        .get<any[]>(`http://141.94.163.76:39081/contrat/entite/nom/${entite}/`)
        // .get<any[]>(`${environment.baseUrl}/${entite}/`)
        .pipe(retry(1), catchError(this.handleError))
    );
  }

  downloadBlob(route: string): Observable<Blob> {
    return this._httpClient.get(`${environment.baseUrl}/${route}`, {
      responseType: 'blob',
    });
  }

  delete<T>(url: string): Observable<any> {
    return this._httpClient
      .delete<T>(`${environment.API_URL}/${url}`)
      .pipe(retry(3), catchError(this.handleError));
  }
}
