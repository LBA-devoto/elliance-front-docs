import { Injectable, NgZone } from '@angular/core';
import { asyncScheduler, BehaviorSubject, Observable } from 'rxjs';
import { finalize, observeOn } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading: boolean = false;

  constructor() {}

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  getLoading(): boolean {
    return this.loading;
  }
}
