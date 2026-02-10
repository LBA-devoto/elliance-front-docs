import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { Observable, Subject, Subscription, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message, Stomp } from '@stomp/stompjs';

import { HttpclientService } from './httpclientService';
import { RxStomp } from '@stomp/rx-stomp';
import { RxStompService } from './websocket.service';
import { TabService } from 'src/app/shared/services/tab.service';
import { DatePipe, formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private taskSubject = new Subject<any>();
  public stompClient: any;
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private httpService: HttpclientService,
    private rxStompService: RxStompService,
    private myTableService: TabService,
    private datePipe: DatePipe
  ) {}

  private topicSubscription: Subscription;

  subscribeToTaskStatus(): Observable<any> {
    this.rxStompService.watch('/topic/message').subscribe((x) => {});
    return this.rxStompService.watch('/topic/message');
  }
 

  executeAction(task: any) {

    task.nextExecutionTime = this.transformDateForBackend(
      task.nextExecutionTime
    );
 
    this.httpService.post(task, '/task/execute').subscribe((x) => {
  
      // HTTP POST request completed, now you can receive WebSocket messages
    });
  }

  enregistrerTask(task: any, url: string): Observable<any> {
    return this.httpService.post(task, url);
  }

  transformDateForBackend(input: any) {
    let dateObj: Date;

    // Check if input is a string
    if (typeof input === 'string') {
      // Check if 'Z' is already present
      input = input.includes('Z') ? input : input + 'Z';

      // Check if input has fewer digits
      if (input.length < 24) {
        // Append zeros to match the required format
        const diff = 24 - input.length;
        input = input.substring(0, 19) + '.' + '0'.repeat(diff) + 'Z';
      }

      // Try to parse the adjusted string into a Date object
      dateObj = new Date(input);

      // Check if the parsing was successful
      if (isNaN(dateObj.getTime())) {
        // Parsing failed, return the original input
        return input;
      }
    } else if (input instanceof Date) {
      // If input is already a Date object, use it
      dateObj = input;
    } else {
      // If input is not a string or Date object, return input
      return input;
    }

    // Adjust the time zone offset
    dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());

    // Use datePipe.transform with the Date object
    let formatDate = this.datePipe.transform(
      dateObj,
      "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
      this.locale
    );

    return formatDate;
  }
  getTaskStatus(taskName: string): Observable<any> {
    return this.httpService.post({"taskName":taskName},"/task/findByName");
  }
  transformDate(input: any) {
    if (typeof input === 'string') {
      // Check if 'Z' is already present
      input = input.includes('Z') ? input : input + 'Z';
    }

    let formatDate = this.datePipe.transform(
      input,
      "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
      this.locale
    );
    return formatDate;
  }
}
