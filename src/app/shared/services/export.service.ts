import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class ExportService {
    constructor(private http: HttpClient) {
    }

    exportFournisseurs(type: 'xlsx' | 'xls' | 'csv' = 'xlsx', locales: string[]) {
        const url: string = `/entite/export/fournisseurs/${type}`;

        this.http.post<Blob>(url, locales, { responseType: 'blob' as 'json' }).subscribe((data: Blob) => {
            const blob = new Blob([data], type === 'csv' ? { type: 'application/csv' } : { type: 'application/vnd.ms-excel' });

            const objectUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = `export.${type}`;
            link.click();

            URL.revokeObjectURL(objectUrl);
        });
    }
}