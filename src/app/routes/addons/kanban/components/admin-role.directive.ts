import { Directive, ElementRef, OnInit, Renderer } from '@angular/core';
import { LoginService } from '@core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[adminRole]'
})
export class AdminRoleDirective implements OnInit {

  constructor(
    private el: ElementRef,
    private renderer: Renderer,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    if (!this.loginService.user.roles.has('H2') && !this.loginService.user.roles.has('H8')) {
      this.renderer.setElementStyle(this.el.nativeElement, 'display', 'none');
      (this.el.nativeElement as HTMLElement).parentElement.prepend(document.createElement('span'));
    }
  }

}
