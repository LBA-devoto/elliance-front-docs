import { Component, Input, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Produit } from 'src/app/shared/entities/produit';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-mon-catalogue',
  templateUrl: './mon-catalogue.component.html',
  styleUrls: ['./mon-catalogue.component.css']
})
export class MonCatalogueComponent implements OnInit {

  recherche: string = '';
  filtres: string[] = [];
  fourId: string = '';

  loaded = false;
  productsError = false;
  products: Produit[] = [];
  displayedProducts: Produit[] = [];

  // Paginator
  paginatorSize = 21;
  paginatorValues = [21, 42, 84];
  paginatorIndex = 0;
  paginatorLength = 0;
  paginatorSubject = new Subject();
  routeSubscription = new Subscription();

  constructor(private productService: ProductService, private authService: AuthenticationService) {
    this.fourId = this.authService.userValue.id ? this.authService.userValue.id : 'XxTest123';
  }

  ngOnInit(): void {
    this.loadProducts(2);
  }

  displayResult(event: any) {
    this.recherche = event;
  }

  paginatorChange(event: any) {
    this.paginatorIndex = event.pageIndex;
    this.paginatorSize = event.pageSize;
    this.loadProducts(3);
  }

  parseFilter(filter: any) {
    const fi = [...filter];

    fi.forEach((el: any, i: number) => {
      if (el.includes('Four')) {
        let arr = el.split(':');
        fi[i] = `${arr[0]}:${this.fourId}`
      }
    })

    return fi;
  }

  loadProducts(tries: number = 1) {
    if (tries > 0) {
      this.productsError = false;
      let filtres = this.parseFilter(this.filtres);
      this.productService.getFilteredProducts(filtres, this.paginatorIndex, this.paginatorSize)
        .then((prod: any) => {
          this.paginatorLength = prod.totalElements;
          this.products = prod.content;
          this.displayedProducts = prod.content;
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.loaded = true;
        })
        .catch(() => {
          this.loadProducts(tries - 1);
        });
    } else {
      this.productsError = true;
    }
  }

  saveFilter(event: any) {
    this.filtres = event;
    this.loadProducts(2);
  }
}
