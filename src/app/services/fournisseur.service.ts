import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Personnemorale } from '../shared/entities/personnemorale';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  baseUrl = environment.baseUrl;
  private fournisseurs: Personnemorale[] = [];

  constructor(private http: HttpClient) { }

  getAllFournisseurs() {
    return new Promise((resolve, reject) => {
      if (this.fournisseurs.length > 500) { resolve(this.fournisseurs) }
      else {
        this.getFournisseurs(0, 10000).then((fournisseurs: any) => {
          this.fournisseurs = fournisseurs.personnemorale;
          resolve(this.fournisseurs);
        }).catch((err) => {
          reject(err);
        })
      };
    })
  }

  getFournisseurs(pageIndex: number = 0, pageSize: number = 21): Promise<Personnemorale[]> {
    let body = {
      page: pageIndex,
      size: pageSize,
      typeName: 'FOURNISSEUR'
    }
    return new Promise((resolve, reject) => {
      this.http.post(`${this.baseUrl}/personnemorale/getbytypename`, body).pipe(
        map((supp: any) => {
          resolve(supp);
        }),
        catchError((err) => {
          reject([])
          throw err;
        })
      ).subscribe();
    })
  }

  getFournisseurById(id: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.baseUrl}/personnemorale/${id}`).pipe(
        map((supp: any) => {
          resolve(supp);
        }),
        catchError((err) => {
          reject([])
          throw err;
        })
      ).subscribe();
    })
  }

  getFournisseursAutocomplete(query: string, pageIndex: number = 1, pageSize: number = 10) {
    return new Promise((resolve, reject) => {
      this.http.get(`/personnemorale/autocomplete?q=${query}&page=${pageIndex}&size=${pageSize}`).pipe(
        map((fours: any) => {
          resolve(fours);
        }),
        catchError((err) => {
          reject([])
          throw err;
        })
      ).subscribe()
    });
  }

  getAssocies(pageIndex: number = 0, pageSize: number = 21) {
    let body = {
      page: pageIndex,
      size: pageSize,
      typeName: 'ASSOCIE'
    }
    return new Promise((resolve, reject) => {
      this.http.post(`${this.baseUrl}/personnemorale/getbytypename`, body).pipe(
        map((associe) => {
          resolve(associe);
        }),
        catchError((err) => {
          reject(err)
          throw err;
        })
      ).subscribe();
    })
  }

  createFournisseur(fournisseur: any) { }
}
