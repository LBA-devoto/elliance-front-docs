import { Component, Input, OnInit } from '@angular/core';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { DtoToEntityService } from 'src/app/services/dto-to-entity.service';
import { LocalService } from 'src/app/services/local.service';
import { CategorieDto } from '../../dto/categorie-dto';
import { Categorie } from '../../entities/categorie';
import { Tables } from '../../entities/tables';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.css'],
})
export class CategorieComponent implements OnInit {
  @Input() public value: string;
  @Input() public tab: Tables = new Tables();
  edition: boolean = false;
  lecture: boolean = false;

  categorie: Categorie = new Categorie();
  image: any;

  categorieDto: CategorieDto = new CategorieDto();
  locales: any[] = [];

  selectedFile: any = null;

  constructor(
    private httpClientService: HttpclientService,
    private localService: LocalService,
    private dtoToEntity: DtoToEntityService
  ) {}

  ngOnInit(): void {
    if (this.value === 'edition') {
      this.edition = true;
      this.lecture = false;
    } else if (this.value === 'lecture') {
      this.httpClientService
        .getCategorie(this.tab.id)
        .subscribe((data) => (this.categorie = data));
      this.lecture = true;
      this.edition = false;
    }
    this.locales = this.localService.local;
    this.categorie.maplocaletitre = new Map(
      this.locales.map((local) => [local, ''])
    );
    this.categorie.mapdescriptioncourte = new Map(
      this.locales.map((local) => [local, ''])
    );
    this.categorie.mapdescriptionlongue = new Map(
      this.locales.map((local) => [local, ''])
    );
  }

  create() {
    this.categorie.maplocaletitre.forEach((val: string, key: string) => {
      this.categorie.maplocaletitre[key] = val;
    });
    this.categorie.mapdescriptioncourte.forEach((val: string, key: string) => {
      this.categorie.mapdescriptioncourte[key] = val;
    });
    this.categorie.mapdescriptionlongue.forEach((val: string, key: string) => {
      this.categorie.mapdescriptionlongue[key] = val;
    });

    let categorieDto: CategorieDto = this.dtoToEntity.fromCategorieToDto(
      this.categorie
    );

    this.httpClientService
      .post(categorieDto, '/entite/categorie/add')
      .subscribe((data) => {
        this.value = 'lecture';
        this.tab.id = data.id;
        this.ngOnInit();
      });
  }
  uploadImage(event: any): void {
    const headers = {};

    const file: File = event.target.files[0];

    if (file) {
      const formData = new FormData();

      formData.append('file', file);
      formData.append('path', 'CATEGORIES/IMG1/');

      this.httpClientService
        .postWithHeader(formData, headers, '/image/addphoto/path')
        .subscribe((data) => {
          this.categorie.imagesmap = new Map([[data.id, data]]);
        });
    }
  }
  activerModification() {
    this.value = 'edition';
    this.edition = true;
    this.lecture = false;
    this.ngOnInit();
  }

  enregistrer() {
    this.categorie.maplocaletitre.forEach((val: string, key: string) => {
      this.categorie.maplocaletitre[key] = val;
    });
    this.categorie.mapdescriptioncourte.forEach((val: string, key: string) => {
      this.categorie.mapdescriptioncourte[key] = val;
    });
    this.categorie.mapdescriptionlongue.forEach((val: string, key: string) => {
      this.categorie.mapdescriptionlongue[key] = val;
    });
  }

  annuler() {}
  refresh() {
    this.ngOnInit();
  }
}
