import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { PdiService } from '@core/services/pdi.service';
import { DateCronJob } from '@shared/models/DateCronJob';

@Component({
  selector: 'app-di-connections-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class DiConnectionsEditComponent implements OnInit {
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
  async save(value: any) {
    let mss = '';
    const cronjob: DateCronJob = new DateCronJob({
      frecuencia: value.frecuencia,
      number: value.tiempo
    });
    value.frecuencia = cronjob.getResult();
    await this.pdiService.editSpecificKtr(value).toPromise();
    //Confirmar si se ha rellendo una contraseña o no para encriptarlas
    if (value.origenpass != "" || value.destpass != "") {
      await this.pdiService.executeTransform().toPromise();
    }
    //Confirmar el estado para saber si lanzar o no el cronjob.
    if (value.estado == 1) {
      await this.pdiService.executeCronJob(value).toPromise();
    }
    mss = 'Conexión modificada';

    this.msgSrv.success(mss);

    return "Todo correcto";
  }
}