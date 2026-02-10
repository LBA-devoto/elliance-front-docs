import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[entiteHost]',
})
export class EntiteDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
