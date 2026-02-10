import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, timeout } from 'rxjs'; // <-- ADD `timeout` from rxjs

@Injectable({
  providedIn: 'root'
})
export class IdmlService {

  constructor(private readonly _httpClient: HttpClient) {}

  public exportFile(id: string, locale: string): Observable<Blob> {
    return this._httpClient.post<Blob>(`/idml/export-file/${id}/${locale}`, null, {
      responseType: 'blob' as 'json'
    }).pipe(
      timeout(120000) // Set to 120 seconds or adjust as needed
    );
  }
}
