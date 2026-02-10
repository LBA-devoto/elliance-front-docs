import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TemporaryIdService {
  public idCounter = 100;

  constructor() { }

  generateId(): string {
    this.idCounter++;
    return `viewid-${this.idCounter}`;
  }
}
