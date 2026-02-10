import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from "rxjs";
import { Extranet, ExtranetClient } from "../entities/extranet";


@Injectable({
    providedIn: 'root',
})
export class ExtranetService {
    public extranets?: Extranet[];
    public requestMap: string[] = [];

    constructor(private http: HttpClient) { }

    getExtranet(client: string): Promise<Extranet[]> {
        this.requestMap.push(client);
        return new Promise((resolve, reject) => {
            if (this.extranets) resolve(this.extranets);

            if (this.requestMap.filter(el => el == client).length <= 1) {
                this.http.get<Extranet[]>('produit/extranet/tabs', { headers: { client } }).pipe(
                    map((resp) => {
                        this.extranets = resp;
                        resolve(resp);
                    }),
                    catchError((err) => {
                        reject(err)
                        return throwError(() => err);
                    })
                ).subscribe();
            } else {
                if (typeof this.extranets == 'object') {
                    resolve(this.extranets)
                } else {
                    reject()
                }
            }
        })
    }

    saveExtranet(extranetClient: ExtranetClient) {
        return new Promise((resolve, reject) => {
            this.http.post('produit/extranet/tabs', extranetClient).pipe(
                map((resp) => {
                    resolve(resp)
                }),
                catchError((err) => {
                    reject(err)
                    return throwError(() => err);
                })
            ).subscribe();
        })
    }
}
