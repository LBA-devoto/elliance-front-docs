import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { type } from 'os';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-object-column',
  templateUrl: './object-column.component.html',
  styleUrls: ['./object-column.component.css'],
})
export class ObjectColumnComponent implements OnInit {
  @Input() config: any;

  constructor(private httpService: HttpClient) {}

  ngOnInit(): void {
  
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['config']) {

      this.config = changes['config'].currentValue;
     if (typeof this.config.value === 'string') {
        let ids = ['' + this.config.value + ''];
        this.getbyIds(ids);
      } else if (
        Array.isArray(this.config.value) &&
        this.config.value.length > 0
      ) {
        if (this.config.value.every((item: any) => typeof item === 'object')) {
          this.config.isList = true;
        } else if (
          this.config.value.every((item: any) => typeof item === 'string')
        ) {
          this.getbyIds(this.config.value);
        }
      }
    }
  }
  getbyIds(ids: any[]) {
    if (
      ids === null ||
      ids === undefined ||
      ids.length === 0 ||
      !this.config.linkedEntite ||
      this.config.linkedEntite === ''
    ) {
      return;
    }
    if (typeof ids[0] !== 'string') {
      ids = ids.map((id) => id.toString());
    }

    this.httpService
      .post<any[]>(
        `/view/filtrerById/${this.config.linkedEntite.toLowerCase()}`,
        ids
      )
      .subscribe((data: any) => {
        this.config.isList = true;
        this.config.value = data.response;
      });
  }
}
