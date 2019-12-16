import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { Router, ActivatedRoute } from '@angular/router';
import { Themes } from './../config';
import { CrmService } from '@core/services/crm.service';
import { Modules } from '@shared/utils/modules.enum';


@Component({
  selector: 'app-templates-layout',
  templateUrl: './templates-layout.component.html',
  styleUrls: ['./templates-layout.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesLayoutComponent implements OnInit {

  q: any = {
    ps: 8, // Numero de plantillas 
    categories: [], // Categorias
    owners: ['zxx'],
  };

  loading = true;
  templatesCRM = [];
  templatesDesign = Themes;
  token = ''

  constructor(
    private router: Router,
    private http: _HttpClient,
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private crmService: CrmService,
    private activateRoute: ActivatedRoute,
  ) {}

  /**
   * ngOnInit se comprueba el item landingpage de localstorage
   */
  async ngOnInit() {
    if(localStorage.getItem('landingpage') !== '' && localStorage.getItem('landingpage') !== null){
      this.activateRoute.queryParams.subscribe(params => {
        // this.router.navigateByUrl(`/addons/layoutNewsletter?token=${params['token']}`);
        this.router.navigateByUrl(`/addons/landingpage/build?token=${params['token']}`);
      });
    }else{
      localStorage.setItem('landingpage', '');
      this.activateRoute.queryParams.subscribe(params => {
        this.token = params['token']
      });
      this.templatesCRM = [...await this.crmService.getLists(Modules.plantillas).toPromise()];
      this.getData();
    }
  }

  /**
   * Hay que quitar esta función
   */
  getData() {
    this.loading = true;
    this.http.get('/api/list', { count: this.q.ps }).subscribe((res: any) => {
      this.loading = false;
      this.cdr.detectChanges();
    });
  }


 /**
   * Carga la plantilla(Diseño) seleccionada en el canvas
   * @param item plantilla
   */
  openTemplate(tem) {
    let that = this;
    fetch(tem.content)
      .then(function(res) {
        return res.text();
      })
      .then(function(res) {
        localStorage.setItem('landingpage', res);
        that.activateRoute.queryParams.subscribe(params => {
        //  that.router.navigateByUrl(`/addons/layoutNewsletter?token=${params['token']}`);
       
        that.router.navigateByUrl(`/addons/landingpage/build?token=${params['token']}`);
        });
       
      });
  }

  /**
   * Carga la plantilla(CRM) seleccionada en el canvas
   * @param item plantilla
   */
  openTemplateCRM(item): void {
    let that = this;
    localStorage.setItem('landingpage', item.content);
    that.activateRoute.queryParams.subscribe(params => {
      // that.router.navigateByUrl(`/addons/layoutNewsletter?token=${params['token']}`);
      that.router.navigateByUrl(`/addons/newslelandingpagetter/build?token=${params['token']}`);
    });
    }

}
