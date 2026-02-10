import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { Produit } from '../entities/produit';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  autocompleteUrl: string = '/produit/autocomplete?q=';
  products: Produit[] = [];

  constructor(private http: HttpClient) {}

  searchProductsByTerm(
    term: string,
    page: number = 1,
    size: number = 20
  ): Promise<Produit[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.autocompleteUrl}${term}&page=${page}&size=${size}`)
        .pipe(
          catchError((err: any) => {
            reject();
            return throwError(() => err);
          }),
          map((response: any) => {
            resolve(response.content);
          })
        )
        .subscribe();
    });
  }

  getProducts(pageIndex: number = 0, pageSize: number = 21) {
    return new Promise((resolve, reject) => {
      if (this.products.length > 0) {
        resolve(this.products);
      } else {
        this.http
          .get(`/produit/catalogue?page=${pageIndex}&size=${pageSize}`)
          .pipe(
            catchError((err: any) => {
              reject(err);
              return throwError(() => err);
            }),
            map((response: any) => {
              resolve(response);
            })
          )
          .subscribe();
      }
    });
  }

  getFilteredProducts(
    filter: string[],
    pageIndex: number = 0,
    pageSize: number = 21
  ) {
    let params: HttpParams = this.convertFilter(filter);
    params = params.set('page', pageIndex);
    params = params.set('size', pageSize);
    return new Promise((resolve, reject) => {
      this.http
        .get(`/produit/catalogue`, { params: params })
        .pipe(
          catchError((err: any) => {
            reject(err);
            return throwError(() => err);
          }),
          map((response: any) => {
            resolve(response);
          })
        )
        .subscribe();
    });
  }

  convertFilter(filter: string[]): HttpParams {
    let params = new HttpParams();
    filter.forEach((fi) => {
      switch (fi.split(':')[0]) {
        // text filters
        case 'Cat':
          params = params.set('cat', fi.split(':')[1].trim());
          break;
        case 'Fournisseur':
          params = params.set('four', fi.split(':')[1].trim());
          break;
        case 'Nom':
          params = params.set('text', fi.split(':')[1].trim());
          break;
        case 'Alim':
          params = params.set('alim', fi.split(':')[1].trim());
          break;
        // comparison filters
        case 'Puissance':
          if (fi.includes('>')) {
            params = params.set(
              'puisMin',
              this.getNumericValue(fi.split('>')[1].trim())
            );
          } else {
            params = params.set(
              'puisMax',
              this.getNumericValue(fi.split('<')[1].trim())
            );
          }
          break;
        case 'Prix':
          if (fi.includes('>')) {
            params = params.set(
              'prixMin',
              this.getNumericValue(fi.split('>')[1].trim())
            );
          } else {
            params = params.set(
              'prixMax',
              this.getNumericValue(fi.split('<')[1].trim())
            );
          }
          break;
        case 'Poids':
          if (fi.includes('>')) {
            params = params.set(
              'pdsMin',
              this.getNumericValue(fi.split('>')[1].trim())
            );
          } else {
            params = params.set(
              'pdsMax',
              this.getNumericValue(fi.split('<')[1].trim())
            );
          }
          break;
        case 'Long':
          if (fi.includes('>')) {
            params = params.set(
              'longMin',
              this.getNumericValue(fi.split('>')[1].trim())
            );
          } else {
            params = params.set(
              'longMax',
              this.getNumericValue(fi.split('<')[1].trim())
            );
          }
          break;
        case 'Larg':
          if (fi.includes('>')) {
            params = params.set(
              'largMin',
              this.getNumericValue(fi.split('>')[1].trim())
            );
          } else {
            params = params.set(
              'largMax',
              this.getNumericValue(fi.split('<')[1].trim())
            );
          }
          break;
        case 'H':
          if (fi.includes('>')) {
            params = params.set(
              'hautMin',
              this.getNumericValue(fi.split('>')[1].trim())
            );
          } else {
            params = params.set(
              'hautMax',
              this.getNumericValue(fi.split('<')[1].trim())
            );
          }
          break;

        /*case 'Favoris':
                    params = params.set('favoris', fi.toLocaleLowerCase())
                    break;*/

        default:
      }
    });

    return params;
  }

  // Return only the numeric value in a string
  getNumericValue(text: string) {
    let regexp = new RegExp(/\d+(\.\d+)?/g);
    let matches = text.match(regexp);
    return matches ? matches[0] : '';
  }

  getProductById(id: string): Promise<Produit> {
    return new Promise((resolve, reject) => {
      let el = this.products.find((el) => el.id == id);
      el
        ? resolve(el)
        : this.http
            .get<Produit>(`/produit/${id}`)
            .pipe(
              catchError((err: any) => {
                reject(err);
                return throwError(() => err);
              }),
              map((response) => {
                resolve(response);
              })
            )
            .subscribe();
    });
  }
}
