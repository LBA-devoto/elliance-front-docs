import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  local:any[]=[];
  
  constructor(private httpClient:HttpClient) {
    this.local=["fr_FR","en_GB","de_DE","es_ES"];
   }
}
