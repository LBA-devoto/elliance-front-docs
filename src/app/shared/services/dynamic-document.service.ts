import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DynamicDocumentService {

  constructor(private readonly _httpClient: HttpClient) {}

  public findById(documentName: string, id: string): Observable<any> {
    return this._httpClient.get<any>(`/dynamic-documents/${documentName}/${id}`);
  }

  public find(dynamicDocumentRequest: any): Observable<any[]> {
    return this._httpClient.post<any[]>(`/dynamic-documents/${dynamicDocumentRequest.collectionName}/search`, dynamicDocumentRequest);
  }

  public importFile(documentName: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const options: any = {};
    options.headers = new HttpHeaders();
    options.headers.set('Content-Type', 'multipart/form-data');
    options.headers.set('Accept', 'application/json');
    options.headers.set('Access-Control-Allow-Origin', '*');
    options.reportProgress = true;

    return this._httpClient.post<any>(`/dynamic-documents/${documentName}/import-file`, formData, options);
  }

  public exportFile(documentName: string, fileExtension: string, exportFileRequest: any): Observable<Blob> {
    return this._httpClient.post<Blob>(`/dynamic-documents/${documentName}/export-file/${fileExtension}`, exportFileRequest, { responseType: 'blob' as 'json' });
  }

  public exportFileOnView(documentName: string, fileExtension: string, viewId: string, exportFileRequest: any): Observable<Blob> {
    return this._httpClient.post<Blob>(`/dynamic-documents/${documentName}/export-file/${fileExtension}/views/${viewId}`, exportFileRequest, { responseType: 'blob' as 'json' });
  }

  public deleteById(documentName: string, id: string): Observable<any> {
    return this._httpClient.delete<any>(`/dynamic-documents/${documentName}/${id}`);
  }

  getValue(value: any, tabField: string, lang: string = 'fr_FR') {
    return value?.[tabField]?.[lang] ? value?.[tabField]?.[lang] : (value?.[tabField] ? value?.[tabField] : value?.id);
  }
}
