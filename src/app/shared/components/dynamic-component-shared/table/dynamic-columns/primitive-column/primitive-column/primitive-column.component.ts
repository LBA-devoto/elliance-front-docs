import { Component, OnInit,Input ,SimpleChanges} from '@angular/core';
import { TemplateService } from 'src/app/services/template.service';

@Component({
  selector: 'app-primitive-column',
  templateUrl: './primitive-column.component.html',
  styleUrls: ['./primitive-column.component.css']
})
export class PrimitiveColumnComponent implements OnInit {


  @Input() config: any;

  constructor(public templateService:TemplateService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.config = changes['config'].currentValue;
      
    
     
    }
  }
}
