import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector:"testselector"
})
export class TestDirective
{
    constructor(public viewContainerRef:ViewContainerRef)
    {

    }
}