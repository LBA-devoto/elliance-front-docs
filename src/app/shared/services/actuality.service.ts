import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map } from "rxjs";
import { environment } from "src/environments/environment";
import { Actualite } from "../entities/actualite";
import { Pagination } from "../entities/pagination";

class ActuResp extends Pagination {
    actualites: Actualite[];
}

@Injectable({
    providedIn: 'root',
})
export class ActualityService {
    private baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) {
    }

    getActualities(pageIndex: number = 0, pageSize: number = 100): Promise<Actualite[]> {
        return new Promise((resolve, reject) => {
            this.http.get<ActuResp>(`${this.baseUrl}actualite/${pageIndex}/${pageSize}`).pipe(
                map((actus) => {
                    resolve(this.displayActus(actus?.actualites))
                }),
                catchError((err) => {
                    reject(err)
                    throw err;
                })
            ).subscribe();
        })
    }

    displayActus(actualites: Actualite[]): Actualite[] | PromiseLike<Actualite[]> {
        let resp = actualites.filter(el => el.statut === 'Actif');
        resp = resp.filter(el => el.siteEnables?.findIndex(site => site.enabled && site.nom === 'Extranet Associé') !== -1);        
        return resp;
    }

    
}