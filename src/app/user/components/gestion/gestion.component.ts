import { Component, OnInit } from '@angular/core';
import { Subject, distinctUntilChanged } from 'rxjs';
import { ProductService } from 'src/app/shared/services/product.service';
import { PATHS } from 'src/app/app-routing.module';
import { Produit } from 'src/app/shared/entities/produit';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css'],
})
export class GestionComponent implements OnInit {
  productsError = false;
  products: Produit[] = [];
  // displayedProducts: Produit[] = [];
  filtres: string[] = [];

  // Paginator
  paginatorSize = 21;
  paginatorValues = [21, 42, 84];
  paginatorIndex = 0;
  paginatorLength = 0;
  paginatorSubject = new Subject();

  get newArticleRoute() {
    return `/${PATHS.gestion}/${PATHS.gestion_article}/create`;
  }

  constructor(private productService: ProductService) {
    this.paginatorSubject.pipe(distinctUntilChanged()).subscribe(() => {
      this.loadProducts();
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productsError = false;

    this.productService
      .getFilteredProducts(
        this.filtres,
        this.paginatorIndex,
        this.paginatorSize
      )
      .then((prod: any) => {
        this.products = prod.content;
        this.paginatorLength = prod.totalElements;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch((err) => {
        this.productsError = true;
      });
  }

  saveFilter(event: any) {
    this.filtres = event;
  }

  paginatorChange(event: any) {
    this.paginatorIndex = event.pageIndex;
    this.paginatorSize = event.pageSize;
    this.paginatorSubject.next({
      ind: this.paginatorIndex,
      size: this.paginatorSize,
    });
  }
}
