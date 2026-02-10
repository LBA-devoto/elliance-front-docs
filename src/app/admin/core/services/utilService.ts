import { DatePipe, formatNumber } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private datePipe: DatePipe
  ) {}
  selectedDate: any;
  // rework this when the login service is provided
  // checkUserLogin() {
  //   let token = localStorage.getItem('token');
  //   if (token === '' || token == undefined) {
  //     return false;
  //   } else return true;
  // }
  formatNumberToInteger(num: number) {
    return formatNumber(num, this.locale, '1.0-0');
  }
  waitForElm(selector: string) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }
  formatDate(dateString: any): any {
    if (dateString == null || dateString === undefined) {
      return null;
    }

    // Check if dateString is a string before attempting to split
    if (typeof dateString === 'string') {
      

      // Remove 'Z' at the end to ensure consistent parsing
      dateString = dateString.replace('Z', '');

      const dateObj = new Date(dateString);

      if (!isNaN(dateObj.getTime())) {
        // Check if dateObj is a valid date
        const formattedDate = this.datePipe.transform(
          dateObj,
          'dd-MM-yyyy HH:mm:ss.SSSZ',
          'Europe/Paris' // Use the IANA time zone identifier for France
        );

        if (formattedDate) {
          this.selectedDate = formattedDate; // Display date with time
        } else {
          console.error('Failed to format the date:', dateString);
        }
      } else {
        console.error('Invalid date:', dateString);
      }
    } else {
      console.error('Invalid date format:', dateString);
    }

    return this.selectedDate;
  }

  transformDate(input: any) {
    let formatDate = this.datePipe.transform(
      input,
      "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
    );
    return formatDate;
  }

  checkRespo(status: any) {}
}
