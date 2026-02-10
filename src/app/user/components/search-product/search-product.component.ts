import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PATHS } from 'src/app/app-routing.module';
import { ProductService } from 'src/app/shared/services/product.service';
import { Produit } from 'src/app/shared/entities/produit';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.css'],
})
export class SearchProductComponent implements OnInit {
  searchTerm = '';
  private searchTerm$ = new Subject<string>(); // Pour le debounceTime (delai lors de la saisie)

  autocompleteList: any[] = [];
  listIsDisabled = false;

  @Output()
  result: EventEmitter<any> = new EventEmitter(); // Attribuer un type lorsque la req d'autocomplete sera opérationnelle

  @ViewChild('searchContainer') searchContainer: ElementRef;

  triggerClickEvent() {
    this.searchContainer.nativeElement.click();
  }

  constructor(
    private productService: ProductService,
    private elRef: ElementRef,
    private router: Router
  ) {
    this.setSearchPipe();
  }

  ngOnInit(): void {}

  setSearchPipe() {
    this.searchTerm$
      .pipe(
        debounceTime(300), // 300ms delay
        distinctUntilChanged()
      )
      .subscribe((searchTerm: string) => {
        if (searchTerm) {
          this.autocomplete(searchTerm);
        } else {
          this.autocompleteList = [];
        }
      });
  }

  onSearchInput(): void {
    this.searchTerm$.next(this.searchTerm);
  }

  autocomplete(term: string) {
    if (term.length >= 3) {
      this.productService.searchProductsByTerm(term).then((res: Produit[]) => {
        this.autocompleteList = res;
      });
    }
  }

  onSearch() {
    this.autocompleteList = [];
    this.result.emit(this.searchTerm);
    this.router.navigate([
      PATHS.catalogues,
      `products&search:${this.searchTerm}`,
    ]);
    this.disableList();
  }

  disableList() {
    this.listIsDisabled = true;

    setTimeout(() => {
      this.listIsDisabled = false;
    }, 1000);
  }

  selectItem(item: any) {
    this.router.navigate([PATHS.product, item.id]);
    this.autocompleteList = [];
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutsideDiv(targetElement: HTMLElement) {
    const clickedInside = this.elRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      // trigger click event here
      //
      this.autocompleteList = [];
    }
  }
}
