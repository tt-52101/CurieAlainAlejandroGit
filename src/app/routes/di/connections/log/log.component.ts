import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { STColumnBadge } from '@delon/abc';
import { SFComponent, SFSchema } from '@delon/form';
import { PdiService } from '@core/services/pdi.service';
import { fstat } from 'fs';
import { data } from '../data';

@Component({
    selector: 'app-di-connections-log',
    templateUrl: './log.component.html',
})
export class DiConnectionsLogComponent implements OnInit {
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
        public http: _HttpClient,
        private pdiService: PdiService
    ) { }

    ngOnInit(): void {
    }

    close() {
        this.modal.destroy();
    }
}