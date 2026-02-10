import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Produit } from 'src/app/shared/entities/produit';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-catalogue-eurochef',
  templateUrl: './catalogue-eurochef.component.html',
  styleUrls: ['./catalogue-eurochef.component.css']
})
export class CatalogueEurochefComponent implements OnInit {
  
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
          // this.writeOverPaginator();
        })
        .catch(() => {
          this.loadProducts(tries - 1);
        });
    } else {
      this.productsError = true;
    }
  }


  // writeOverPaginator() { // Modifie le HTML du paginator pour un affichage personnalisé
  //   let sizeLabs = document.getElementsByClassName('mat-paginator-page-size-label');
  //   if (sizeLabs[0]) {
  //     sizeLabs[0].innerHTML = 'Afficher';

  //     let element = document.createElement('div');
  //     element.innerHTML = 'éléments';
  //     element.className = 'mat-paginator-page-size-label';
  //     let pageSize = document.getElementsByClassName('mat-paginator-page-size');

  //     if (pageSize[0].children.length < 3) pageSize[0].appendChild(element);

  //     let rangeLabs = document.getElementsByClassName('mat-paginator-range-label');

  //     let max = this.paginatorIndex * this.paginatorSize + this.paginatorSize > this.paginatorLength ? this.paginatorLength : this.paginatorIndex * this.paginatorSize + this.paginatorSize;
  //     rangeLabs[0].innerHTML = `${this.paginatorIndex * this.paginatorSize + 1} - ${max} sur ${this.paginatorLength}`;
  //   }
  // }

  saveFilter(event: any) {
    this.filtres = event;
    this.loadProducts(2);
  }
}
