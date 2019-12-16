import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector, ViewContainerRef, EmbeddedViewRef, ComponentRef } from '@angular/core';
import { GlobalSpinComponent } from '@shared/components/global-spin/global-spin.component';

@Injectable({
  providedIn: 'root'
})
export class SpinerFactoryService {

  spinnerComponentRef: ComponentRef<GlobalSpinComponent>;
  constructor(
    private componentFactory: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {

  }

  show() {
      const spinner = this.componentFactory.resolveComponentFactory(GlobalSpinComponent);
      const componentRef = spinner.create(this.injector);
      this.appRef.attachView(componentRef.hostView);
      const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
      document.body.appendChild(domElem);
      this.spinnerComponentRef = componentRef;
  }

  hide() {
    this.appRef.detachView(this.spinnerComponentRef.hostView);
    this.spinnerComponentRef.destroy();
  }


}
