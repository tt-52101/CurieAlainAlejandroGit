import { Directive, ElementRef, Input, OnInit, Renderer } from '@angular/core';
import * as moment from 'moment';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[duedate]'
})
export class DueDateColorDirective implements OnInit {

  @Input('duedate') datecheck: Date;

  constructor(
    private el: ElementRef,
    private renderer: Renderer
  ) { }

  ngOnInit() {
    if (moment().isAfter(this.datecheck)) {
      this.renderer.setElementStyle(this.el.nativeElement, 'color', 'red');
    }
  }
}
