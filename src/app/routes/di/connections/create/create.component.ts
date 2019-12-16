import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { PdiService } from '@core/services/pdi.service';
import { DateCronJob } from '@shared/models/DateCronJob';

@Component({
    selector: 'app-di-connections-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.less']
})
export class DiConnectionsCreateComponent implements OnInit {
    record: any = {};
    @ViewChild("sf") div1;
    @Input() schema: SFSchema;
    @Input() schema2: SFSchema;

    ChangeData: any;
    /**
     * Elemento que se recibe 
     */
    i: any;

    pos = -1;

    constructor(
        private modal: NzModalRef,
        private msgSrv: NzMessageService,
        public http: _HttpClient,
        private pdiService: PdiService
    ) { }

    ngOnInit(): void {
    }

    /**Inserta un elemento en data */
    async save(value: any, template: any) {
        let mss = '';
        await this.pdiService.createConnection(value,template).toPromise();
        await this.pdiService.editSpecificKtr(value).toPromise();
        if (value.origenpass != "" || value.destpass != "") {
            await this.pdiService.executeTransform().toPromise();
        }
        mss = 'Conexión creada';

        this.msgSrv.success(mss);

        return "Creada correctamente";
    }
}