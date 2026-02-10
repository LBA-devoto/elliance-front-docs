import { Injectable } from '@angular/core';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { Categorie } from '../entities/categorie';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';
import { SousMenu } from 'src/app/user/entites/sous-menu';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl = environment.baseUrl;
  categories?: Categorie[];
  constructor(private http: HttpclientService) {}

  getCategories(
    depth: number = 1,
    pageIndex: number = 0,
    pageSize: number = 1000
  ): Promise<Categorie[]> {
    return new Promise((resolve, reject) => {
      if (this.categories) resolve(this.categories);
      this.http
        .get(`${this.baseUrl}entite/categorie/${pageIndex}/${pageSize}`)
        .pipe(
          map((cats: any) => {
            let categories = cats.categories.filter(
              (el: any) => el.visible
            );
            this.categories = categories;
            resolve(categories);
          }),
          catchError((err) => {
            reject([]);
            throw err;
          })
        )
        .subscribe();
    });
  }

  getIcons(): Promise<SousMenu[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<SousMenu[]>(`assets/mock-apis/sous-menu-extranet.json`)
        .pipe(
          map((menu) => {
            resolve(menu);
          }),
          catchError((err) => {
            reject(err);
            throw err;
          })
        )
        .subscribe();
    });
  }
}
