import {
  Component,
  OnInit,
  ViewChild,
  SimpleChanges,
  Input,
} from '@angular/core';
import { EntityService } from 'src/app/admin/core/services/entity.service';
import { EntiteDirective } from '../../../directives/entite.directives';

@Component({
  selector: 'app-generic-dialog',
  templateUrl: './generic-dialog.component.html',
  styleUrls: ['./generic-dialog.component.css'],
})
export class GenericDialogComponent implements OnInit {
  @Input() tab: any;
  @ViewChild(EntiteDirective, { static: true })
  entiteDirective: EntiteDirective;
  constructor(private entiteService: EntityService) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['tab']) {
      let tab = changes['tab'].currentValue;
      this.entiteService.loadDialogComponent(
        this.entiteDirective.viewContainerRef,
        tab
      );
    }
  }
}
