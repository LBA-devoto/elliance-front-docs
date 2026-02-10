import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-view',
  templateUrl: './template-view.component.html',
  styleUrls: ['./template-view.component.css'],
})
export class TemplateViewComponent implements OnInit {
  @Input() public template: any;
  constructor() {}

  ngOnInit(): void {}
}
