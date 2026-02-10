import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css'],
})
export class TextareaComponent implements OnInit {
  @Input() config: any;
  @Input() data: any;

  constructor() {}

  ngOnInit(): void {}
}
