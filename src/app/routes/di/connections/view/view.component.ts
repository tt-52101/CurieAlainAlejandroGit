import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { SFComponent, SFSchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { STColumnBadge } from '@delon/abc';

@Component({
  selector: 'app-di-connections-view',
  templateUrl: './view.component.html',
})
export class DiConnectionsViewComponent implements OnInit {
  record: any = {};
  i: any;
  @ViewChild('form') form: SFComponent;
  @Input() schema: any;
  BADGE: STColumnBadge = {
    0: { text: 'Error', color: 'error' },
    1: { text: 'Activo', color: 'success' },
    2: { text: 'Inactivo', color: 'default' },
    3: { text: 'Procesando', color: 'processing' },
    4: { text: 'Warning', color: 'warning' },
  };

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient
  ) { }

  ngOnInit(): void {
    console.log(this.form);
    console.log(this.schema)
    console.log()
  }

  close() {
    this.modal.destroy();
  }

}
