import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

import { FormFieldConfig } from '../dropdown/form_field_config';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/admin/core/services/user.service';
import { type } from 'os';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css'],
})
export class DateComponent implements OnInit {
  @Input() config: FormFieldConfig;
  @Input() data: any;
  editMode: boolean = false;
  selectedDate: any;
  formattedDate: any;
  selectedDateControl: FormControl = new FormControl();
  typeName: any;

  constructor(private datePipe: DatePipe, public userService: UserService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.config = changes['config'].currentValue;
      this.typeName = this.config.typeName;
      this.editMode = this.config.editMode;
      this.selectedDate = this.config.value;
      this.formatToDatePicker(this.config?.value);
    }
  }

  ngAfterViewInit() {
    this.formatToDatePicker(this.config?.value);
  }

  formatToDatePicker(dateString: any): any {
    if (dateString == null) {
      return null;
    }
    // Split the string into day, month, and year parts dd-MM-yyyy
    const parts = dateString.split('-');
    const day = parseInt(parts[0], 10); // Parse the day part as an integer
    const month = parseInt(parts[1], 10) - 1; // Parse the month part as an integer (subtract 1 as months are zero-based)
    const year = parseInt(parts[2], 10); // Parse the year part as an integer
    const selectedDateObj = new Date(year, month, day); // Create a new Date object

    const formattedDate = this.datePipe.transform(
      selectedDateObj,
      'yyyy-MM-dd'
    );

    if (formattedDate) {
      this.selectedDateControl.setValue(formattedDate);
    } else {
      console.error('Failed to format the date:', this.selectedDate);
    }
  }

  formatDate(dateString: any): any {
    if (dateString == null) {
      return null;
    }
    const parts = dateString.split('-'); // Split the string into day, month, and year parts yyyy-MM-dd
    const day = parseInt(parts[2], 10); // Parse the day part as an integer
    const month = parseInt(parts[1], 10) - 1; // Parse the month part as an integer (subtract 1 as months are zero-based)
    const year = parseInt(parts[0], 10); // Parse the year part as an integer
    const selectedDateObj = new Date(year, month, day); // Create a new Date object

    const formattedDate = this.datePipe.transform(
      selectedDateObj,
      'dd-MM-yyyy'
    );
    if (formattedDate) {
      this.selectedDate = formattedDate;
    } else {
      console.error('Failed to format the date:', this.selectedDate);
    }

    return this.selectedDate;
  }
}
