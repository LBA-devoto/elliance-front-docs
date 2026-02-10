import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map } from "rxjs";
import { Produit } from "../entities/produit";
import { AlertService } from "./alert-service";
import { Router } from "@angular/router";
import { PATHS } from "src/app/app-routing.module";

@Injectable({
    providedIn: 'root',
})
export class DevisService {

    constructor(private http: HttpClient, private alertService: AlertService, private router: Router) {
    }

    getDevis() {
        return new Promise((resolve, reject) => {
            this.http.get('/assets/mock-apis/devis.json').pipe(
                map((response: any) => {
                    resolve(response.mockResponse);
                }),
                catchError((err) => {
                    reject(err)
                    throw err;
                })
            ).subscribe()
        })

    }

    setDevisProduit(product: Produit, qtt: number) {
        return {
          id: product?.id,
          num: null,
          ref: product?.reference,
          image: '/assets/images/image_produit.png',
          titre: product?.nom,
          description: product?.description,
          prixAchat: product?.prixachat,
          approche: null,
          coefMarge: null,
          prixVente: product?.prixpublique,
          prixCoef: null, // prix coef ?
          prixPublic: product?.prixpublique,
          quantite: qtt,
          remises: {taux: 0, montant: 0},
          ecoPart: product?.ecoparticipation,
          tva: product?.tva
        }
      }
    
      addProd2Devis(product: Produit, qtt: number) {
        let ds = localStorage.getItem('ds-data');
        if (ds) {
          if (JSON.parse(ds).map((el: any) => el.id).includes(product.id)) {
            throw new Error()
          } else {
            let devis = JSON.parse(ds);
            devis.push(this.setDevisProduit(product, qtt))
            localStorage.setItem('ds-data', JSON.stringify(devis));
          }
        } else {
          localStorage.setItem('ds-data', JSON.stringify([this.setDevisProduit(product, qtt)]))
        }
        this.router.navigate([PATHS.devis, 'create']);
      }

}