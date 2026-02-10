import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormFieldHostDirective } from '../directives/app-component-host.directive';
import { AddComponent } from '../entities/add.component';
import { MenuActions } from '../enums/menu-actions';

@Component({
  selector: 'app-ui-builder',
  templateUrl: './app-ui-builder.component.html',
  styleUrls: [],
})
export class AppUIBuilderComponent implements OnInit, OnDestroy, OnChanges {
  @Input() components!: AddComponent[];
  @ViewChild(FormFieldHostDirective, {
    static: true,
    read: FormFieldHostDirective,
  })
  componentHost!: FormFieldHostDirective;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.buildComponents();
  }

  ngOnInit(): void {
    this.buildComponents();
  }

  private buildComponents() {
    this.componentHost.viewContainerRef.clear();

    for (const component of this.components) {
      if (!!component) {
        const viewContainerRef = this.componentHost.viewContainerRef;
        const componentRef = viewContainerRef.createComponent<AddComponent>(
          component.component
        );
        componentRef.instance.config = component.config;
        componentRef.instance.data = component.config.data;
      }
    }
  }

  ngOnDestroy(): void {
    this.components = [];
  }

  processMenuAction(action: MenuActions) {}
}
