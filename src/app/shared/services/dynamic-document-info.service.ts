import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, map } from 'rxjs';

import { DynamicDocumentFieldInfo, DynamicDocumentInfo } from '../entities/dynamic-document';

@Injectable({
  providedIn: 'root'
})
export class DynamicDocumentInfoService {

  constructor(private readonly _httpClient: HttpClient) { }

  public getGeneralLabel(label: any | Map<string, string> | object, lang: string = 'fr_FR'): string {
    try {
      return label.get(lang);
    } catch {
      return label[lang]
    }
  }

  public getLabel(dynamicDocument: DynamicDocumentInfo, lang: string = 'fr_FR'): string {
    let label: any = '';
    try {
      label = dynamicDocument.label?.get(lang);
      
    } catch {
      let labels: any = dynamicDocument.label;
      label = labels?.[lang];      
    }
    return label;
  }
  
  public getFieldLabel(field: DynamicDocumentFieldInfo, lang: string = 'fr_FR'): string {
    let label: any = '';
    try {
      label = field.label?.get(lang);      
    } catch {
      let labels: any = field.label;
      label = labels?.[lang];      
    }
    return label;
  }

  public findById(documentId: string): Promise<DynamicDocumentInfo> {
    return new Promise<DynamicDocumentInfo>((resolve, reject) => {
      this._httpClient.get<DynamicDocumentInfo>(`/dynamic-document-infos/${documentId}`).pipe(
        map((res) => {
          resolve(res);
        }),
        catchError((err) => {
          reject(err);
          throw err;
        })
      ).subscribe();
    })
  }

  public findByDocumentName(documentName: string): Observable<DynamicDocumentInfo> {
    return this._httpClient.get<DynamicDocumentInfo>(`/dynamic-document-infos/by-document-name/${documentName}`);
  }

  public findAll(): Promise<DynamicDocumentInfo[]> {
    return new Promise<DynamicDocumentInfo[]>((resolve, reject) => {
      this._httpClient.get<DynamicDocumentInfo[]>(`/dynamic-document-infos`).pipe(
        map((res) => {
          resolve(res);
        }),
        catchError((err) => {
          reject(err);
          throw err;
        })
      ).subscribe();
    })
  }

  public save(document: DynamicDocumentInfo): Promise<DynamicDocumentInfo> {
    return new Promise<DynamicDocumentInfo>((resolve, reject) => {
      this._httpClient.post<DynamicDocumentInfo>(`/dynamic-document-infos`, document).pipe(
        map((res) => {
          resolve(res);
        }),
        catchError((err) => {
          reject(err);
          throw err;
        })
      ).subscribe();
    })
  }

  public delete(document: DynamicDocumentInfo): Promise<DynamicDocumentInfo> {
    return new Promise<DynamicDocumentInfo>((resolve, reject) => {
      this._httpClient.delete<DynamicDocumentInfo>(`/dynamic-document-infos/${document.id}`).pipe(
        map((res) => {
          resolve(res);
        }),
        catchError((err) => {
          reject(err);
          throw err;
        })
      ).subscribe();
    })
  }

  public deleteById(id: string): Promise<DynamicDocumentInfo> {
    return new Promise<DynamicDocumentInfo>((resolve, reject) => {
      this._httpClient.delete<DynamicDocumentInfo>(`/dynamic-document-infos/${id}`).pipe(
        map((res) => {
          resolve(res);
        }),
        catchError((err) => {
          reject(err);
          throw err;
        })
      ).subscribe();
    })
  }
}
