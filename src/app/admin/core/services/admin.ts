import { Injectable } from "@angular/core";
import { Personnemorale } from "src/app/shared/entities/personnemorale";
import { HttpclientService } from "./httpclientService";

@Injectable({
    providedIn: 'root'
})

export class AppService {
    constructor(private httpClientService:HttpclientService){

    }

    public init(){

        //app initialization would be done here to save what is needed in the cache
        let url ="/personnemorale/"
        let Personnemorale = this.httpClientService.get<any>(url)
    }
}