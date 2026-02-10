import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { Parametre } from '../../../entities/parametre';

@Component({
  selector: 'app-template-parameter',
  templateUrl: './template-parameter.component.html',
  styleUrls: ['./template-parameter.component.css']
})
export class TemplateParameterComponent implements OnInit {

  @Input()
  public id: string;

  @Input()
  public parameters: Parametre[];

  @Input()
  public parametersConnection: string[];

  @Output()
  public parameterDropped = new EventEmitter<any>();

  ngOnInit() {
    if (this.parametersConnection !== undefined && this.parametersConnection !== null) {
      this.parametersConnection = this.parametersConnection.filter((id: string) => id !== this.id);
    }
  }

  onParameterDropped(event: CdkDragDrop<any[]>) {
    this.parameterDropped.emit(event);
  }
}
