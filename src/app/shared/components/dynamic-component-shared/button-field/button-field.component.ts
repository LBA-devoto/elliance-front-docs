import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormFieldConfig } from '../dropdown/form_field_config';
import { TaskService } from 'src/app/admin/core/services/task.service';
import { interval, Observable, Subject, switchMap } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { RxStompService } from 'src/app/admin/core/services/websocket.service';
import { UtilService } from 'src/app/admin/core/services/utilService';

@Component({
  selector: 'app-button-field',
  templateUrl: './button-field.component.html',
  styleUrls: ['./button-field.component.css'],
})

  export class ButtonFieldComponent implements OnInit {
    @Input() public config: FormFieldConfig;
    isExecuting: boolean = false;
    pollingSubscription :any
  
    private updateTaskSubject = new Subject<{ taskName: any; taskStatus: any }>();
  
    constructor(
      private taskservice: TaskService,
      private utilservice: UtilService
    ) { 
  
     
    }
  
    ngOnInit(): void {
      this.checkTaskStatus();
    }
  
    ngOnChanges(changes: SimpleChanges) {
      if (changes['config']) {
        this.config = changes['config'].currentValue;
      }
    }
  
    public ngOnDestroy(): void {
      this.stopPolling();
      
    }
  
    executeAction() {
      this.isExecuting = true;
      //this.config.elementdata.nextExecutionTime = this.utilservice.transformDate( this.config.elementdata.nextExecutionTime );
      this.taskservice.executeAction(this.config.elementdata);
      this.startPolling();
    }
  
      /**
     * Method to check the current status of the task from the backend
     */
      checkTaskStatus(): void {
        this.taskservice.getTaskStatus(this.config.elementdata.nom).subscribe((response: any) => {
          this.isExecuting = response.executing;
    
          // If task is still executing, start polling as a fallback
          if (this.isExecuting) {
            this.startPolling();
          }
        });
      }
  
      startPolling(): void {
        this.pollingSubscription = interval(5000) // Poll every 5 seconds
          .pipe(
            switchMap(() => this.taskservice.getTaskStatus(this.config.elementdata.nom))
          )
          .subscribe((response: any) => {
            if (!response.executing) {
              this.isExecuting = false;
              this.stopPolling(); // Stop polling once the task is completed
            }
          });
      }
    
      /**
       * Stop polling for task status updates.
       */
      stopPolling(): void {
        if (this.pollingSubscription) {
          this.pollingSubscription.unsubscribe();
        }
      }
}
