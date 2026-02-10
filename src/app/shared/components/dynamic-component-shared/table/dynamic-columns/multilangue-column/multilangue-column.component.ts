import { I } from '@angular/cdk/keycodes';
import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { Language } from 'src/app/shared/entities/language';

@Component({
  selector: 'app-multilangue-column',
  templateUrl: './multilangue-column.component.html',
  styleUrls: ['./multilangue-column.component.css'],
})
export class MultilangueColumnComponent implements OnInit {
  @Input() config: any;
  languages: Language[];

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.config = changes['config'].currentValue;

      if (this.config.languages) {
        this.languages = this.config?.languages;
      }
    }
  }

  isVisible(locale: any): boolean {
    return (
      this.languages?.find((l) => l.key === locale && l.selected) !== undefined
    );
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }
}
