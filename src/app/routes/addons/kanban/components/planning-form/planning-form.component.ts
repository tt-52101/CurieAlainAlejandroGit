import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFSchema } from '@delon/form';
import * as moment from 'moment';

@Component({
  selector: 'app-planning-form',
  templateUrl: './planning-form.component.html',
  styleUrls: ['./planning-form.component.less'],
})
export class PlanningFormComponent implements OnInit {

  @ViewChild('form') form: SFComponent;
  @Input() schema: SFSchema;
  @Input() updateSchema: Function;

  constructor() { }

  ngOnInit() {
    if (this.updateSchema) {
      this.updateSchema(this.schema, this.form);
    }
  }

  launch() {
    return this.form.value;
  }
}
