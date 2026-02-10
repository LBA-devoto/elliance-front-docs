import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';
import { LoadingSpinnerComponent } from '../components/dialogs/loading-spinner/loading.spinner.component';

const OVERLAY_CLASS = 'loading-overlay';

// This directive places an overlay with a loading spinner over its host element
// if isLoading equals to true and hides the overlay when isLoading becomes false.
@Directive({
  selector: '[appLoading]',
})
export class LoadingDirective implements OnChanges {
  @Input('appLoading')
  isLoading = false;

  protected overlayElement!: HTMLDivElement;
  protected spinnerElement!: HTMLDivElement;
  protected hostElement!: HTMLDivElement;

  constructor(
    protected readonly elementRef: ElementRef,
    protected readonly renderer: Renderer2,
    protected readonly changeDetectorRef: ChangeDetectorRef,
    protected readonly viewContainerRef: ViewContainerRef,
    protected readonly componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.hostElement = this.elementRef.nativeElement;
    this.hostElement.style.position = 'relative';
  }

  ngOnChanges(change: SimpleChanges): void {
    if (!this.overlayElement || !this.spinnerElement) {
      this.init();
    }

    if (change['isLoading']) {
      const isLoadingValue = change['isLoading'].currentValue;

      if (isLoadingValue) {
        this.addLoadingIndicator();
      } else {
        this.removeLoadingIndicator();
      }

      this.changeDetectorRef.markForCheck();
    }
  }

  protected addLoadingIndicator(): void {
    this.renderer.appendChild(this.hostElement, this.overlayElement);
    this.renderer.appendChild(this.overlayElement, this.spinnerElement);
  }

  protected removeLoadingIndicator(): void {
    this.renderer.removeChild(this.overlayElement, this.spinnerElement);
    this.renderer.removeChild(this.hostElement, this.overlayElement);
    this.viewContainerRef.clear();
  }

  protected init(): void {
    this.initOverlayElement();
    this.initSpinnerComponent();
  }

  protected initSpinnerComponent(): void {
    const spinnerComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        LoadingSpinnerComponent
      );
    const spinnerComponent = this.viewContainerRef.createComponent(
      spinnerComponentFactory
    );
    this.spinnerElement = spinnerComponent.location.nativeElement;
  }

  protected initOverlayElement(): void {
    this.overlayElement = this.renderer.createElement('div');
    this.renderer.addClass(this.overlayElement, OVERLAY_CLASS);
  }
}
