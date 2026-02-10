import {
  Component,
  Input,
  ComponentFactoryResolver,
  ViewChild,
  OnInit,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';
import { EntityService } from 'src/app/admin/core/services/entity.service';
import { EntiteDirective } from '../../directives/entite.directives';
import { Table } from '../../entities/Table';
import { Tables } from '../../entities/tables';

@Component({
  selector: 'app-tab-content',
  templateUrl: './tab-content.component.html',
  styleUrls: ['./tab-content.component.css'],
})
export class TabContentComponent implements OnInit {
  @Input() tab: any;
  @ViewChild(EntiteDirective, { static: true })
  entiteDirective: EntiteDirective;

  constructor(private entiteService: EntityService) {}
  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tab']) {
      let tab = changes['tab'].currentValue;
      this.entiteService.loadComponent(
        this.entiteDirective.viewContainerRef,
        tab,
        tab.value
      );
    }
  }
}
