import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { Router , ActivatedRoute} from '@angular/router';
import { Themes } from './../config';
import { CrmService } from '@core/services/crm.service';
import { Modules } from '@shared/utils/modules.enum';
import { TemplatesService } from '@core/services/templates.service'

@Component({
  selector: 'app-templates-newsletter-layout',
  templateUrl: './templates-newsletter-layout.component.html',
  styleUrls: ['./templates-newsletter-layout.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplatesNewsletterLayoutComponent implements OnInit {
  @Input() templates;

  q: any = {
    ps: 13, // Numero de plantillas
    categories: [], // Categorias
    owners: ['zxx'],
  };

  loading = true
  templatesCRM = []
  templatesDesign = Themes
  token = ''
  isVisible = false
  previewTitle
  previewImg

  constructor(
    private router: Router,
    private http: _HttpClient,
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private crmService: CrmService,
    private activateRoute: ActivatedRoute,
    private TemplatesService: TemplatesService
  ) {}

  /**
   * ngOnInit se comprueba el item newsletter de localstorage
   */
  async ngOnInit() {
    if(localStorage.getItem('newsletter') !== '' && localStorage.getItem('newsletter') !== null){
      this.activateRoute.queryParams.subscribe(params => {
        this.router.navigateByUrl(`/addons/newsletter/build?token=${params['token']}`);
      });
    }else{
      localStorage.setItem('newsletter', '');
      this.activateRoute.queryParams.subscribe(params => {
        this.token = params['token']
      });
      this.templatesCRM = [...await this.crmService.getLists(Modules.plantillas).toPromise()];
      /*this.templatesCRM.forEach( async (ele) => {
        
        console.log(ele)
        let html = ele.content
        let css = ""
        
        let data = {
          html: ele.content,
          css: css
        }

        console.log(await this.TemplatesService.generateImg(data).toPromise());

      })*/
    
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
  openTemplate(tem): void {
    let that = this;
    fetch(tem.content)
      .then(function(res) {
        return res.text();
      })
      .then(function(res) {
        localStorage.setItem('newsletter', res);
        that.activateRoute.queryParams.subscribe(params => {
        that.router.navigateByUrl(`/addons/newsletter/build?token=${params['token']}`);
        });
      });
  }



  /**
   * Carga la plantilla(CRM) seleccionada en el canvas
   * @param item plantilla
   */
  openTemplateCRM(item): void {
    let that = this;
    localStorage.setItem('newsletter', item.content);
    that.activateRoute.queryParams.subscribe(params => {
      that.router.navigateByUrl(`/addons/newsletter/build?token=${params['token']}`);
    });
  }


  /**
   * Act
   * @param item plantilla
   */
  showTemplate(item) {
    this.isVisible = true;
    this.previewTitle = item.name
    this.previewImg = item.image

  
  }

  handleOk() {
    this.isVisible = false;
  }

  handleCancel() {
    this.isVisible = false;
  }
}
