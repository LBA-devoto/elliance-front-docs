import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, map } from 'rxjs';

import { DynamicViewInfo } from '../entities/dynamic-view';

@Injectable({
  providedIn: 'root'
})
export class DynamicViewInfoService {

  constructor(private readonly _httpClient: HttpClient) {}

  public findByDocumentName(documentName: string): Observable<DynamicViewInfo[]> {
    return this._httpClient.get<DynamicViewInfo[]>(`/dynamic-view-infos/by-document-name/${documentName}`);
  }

  public saveView(viewInfo: DynamicViewInfo): Promise<DynamicViewInfo> {
    return new Promise((resolve, reject) => {
      this._httpClient.post<DynamicViewInfo>(`/dynamic-view-infos`, viewInfo).pipe(
        map((res) => {
          resolve(res);
        }),
        catchError((err) => {
          reject();
          throw err
        })
      ).subscribe();
    })
  }

}
