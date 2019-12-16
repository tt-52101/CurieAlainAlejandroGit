import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { environment } from '@env/environment';

@Component({
  selector: 'exception-401',
  // template: `<exception type="401" style="min-height: 500px; height: 80%;"></exception>`,
  template: `<result
  type="error"
  title="No sabemos quién eres"
  description="Es necesario tener una sesión activa para usar este servicio"
  >
  <a nz-button nzType="primary" href="${environment.domain}/crm">Iniciar sesión</a>
  </result>`,
})
export class Exception401Component {
  constructor(modalSrv: NzModalService) {
    modalSrv.closeAll();
  }
}
