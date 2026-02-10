import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TaskService } from 'src/app/admin/core/services/task.service';
import { DiaologHostComponent } from '../../dialogs/dialog-host/dialog-host';
import { TabService } from 'src/app/shared/services/tab.service';
import { DatePipe } from '@angular/common';
import { UtilService } from 'src/app/admin/core/services/utilService';

@Component({
  selector: 'app-task-scheduler',
  templateUrl: './task-scheduler.component.html',
  styleUrls: ['./task-scheduler.component.css'],
})
export class TaskSchedulerComponent {
  constructor(
    private taskService: TaskService,
    private myTableService: TabService,
    private datePipe: DatePipe,
    private utilservice: UtilService,
    private dialogRef: MatDialogRef<DiaologHostComponent>
  ) {}
  @Input() public tab: any;
  taskName: string = '';
  scheduleType: string = 'daily';
  selectedDays: { [key: string]: boolean } = {};
  dayOfMonth: number = 1;
  executionTime: string = '';

  nextExecutionDate: Date;
  daysOfWeek: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  validateDayOfMonth() {
    // Ensure that dayOfMonth is a positive integer
    this.dayOfMonth = Math.max(1, Math.floor(this.dayOfMonth));

    // Get the maximum valid day for the selected month
    const maxDay = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    ).getDate();

    // Ensure that dayOfMonth does not exceed the maximum valid day
    this.dayOfMonth = Math.min(this.dayOfMonth, maxDay);
  }

  scheduleTask() {
    this.executionTime = this.executionTime || '05:30';

    let payload = this.tab.config.elementdata;
    payload.scheduleType = this.scheduleType;
    if (this.scheduleType == 'monthly') payload.dayOfMonth = this.dayOfMonth;
    payload.selectedDays = this.selectedDays;

    if (this.scheduleType === 'daily') {
      this.nextExecutionDate = this.calculateNextDailyExecution();
    } else if (this.scheduleType === 'weekly') {
      this.nextExecutionDate = this.calculateNextWeeklyExecution();
    } else if (this.scheduleType === 'monthly') {
      this.nextExecutionDate = this.calculateNextMonthlyExecution();
    }

    //payload.nextExecutionTime = this.nextExecutionDate;
    payload.nextExecutionTime = this.datePipe.transform(
      this.nextExecutionDate,
      "yyyy-MM-ddTHH:mm:ss.SSS'Z'"
    );

    let url = '/task/add';
    this.taskService
      .enregistrerTask(payload, url)
      .subscribe((responseTask: any) => {
        if (responseTask) {
          this.myTableService.updateOrAddItem(responseTask, 'TachePlanifiee');
        }

        this.dialogRef.close(responseTask);
      });
    // You can implement the task scheduling logic here.
  }

  updateSelectedDays(selectedDay: string): void {
    // Ensure only one day is selected at a time
    for (const day of this.daysOfWeek) {
      if (day !== selectedDay) {
        this.selectedDays[day] = false;
      }
    }
  }

  calculateNextDailyExecution(): Date {
    const currentDate = new Date();
    const currentTime = this.executionTime.split(':');
    const hours = parseInt(currentTime[0], 10);
    const minutes = parseInt(currentTime[1], 10);

    let nextExecutionDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1,
      hours,
      minutes
    );

    return nextExecutionDate;
  }
  calculateNextWeeklyExecution(): Date {
    const currentDate = new Date();
    const currentTime = this.executionTime.split(':');
    const hours = parseInt(currentTime[0], 10);
    const minutes = parseInt(currentTime[1], 10);

    let daysUntilNextExecution = 0;
    for (const day of this.daysOfWeek) {
      if (this.selectedDays[day]) {
        const dayIndex = this.daysOfWeek.indexOf(day);
        const daysToAdd =
          dayIndex -
          currentDate.getDay() +
          (dayIndex < currentDate.getDay() ? 7 : 0);
        daysUntilNextExecution = daysToAdd;
        break;
      }
    }

    let nextExecutionDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + daysUntilNextExecution,
      hours,
      minutes
    );

    return nextExecutionDate;
  }

  calculateNextMonthlyExecution(): Date {
    const currentDate = new Date();
    const currentTime = this.executionTime.split(':');
    const hours = parseInt(currentTime[0], 10);
    const minutes = parseInt(currentTime[1], 10);

    const selectedDayOfMonth = Math.min(this.dayOfMonth, 28); // Ensure a valid day

    let nextExecutionDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      selectedDayOfMonth,
      hours,
      minutes
    );

    return nextExecutionDate;
  }

  annuler() {
    this.dialogRef.close();
  }
}
