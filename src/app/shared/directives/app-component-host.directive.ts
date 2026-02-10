import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[formFieldHost]',
})
export class FormFieldHostDirective {
  /**
   * this injects the refrence where the directive is attached
   * @param viewContainerRef
   */
  constructor(public viewContainerRef: ViewContainerRef) {}
}
