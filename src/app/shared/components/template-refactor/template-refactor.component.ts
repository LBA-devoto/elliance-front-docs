import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { TemplateService } from 'src/app/services/template.service';
import { Tables } from '../../entities/tables';
import { TemplateFieldObj } from '../../entities/template-field-Obj';

@Component({
  selector: 'app-template-refactor',
  templateUrl: './template-refactor.component.html',
  styleUrls: ['./template-refactor.component.css'],
})
export class TemplateRefactorComponent implements OnInit {
  @Input() public value: string;
  @Input() public tab: Tables = new Tables();
  edition: boolean;
  lecture: boolean;
  template: TemplateFieldObj[] = [];
  data: any = new Object();
  onecolumn: boolean = false;
  twocolumn: boolean = false;
  viewoncolumn: boolean = true;
  viewtwocolumn: boolean = false;

  constructor(
    private httpclientService: HttpclientService,
    private templateService: TemplateService
  ) {}

  ngOnInit(): void {
    this.edition = false;
    if (this.tab.value === 'edition') {
      this.edition = true;
      this.lecture = false;
      this.twocolumn = true;
      this.tab.edition = true;
      this.tab.lecture = false;
    } else if (this.tab.value === 'lecture') {
      this.edition = false;
      this.lecture = true;
      this.tab.lecture = true;
      this.tab.edition = false;
      this.viewtwocolumn = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tab']) {
      this.tab = changes['tab'].currentValue;
    }
  }
}
