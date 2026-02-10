import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Parametre } from 'src/app/shared/entities/parametre';

@Component({
  selector: 'app-parameter-link',
  templateUrl: './parameter-link.component.html',
  styleUrls: ['./parameter-link.component.css'],
})
export class ParameterLinkComponent implements OnInit {
  @Input() config: any;

  constructor(private httpService: HttpClient) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.config = changes['config'].currentValue;

      let id = '' + this.config?.value?.parameterId + '';
      this.getById(id);

      // } else if (
      //   Array.isArray(this.config.value) &&
      //   this.config.value.length > 0
      // ) {
      //   if (this.config.value.every((item: any) => typeof item === 'object')) {
      //     this.config.isList = true;
      //   } else if (
      //     this.config.value.every((item: any) => typeof item === 'string')
      //   ) {
      //     this.getbyIds(this.config.value);
      //   }
      // }
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

  getById(id: string) {
    if (!id) {
      return;
    }

    let url = `/parametre/${id}`;

    this.httpService.get(url).subscribe(
      (data: any) => {
        this.config.isList = true;
        this.config.value = data;
      },
      (error: any) => {
        console.error('Error fetching data:', error);
        // Handle error appropriately, e.g., show an error message to the user
      }
    );
  }
}
