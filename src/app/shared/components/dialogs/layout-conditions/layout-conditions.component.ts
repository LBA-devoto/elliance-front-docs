import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Tables } from 'src/app/shared/entities/tables';
import { Parametre } from '../../../entities/parametre';
import { LayoutCondition } from '../../../entities/layoutCondition';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-layout-conditions',
  templateUrl: './layout-conditions.component.html',
  styleUrls: ['./layout-conditions.component.css'],
})
export class LayoutConditionsComponent implements OnInit, OnDestroy {

  @Input()
  public tab: Tables = new Tables();

  public conditions: LayoutCondition[] = [];

  public allParameters: Parametre[] | null = [];

  constructor(private dialog: MatDialogRef<any>) { }

  public ngOnInit(): void {
    this.allParameters = this.retrieveAllParameters();

    const conditions = this.tab.template.layout.conditions;
    if (conditions !== undefined && conditions !== null && conditions.length > 0) {
      for (const condition of conditions) {
        this.conditions.push(condition);
      }
    } else {
      this.addCondition();
    }
  }

  public ngOnDestroy(): void { }

  public onClose(): void {
    this.dialog.close();
  }

  public addCondition(): void {
    this.conditions.push({
      id: uuidv4(),
      key: '',
      value: ''
    });
  }

  public onRemoveCondition(key: string): void {
    const condition = this.conditions.find((t) => t.key === key);
    if (condition !== undefined) {
      this.conditions.splice(this.conditions.indexOf(condition), 1);
    }

    if (this.conditions.length === 0) {
      this.addCondition();
    }
  }

  public onValidate(): void {
    if (this.conditions.length > 0) {
      this.dialog.close(this.conditions);
    } else {
      this.dialog.close(null);
    }
  }

  private retrieveAllParameters(): Parametre[] | null {
    if (this.tab.template === undefined || this.tab.template == null) {
      return null;
    }

    if (
      this.tab.template.layout === undefined ||
      this.tab.template.layout == null
    ) {
      return null;
    }

    const allParameters: Parametre[] = [];
    this.tab.template.layout.tabs.forEach((t) => {
      t.rows.forEach((r) => {
        r.cols.forEach((c) =>
          c.parameters.forEach((p) => allParameters.push(p))
        );
      });
    });

    if (
      this.tab.template.parameters !== undefined &&
      this.tab.template.parameters !== null
    ) {
      this.tab.template.parameters.forEach((p) => allParameters.push(p));
    }

    const allParametersWithoutDuplicates: Parametre[] = [...new Set(allParameters)];
    allParametersWithoutDuplicates.sort((a: Parametre, b: Parametre) => {
      const aStr = (a.label !== '' ? a.label : a.name).toLowerCase();
      const bStr = (b.label !== '' ? b.label : b.name).toLowerCase();

      if (aStr < bStr) {
        return -1;
      } else if (aStr > bStr) {
        return 1;
      }

      return 0;
    });

    return allParametersWithoutDuplicates;
  }
}
