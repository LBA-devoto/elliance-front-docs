import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { EntiteChamp } from '../entities/champ/entitechamp';

@Injectable({
  providedIn: 'root',
})
export class ChampsdentiteService {
  constructor(private httpClient: HttpclientService) {}
  recouperChampsdEntite(entite: string): Observable<EntiteChamp> {
    let url = `viewchamps/nom/${entite}`;

    return this.httpClient.get(url);
  }
}
