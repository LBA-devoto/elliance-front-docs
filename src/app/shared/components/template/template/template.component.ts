import { Component, Input, OnInit } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { TemplateService } from 'src/app/services/template.service';
import { Tables } from 'src/app/shared/entities/tables';
import { Template } from 'src/app/shared/entities/template';
import { PageOptions } from 'src/app/shared/enums/page-modes';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
})
export class TemplateComponent implements OnInit {
  public pageOptions = PageOptions;
  public pageOption = PageOptions.WAIT;

  @Input() public value: string;
  @Input() public tab: Tables = new Tables();
  edition: boolean;
  lecture: boolean;

  @Input() public template: Template = new Template();
  currentTemplate: Template = new Template();

  onecolumn: boolean = false;
  twocolumn: boolean = false;
  viewoncolumn: boolean = true;
  viewtwocolumn: boolean = false;

  constructor(
    private httpclientService: HttpclientService,
    private templateService: TemplateService
  ) {}

  ngOnInit(): void {
    if (this.tab.value === 'edition') {
      this.edition = true;
      this.lecture = false;
      this.twocolumn = true;

      //teste
      this.templateService.getDefaut(this.tab.entite).subscribe((rs) => {
        this.template = rs;
        if (this.template.layout == null) {
          this.tab.value === 'lecture';
        }
        if (this.template.layout) {
          this.template.layout.tabs.map((tab) =>
            tab.rows.map((row) =>
              row.cols.map((col) =>
                col.parameters.map((param) => {
                  if (
                    (param.type === 'class' || param.type === 'Checkbox') &&
                    !param.list &&
                    param.request
                  ) {
                    this.templateService
                      .requestApi(param.request)
                      .subscribe((data) => (param.list = data));
                  }
                })
              )
            )
          );
        }
      });
    } else if (this.tab.value === 'lecture') {
      this.edition = false;
      this.lecture = true;
      this.viewtwocolumn = true;
      this.templateService
        .getTemplateAndData(this.tab.entite, this.tab.id)
        .subscribe((rs) => {
          this.template = rs;
          this.template.layout.tabs.map((tab) =>
            tab.rows.map((row) =>
              row.cols.map((col) =>
                col.parameters.map((parametre) => {
                  if (parametre.multiLangue === true) {
                    parametre.parametres.map((sousParametre) => {
                      if (sousParametre.label === 'fr_FR') {
                        sousParametre.visible = true;
                      }
                    });
                  }
                })
              )
            )
          );
        });
    }
  }

  getTemplate(value: any) {
    this.edition = false;
    this.lecture = true;
    this.template = value;
    if (value.nombrecolonne == 1) {
      this.twocolumn = false;
      this.onecolumn = true;
      this.viewoncolumn = true;
      this.viewtwocolumn = false;
    } else if (value.nombrecolonne == 2) {
      this.onecolumn = false;
      this.twocolumn = true;
      this.viewtwocolumn = true;
      this.viewoncolumn = false;
    }
  }

  modeEdition(value: any) {
    this.lecture = false;
    this.edition = true;
    if (value.nombrecolonne == 1) {
      this.twocolumn = false;
      this.onecolumn = true;
    } else if (value.nombrecolonne == 2) {
      this.onecolumn = false;
      this.twocolumn = true;
    }

    if (this.template.layout) {
      this.template.layout.tabs.map((tab) =>
        tab.rows.map((row) =>
          row.cols.map((col) =>
            col.parameters.map((param) => {
              if (
                (param.type === 'class' || param.type === 'Checkbox') &&
                !param.list &&
                param.request
              ) {
                this.templateService
                  .requestApi(param.request)
                  .subscribe((data) => (param.list = data));
              }
            })
          )
        )
      );
    }
  }
}
