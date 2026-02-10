import { ChangeDetectorRef, Component, OnChanges, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Paginator } from 'primeng/paginator';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { CommonService } from 'src-adisco/services/common.service';
import { HomepageService } from 'src-adisco/services/homepage.service';
import { DynamicDocumentService } from 'src/app/shared/services/dynamic-document.service';
interface PriceProduct {
  price: any;
}
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
interface CompanyName {
  companyName: string;
}
interface UrlImage {
  urlImage: string;
}
@Component({
  selector: 'app-categories',
  templateUrl: 'categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit, OnChanges {
  titleCategory = ''
  titleCategoryImage = ''
  transformedArray: any[] = [];
  listNameCompany: CompanyName[] = [];
  @ViewChild('paginator1', { static: false }) paginator1: Paginator;
  @ViewChild('paginator2', { static: false }) paginator2: Paginator;
  @ViewChild('wrapFilter') wrapFilter: ElementRef | undefined;
  @ViewChild('wrapFilterInner') wrapFilterInner: ElementRef | undefined;
  @ViewChild('wrapContent') wrapContent: ElementRef | undefined;
  isToggleable: boolean = false;
  isOpenOuvert: boolean = false;
  isOpenFeme: boolean = false;
  cli: string = 'non';
  formFilter!: FormGroup;
  formPagination!: FormGroup;
  femeControl = new FormControl(false);
  ouvertControl = new FormControl(false);
  checkListBySupplier = false;
  loadingStatus = false;
  currentUrl: string;
  totalPages = 0;
  listCountry: any[] = [];
  listProduct: any[] = []
  scrollYPosition = 0;
  condition = false;
  listCategories: any[] = []
  listSustainableDevelopment: any[] = [
    { id: 1, label: 'Austrian Ecolabel', name: 'austrianEcolabel' },
    { id: 2, label: 'Cradle to Cradle (C2C)', name: 'cradleToCradle' },
    { id: 3, label: 'Ecocert', name: 'ecocert' },
    { id: 4, label: 'EMAS', name: 'emas' },
    { id: 5, label: 'European Ecolabel', name: 'europeanEcolabel' },
    { id: 6, label: 'FSC', name: 'fsc' },
    { id: 7, label: 'Nordic Swan', name: 'nordicSwan' },
    { id: 8, label: 'REACH', name: 'reach' }
  ];
  listUrlImageProduct: UrlImage[] = [];
  listRows: any[] = [
    12, 24, 38
  ]
  first1: number = 0;

  rows1: number = 10;

  first2: number = 0;

  rows2: number = 10;

  first3: number = 0;

  rows3: number;

  totalRecords: number;

  rows: number = 1; // Số hàng mặc định mỗi trang
  dataFilterProductAccueil: any[] = [];

  idCategory!: any;
  rowsPerPageOptions: number[] = [1, 2, 3]; // Các tùy chọn số hàng mỗi trang

  idSupplier: string;
  subArrayCategory: any[] = [];
  listNameSuppliers: any[] = [];
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 120, value: 120 }
  ]

  showListBtn = false;
  detailSupplier!: any;
  statusArray: any[] = [];
  isUpdating = false;
  currentPage = 0;
  checkRouterSupplier = false;
  checkRouterCategories = false;
  checkRouterRechercher = false;
  filterBrand = false;
  listIdTariff: any[] = [];
  listPriceProduct: PriceProduct[] = [];
  priceCurrent: any;
  dataRechercher: any;
  listSuppliers: any[] = [];
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _commonService: CommonService,
    private dynamicDocumentService: DynamicDocumentService,
    private _homepageService: HomepageService,
    private _cdf: ChangeDetectorRef
  ) {
    this.initForm();
    this.getListSuppliers();
    this.currentUrl = this.route.snapshot.url.join('/');
    if (this.currentUrl?.includes("catalogues/rechercher")) {
      this._commonService.getClickEventSearch().subscribe({
        next: (data) => {
          if (!data) {
            return;
          }
          this.dataRechercher = data;
          if (!this.formFilter) {
            return;
          }
          this.formFilter.patchValue({
            clpSafetyPicto: this.dataRechercher?.clpSafetyPicto,
            foodContact: this.dataRechercher?.foodContact,
            biocide: this.dataRechercher?.biocide,
            developpementDurable: this.dataRechercher?.developpementDurable,
            // categoryProduct: this.dataRechercher?.categoryProduct,
            fournisseur: this.dataRechercher?.fournisseur,
            brand: this.dataRechercher?.brand,
            countryOfManufacture: this.dataRechercher?.countryOfManufacture,
          })
          if (this.dataRechercher?.categoryProduct) {
            this.idCategory = this.dataRechercher?.categoryProduct;
            this.getCategoryPage()
          }
          // this._cdf.detectChanges();
        }
      });
    }
  }
  ngOnChanges(): void {

  }
  ngOnInit() {
    this.currentUrl = this.route.snapshot.url.join('/');
    this.idSupplier = this.currentUrl.startsWith('catalogues/suppliers') ? this.route.snapshot.params['id'] : "";
    this.route.paramMap.subscribe(params => {
      if (!this.idCategory) {
        this.idCategory = this.route.snapshot.params['id'];
        this.getCategoryPage()
      }
    });
    // this.getListSuppliers();
    this.checkRouterShowHide();
    // this.getCategoryPage()
    this.loadCategories();
    this.getListCountry();
    window.addEventListener('scroll', this.onWindowScroll.bind(this));
    if (this.currentUrl?.includes("catalogues") && !this.currentUrl?.includes("catalogues/suppliers")) {
      this.checkRouterCategories = true;
      this.checkRouterSupplier = false;
    }
    if (this.currentUrl.includes("catalogues/suppliers")) {
      this.checkRouterCategories = false;
      this.checkRouterSupplier = true;
    }
    if (this.currentUrl.includes("catalogues/rechercher")) {
      this.checkRouterCategories = false;
      this.checkRouterSupplier = false;
      this.checkRouterRechercher = true;
    }
  }
  initForm(): void {
    this.formFilter = this._fb.group({
      status: [],
      clpSafetyPicto: null,
      foodContact: null,
      biocide: null,
      developpementDurable: [],
      categoryProduct: [],
      brand: '',
      fournisseur: [],
      productOpenOrClosed: '',
      countryOfManufacture: '',
    });
    this.formPagination = this._fb.group({
      rows: [12],
      page: [1],
    });
    this.formFilter.valueChanges.subscribe((val) => {
      this.listNameSuppliers = []
      if (val) {
        if (val.fournisseur?.length > 0) {
          val.fournisseur.forEach((item: any) => {
            this.listNameSuppliers.push(item);
          });
        }
        this.filterProduct()
      }
      // if (val.fournisseur?.length > 0) {
      //   val.fournisseur.forEach((item: any) => {
      //     this.listNameSuppliers.push(item?.companyName);
      //   });
      //   this.filterProduct()
      // }
      // if (val.developpementDurable?.length > 0) {
      //   this.filterProduct()
      // }
    })
  }
  toggleShow(): void {
    this.showListBtn = !this.showListBtn;
  }
  checkRouterShowHide(): void {
    if (this.currentUrl.startsWith('catalogues/suppliers')) {
      this.dynamicDocumentService
        .find({
          collectionName: 'dynamic_legal_entity',
          filters: [
            {
              "fieldName": "code",
              "conditions": [
                {
                  "type": "EQUALS",
                  "value": this.idSupplier
                }
              ]
            }
          ],
          page: 1,
          pageSize: 150
        })
        .subscribe((res: any) => {
          this.detailSupplier = res.content[0];
          this.checkListBySupplier = true;
        });
    } else {
      this.checkListBySupplier = false;
    }
  }
  ngAfterViewInit() {
    this.updatePaginators(this.currentPage);
  }

  onPageChange3(event: PageEvent) {
    if (this.isUpdating) {
      return;
    }
    this.isUpdating = true;
    this.currentPage = event.page;
    this.listUrlImageProduct = [];
    this.listNameCompany = [];
    this.listPriceProduct = [];
    this.rows3 = this.formPagination.value.rows;
    this.formPagination.patchValue({
      page: event.page + 1
    })
    this.paginator1?.changePage(this.currentPage);
    this.paginator2?.changePage(this.currentPage);
    this.filterProduct();
    this.isUpdating = false;
  }
  updatePaginators(page: number) {
    this.paginator1?.changePage(page);
    this.paginator2?.changePage(page);
  }

  toggleStatus(value: string, event: any): void {
    if (value === 'OUVERT') {
      if (event.checked) {
        this.ouvertControl.setValue(false);
      }
    } else if (value === 'FERMÉ') {
      if (event.checked) {
        this.femeControl.setValue(false);
      }
    }


    if (event.checked?.length > 0) {
      this.formFilter.patchValue({
        productOpenOrClosed: event.checked[0],
      })
    }
    else {
      this.formFilter.patchValue({
        productOpenOrClosed: '',
      })
    }
    if (this.formFilter.value === 'FERMÉ') {
      this.isOpenFeme = true;
      this.isOpenOuvert = false;
    }
    if (this.formFilter.value === 'OUVERT') {
      this.isOpenFeme = false;
      this.isOpenOuvert = true;
    }
    if (this.formFilter.value === '') {
      this.isOpenOuvert = false;
      this.isOpenFeme = false;
    }

  }
  delStatus(type: string): void {
    if (type === 'ouvert') {
      this.isOpenOuvert = !this.isOpenOuvert;
      this.femeControl.setValue(false);
    }
    if (type === 'feme') {
      this.isOpenFeme = !this.isOpenFeme;
      this.ouvertControl.setValue(false);
    }
  }
  clearFilter(): void {
    this.formFilter.patchValue({
      status: [],
      clpSafetyPicto: null,
      foodContact: null,
      biocide: null,
      developpementDurable: [],
      categoryProduct: [],
      productOpenOrClosed: '',
      fournisseur: [],
      brand: '',
      countryOfManufacture: '',
    })
    this.ouvertControl.setValue(false);
    this.femeControl.setValue(false);
    this.filterProduct();
  }
  filterRows(): void {
    this.listUrlImageProduct = [];
    this.listNameCompany = [];
    this.listPriceProduct = [];
    this.formPagination.patchValue({
      rows: this.formPagination.value.rows,
      page: 1
    })
    this.filterProduct()
    this.paginator1?.changePageToFirst(event);
    this.paginator2?.changePageToFirst(event);
  }
  clickValueProduct(value: any, categoriesLV1: any) {
    if (categoriesLV1?.nameCategory.fr_FR != null && categoriesLV1?.nameCategory.fr_FR) {
      this.titleCategory = categoriesLV1?.nameCategory.fr_FR;
    }
    if (categoriesLV1?.pictoOfTheCategory[0]?.url != null && categoriesLV1?.pictoOfTheCategory[0]?.url) {
      this.titleCategoryImage = categoriesLV1?.pictoOfTheCategory[0].url;
    }
    this.formFilter.patchValue({
      categoryProduct: value
    })
    this.filterProduct();
  }
  getCategoryPage(): void {
    let filters = [
      {
        fieldName: 'statusCategory',
        conditions: [
          {
            type: 'EQUALS',
            value: 'Publié',
          },
        ],
      },
      {
        "fieldName": "codeCategory",
        "conditions": [
          {
            "type": "EQUALS",
            "value": this.idCategory,
          }
        ]
      }
    ]
    this.dynamicDocumentService
      .find(
        {
          collectionName: 'dynamic_category',
          filters: filters,
          sorts: {},
          page: 1,
          pageSize: 150,
        },
        true
      )
      .subscribe({
        next: (res) => {
          if (res?.content[0]?.nameCategory.fr_FR != null && res?.content[0]?.nameCategory.fr_FR) {
            this.titleCategory = res?.content[0]?.nameCategory.fr_FR;
          }
          if (res?.content[0]?.pictoOfTheCategory[0]?.url != null && res?.content[0]?.pictoOfTheCategory[0]?.url) {
            this.titleCategoryImage = res?.content[0]?.pictoOfTheCategory[0].url;
          }

          if (this.subArrayCategory != null && this.subArrayCategory) {
            this.subArrayCategory = res?.content[0]?.subcategories.map((item: any) => ({
              "type": "EQUALS",
              "value": item.value,
            }));
          }
          this.filterProduct();
          this._cdf.detectChanges();
        },
        error: (error) => {
        },
      });
  }
  filterProduct(): void {
    let developpementDurableData: any[] = [];
    let categoryProduct: any[] = [];
    let valueSupplier: any[] = [];
    // this.listNameSuppliers = [] 
    let filters: any = [
      {
        "fieldName": "statusProduct",
        "conditions": [
          {
            "type": "EQUALS",
            "value": "Publié"
          }
        ]
      },
    ];
    if (this.formFilter.value.developpementDurable != null && this.formFilter.value.developpementDurable?.length > 0) {
      developpementDurableData = this.formFilter.value.developpementDurable.map((item: any) => ({
        fieldName: item.name,
        conditions: [
          {
            type: "EQUALS",
            value: true
          }
        ]
      }));
    }
    if (this.formFilter.value.categoryProduct != null && this.formFilter.value.categoryProduct != '') {
      categoryProduct = [
        {
          "fieldName": "categoryCode",
          "conditions": [
            {
              "type": "EQUALS",
              "value": this.formFilter.value.categoryProduct,
              "minValue": "",
              "maxValue": ""
            }
          ]
        }
      ]
    } else {
      categoryProduct = [
        {
          "fieldName": "categoryCode",
          "conditions": this.subArrayCategory
        }
      ]
    }
    if (this.formFilter.value.brand) {
      filters.push({
        fieldName: "brand",
        conditions: [
          {
            type: "EQUALS",
            value: this.formFilter.value.brand
          }
        ]
      });
    }
    if (this.formFilter.value.productOpenOrClosed) {
      filters.push({
        fieldName: "productOpenOrClosed",
        conditions: [
          {
            type: "EQUALS",
            value: this.formFilter.value.productOpenOrClosed,
            minValue: "",
            maxValue: ""
          }
        ]
      });
    }
    if (this.formFilter.value.clpSafetyPicto !== null) {
      filters.push({
        fieldName: "clpSafetyPicto",
        conditions: [
          {
            type: "EQUALS",
            value: this.formFilter.value.clpSafetyPicto ? 'AVEC' : 'SANS'
          }
        ]
      });
    }
    if (this.formFilter.value.foodContact !== null) {
      filters.push({
        fieldName: "foodContact",
        conditions: [
          {
            type: "EQUALS",
            value: this.formFilter.value.foodContact
          }
        ]
      });
    }
    if (this.formFilter.value.biocide !== null) {
      filters.push({
        fieldName: "biocide",
        conditions: [
          {
            type: "EQUALS",
            value: this.formFilter.value.biocide
          }
        ]
      });
    }
    if (this.listNameSuppliers && this.listNameSuppliers.length > 0) {
      filters.push({
        fieldName: "nameSupplier",
        conditions: [
          {
            type: "EQUALS",
            value: this.listNameSuppliers
          }
        ]
      });
    }
    if (this.formFilter.value.countryOfManufacture) {
      filters.push({
        fieldName: "countryOfManufacture",
        conditions: [
          {
            type: "EQUALS",
            value: this.formFilter.value.countryOfManufacture
          }
        ]
      });
    }
    if (this.formFilter.value.brand && this.filterBrand) {
      filters.push({
        fieldName: "brand",
        conditions: [
          {
            type: "EQUALS",
            value: this.formFilter.value.brand
          }
        ]
      });
      this.filterBrand = false;
    }

    if (this.idSupplier) {
      valueSupplier = [{
        "fieldName": "nameSupplier",
        "conditions": [
          {
            "type": "EQUALS",
            "value": this.idSupplier
          }
        ]
      }];
    }
    const body = [...filters, ...developpementDurableData, ...categoryProduct, ...valueSupplier]
    this.dynamicDocumentService.find({
      collectionName: 'dynamic_product',
      filters: body,
      sorts: {
        "uniqueId": "DESC"
      },
      page: this.formPagination.value.page,
      pageSize: this.formPagination.value.rows,
    }, true).subscribe({
      next: (res) => {
        this.listProduct = res.content;
        this.totalRecords = res.totalElements;
        this.rows3 = res.size;
        this.totalPages = Math.ceil(this.totalRecords / this.rows3);

        const supplierRequests = this.listProduct.map(product =>
          this.getNameSupplier(product?.nameSupplier[0]?.value)
        );

        const imageRequests = this.listProduct.map(product =>
          product?.supplierItemNumber
            ? this.getListImage(product?.supplierItemNumber)
            : of('src-adisco/assets/images/image-default.jpeg')
        );

        const tariffRequests = this.listProduct.map(product => {
          if (product?.linkToTariff && product?.linkToTariff[0]) {
            const listIdTariff: any[] = product.linkToTariff.map((item: any) => item?.documentId);
            return this.getTariff(listIdTariff);
          } else {
            return of('');
          }
        });

        forkJoin([...supplierRequests, ...imageRequests, ...tariffRequests]).subscribe(results => {
          const supplierResults = results.slice(0, supplierRequests.length);
          const imageResults = results.slice(supplierRequests.length, supplierRequests.length + imageRequests.length);
          const tariffResults = results.slice(supplierRequests.length + imageRequests.length);

          this.listProduct = this.listProduct.map((product, index) => ({
            ...product,
            companyName: supplierResults[index],
            urlImage: imageResults[index],
            price: tariffResults[index]
          }));

        });
      },
      error: (error) => {
      }
    });
  }

  getNameSupplier(code: any): Observable<any> {
    return this.dynamicDocumentService.find({
      collectionName: 'dynamic_legal_entity',
      filters: [
        {
          "fieldName": "code",
          "conditions": [
            {
              "type": "EQUALS",
              "value": code
            }
          ]
        }
      ],
      page: 1,
      pageSize: 150
    }).pipe(
      map((res: any) => {
        if (res.content[0]?.companyName != null) {
          return res.content[0].companyName;
        }
        return '';
      })
    );
  }
  loadCategories() {
    let filterCategories = [
      {
        fieldName: 'statusCategory',
        conditions: [
          {
            type: 'EQUALS',
            value: 'Publié',
          },
        ],
      },
      //   {
      //     fieldName: 'categoryLevelCategory',
      //     conditions: [
      //       {
      //         type: 'EQUALS',
      //         value: 1,
      //       },
      //     ],
      //   },
    ];
    this.dynamicDocumentService
      .find(
        {
          collectionName: 'dynamic_category',
          filters: filterCategories,
          sorts: {},
          page: 1,
          pageSize: 150,
        },
        true
      )
      .subscribe((cats: any) => {

        cats.content.forEach((item: any) => {
          const parts = item.codeCategory.split('.');
          let currentItem = this.transformedArray.find(ti => ti.codeCategory === parts[0]);

          if (!currentItem) {
            currentItem = {
              ...item,
              arrSubcategory: [],
              subcategoryArray: [],
            };
            this.transformedArray.push(currentItem);
          }

          if (parts.length === 2) {
            currentItem.arrSubcategory.push({
              ...item,
              subcategoryArray: [],
            });
          } else if (parts.length === 3) {
            const parentItem = currentItem.arrSubcategory.find((ti: any) => ti.codeCategory === parts.slice(0, 2).join('.'));
            if (parentItem) {
              parentItem.subcategoryArray.push(item);
            }
          }
        });

        this._cdf.detectChanges();
      })
  }


  getListCountry(): void {
    this._homepageService.getCountry().subscribe({
      next: (res) => {
        this.listCountry = res.map((item: any) => ({
          ...item,
          label: item.mapLocalLibelle.en_GB
        }));
      },
      error: (error) => { },
    });
  }

  getListImage(supplierItemNumber: any): Observable<string> {
    return this.dynamicDocumentService.find({
      collectionName: 'dynamic_ressource',
      filters: [
        {
          fieldName: 'linkToProduct',
          conditions: [
            {
              type: 'EQUALS',
              value: supplierItemNumber,
              minValue: '',
              maxValue: ''
            }
          ]
        }
      ],
      sorts: {},
      page: 1,
      pageSize: 25
    }).pipe(
      map((res: any) => {
        const dataListImage = res.content;
        const firstMatchingItem = dataListImage.find((item: any) => {
          return item.typeOfResource?.value === 'PHOTO' && item.file?.length > 0;
        });
        return firstMatchingItem?.file[0]?.url || 'src-adisco/assets/images/image-default.jpeg';
      })
    );
  }

  addProductEvent(data: any): void {
    this._commonService.sendClickProduct(data);
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    this.scrollYPosition = window.scrollY;
    const element = this.wrapFilter?.nativeElement;
    const eleContent = this.wrapContent?.nativeElement;
    if (element) {
      if (element.offsetHeight < eleContent.offsetHeight) {
        const elementRect = element.getBoundingClientRect();
        const windowScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const elementPositionTop = elementRect.top + windowScrollTop;

        if (window.scrollY + 205 >= elementPositionTop) {
          this.condition = true;
        } else {
          this.condition = false;
        }
      }
    }
  }
  filterProductClickBrand(): void {
    this.filterBrand = true;
    if (this.formFilter.value.brand) {
      this.filterProduct()
    }
  }
  getTariff(ids: any[]): Observable<any> {
    return this._commonService.getDataTariff(ids).pipe(
      map((res) => {
        const data = res.response;
        const filteredData = data.filter((item: any) => item.year && item.year.value === "N");
        if (filteredData.length > 0) {
          const latestItem = filteredData.reduce((prev: any, current: any) => {
            return (prev.price > current.price) ? prev : current;
          });
          return latestItem.price;
        }
        return '';
      })
    );
  }
  getListSuppliers(): void {
    let filters = [
      {
        fieldName: 'typeOfLegalEntity',
        conditions: [
          {
            type: 'EQUALS',
            value: 'FOURNISSEUR',
          },
        ],
      },
      {
        fieldName: 'status',
        conditions: [
          {
            type: 'EQUALS',
            value: 'Publié',
          },
        ],
      },
    ];
    this.dynamicDocumentService
      .find({
        collectionName: 'dynamic_legal_entity',
        filters: filters,
        sorts: {
          "companyName": "ASC"
        },
        page: 1,
        pageSize: 150,
      })
      .subscribe((res: any) => {
        this.listSuppliers = res.content;
      });
  }
}

