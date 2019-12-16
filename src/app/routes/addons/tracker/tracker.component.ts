import { Component, ChangeDetectionStrategy, ViewChild, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { STColumn, STData } from '@delon/abc';
import { TrackerService } from '../../../core/services/tracker.service';
import { FullContentService } from '@delon/abc';
import { I18NService } from '@core';
import { Router } from '@angular/router';
import { deepCopy } from '@delon/util';

export class SitiosObj {
  id: string;
  sitioweb: string;
  url: string;
  date: string;
  num_visit: Object;
}

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  // styleUrls: ['./tracker.component.less']
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackerComponent implements OnInit {

  @ViewChild("st") comp;
  @ViewChild("tablaCampañas") tabCamp;
  @ViewChild("modal") modal;

  columns = [];
  searchColumn = [];
  campaingColumn = [];

  visitData: any[];
  visitDataArray: STData[] = [];

  /*Modales (VIEW) */
  isVisible = false;
  isOkLoading = false;

  isVisibleModel2 = false;
  isOkLoadingModel2 = false;

  isVisible3 = false;
  isVisibleModel3 = false;

  codigoSeguimiento: string;

  /*Tabla de datos(VIEW) */

  /*Peticion API*/
  idSite: string;
  codigoToInsert: string;

  /*Datos de los sitios a mostrar en la lista*/
  websites: STData[] = [];


  /* Para rellenar la tabla con datos de keyword*/
  websiteskeyword: STData[] = [];

  sto: SitiosObj;

  arraysitio: any[] = [];

  dataCampaign: any[] = [];

  chart: any;
  data_copy: any[];
  custom: any;

  searchInput = [];
  searchStructure = {};
  searchType = {};

  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    public i18n: I18NService,
    public msg: NzMessageService,
    private trackerServ: TrackerService,
    private full: FullContentService) {
  }

  async ngOnInit() {
    this.full.toggle();

    await this.loadSiteCharts();

    this.custom = ['id', 'sitioweb', 'url', 'date', 'code'];

    this.columns = [
      {
        title: 'ID', index: 'id', i18n: 'app.tracker.table.id',
        renderTitle: this.custom[0], sort: {
          compare: (a, b) => a.id - b.id,
        }
      },
      {
        title: 'WEB SITE', index: 'sitioweb', i18n: 'app.tracker.table.site',
        renderTitle: this.custom[1], sort: {
          compare: (a, b) => a.sitioweb.length - b.sitioweb.length,
        }
      },
      {
        title: 'URL', index: 'url', i18n: 'app.tracker.table.url', sort: {
          compare: (a, b) => a.url.length - b.url.length,
        }
      },
      {
        title: 'CREATED DATE', index: 'date', i18n: 'app.tracker.table.date',
        sort: {
          compare: (a, b) => a.date - b.date,
        }
      },
      {
        title: 'Cod.Tracking',
        i18n: 'app.tracker.table.viewcode',
        buttons: [
          {
            text: 'view code',
            type: 'link',
            i18n: 'app.tracker.table.viewcode2',
            click: (e: any) => { this.viewCode(e.id) },
          },
        ],
      },
    ];

    for (let i in this.columns) if (this.columns[i].hasOwnProperty('renderTitle')) this.searchInput.push('');

    this.searchColumn = [
      {
        title: 'Rank',
        i18n: 'app.tracker.table2.rank',
        index: 'rank'
      },
      {
        title: 'Keyword',
        i18n: 'app.tracker.table2.search-keyword',
        index: 'keyword'
      },
      {
        title: 'Nº Visits',
        i18n: 'app.tracker.table2.number-visits',
        index: 'count',
      },
      {
        title: 'Tiempo medio',
        i18n: 'app.tracker.table2.time',
        index: 'time',
      }
    ];

    this.campaingColumn = [
      {
        title: 'Name',
        i18n: 'app.tracker.table2.name',
        index: 'name',
        sort: {
          compare: (a, b) => a.name.length - b.name.length,
        }
      },
      {
        title: 'Nº Visits',
        i18n: 'app.tracker.table2.n_visits',
        index: 'n_visits',
        sort: {
          compare: (a, b) => a.n_visits - b.n_visits,
        }
      },
      {
        title: 'Nº Actions',
        i18n: 'app.tracker.table2.action',
        index: 'n_action',
        sort: {
          compare: (a, b) => a.n_action - b.n_action,
        }
      },
      {
        title: 'Bounce',
        i18n: 'app.tracker.table2.bounce',
        index: 'bounce_count',
        sort: {
          compare: (a, b) => a.bounce_count - b.bounce_count,
        }
      }
    ];

    this.codigoSeguimiento = "";
  }

  findcolumn(c) {
    const custom_ = this.custom[c]
    for (let i in this.columns) if (this.columns[i].hasOwnProperty('renderTitle')) if (this.columns[i]['renderTitle'] === custom_) return this.columns[i]
  }

  powerSearch(c) {
    this.changeFill(c);
    const column_ = this.findcolumn(c);
    this.searchStructure[`${column_.index}`] = this.searchInput[c];
    if (column_.type === undefined) {
      this.searchType[`${column_.index}`] = 'string';
    } else this.searchType[`${column_.index}`] = column_.type;
    this.fullPowerSearch()
  }

  fullPowerSearch() {
    this.websites = this.data_copy;
    const keys = Object.keys(this.searchStructure)
    for (let i in keys) {
      switch (this.searchType[keys[i]]) {
        case 'string':
        case 'number':
          console.log(deepCopy(this.websites));
          this.websites = deepCopy(this.websites).filter(w => ~w[keys[i]].toString().indexOf(this.searchStructure[keys[i]].toString()));
          break;
        case 'date': break;
        case 'no': break;
        case 'yu': break;
        default:
          break;
      }
    }
  }

  powerResetSearch(c): void {
    const column_ = this.findcolumn(c);
    const colname = column_.index
    this.searchStructure[`${colname}`] = '';
    this.searchInput[c] = '';
    this.changeFill(c);
    this.fullPowerSearch();
  }

  fullPowerResetSearch() {
    for (let i in this.searchStructure) this.searchStructure[i] = '';
    for (let i in this.searchInput) this.searchInput[i] = '';
    this.websites = this.data_copy;
    for (let i in document.getElementsByClassName('icon_search_fill')) this.changeFill(i)
  }

  changeFill(i) {
    if (this.searchInput[i] !== '' && this.searchInput[i] !== undefined) (<HTMLElement>document.getElementsByClassName('icon_search_fill')[i].firstChild).style.fill = '#00A477'
    else (<HTMLElement>document.getElementsByClassName('icon_search_fill')[i].firstChild).style.fill = "currentColor";
  }

  /**
   Metodo que carga los sitios solicitados al servicio para mostrarlos.
   */
  async loadSiteCharts() {
    const web = await this.trackerServ.getSitesForId().toPromise();
    //aqui se guardan las web para mostrarlas en la tabla.
    this.websites.push(web);

    this.data_copy = this.websites;
    this.getDataChart();
    //this.getKeywordReferences();
    this.comp.reload();
  }

  /**
   *  Método para almacenar la información de cada sitio para posteriormente poder crear la gráfica.
   */
  async getDataChart() {
    this.visitDataArray = [];
    let arrayDays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
    let numSite = this.websites[0].length;
    console.log(numSite);
    for (let i = 0; i < numSite; i++) {
      let id = this.websites[0][i].id;
      const visit = await this.trackerServ.getNumberVisits(id).toPromise()
      if (visit != undefined && visit != null) {
        console.log(visit);
        this.websites[0][i].num_visit = visit;
      }
    }
    for (let x = 0; x < this.websites[0].length; x++) {
      if (this.websites[0][x].num_visit.length > 0) {
        this.visitData = new Array(7).fill({}).map((i, idx) => ({
          x: arrayDays[idx],
          y: this.websites[0][x].num_visit[idx].nb_visits
        }));
      } else {
        this.visitData = new Array(7).fill({}).map((i, idx) => ({
          x: arrayDays[idx],
          y: 0
        }));
      }
      this.visitDataArray.push(this.visitData);
    }
    this.DrawChart();
    console.log(this.comp);

    this.comp.reload();
  }

  /**
  * Método para cargar las palabras clave de cada sitio en su respectivo campo de la vista.
  */
  getKeywordReferences() {
    let almacenamiento = [];
    this.websiteskeyword = [];

    for (let i = 0; i < this.arraysitio.length; i++) {
      this.trackerServ.getKeywords(this.arraysitio[i].id).subscribe((data: any) => {
        for (const item of data) {
          if (item.nb_visits != undefined) {
            almacenamiento.push({
              rank: item.bounce_rate,
              keyword: item.label,
              count: item.nb_visits,
              time: item.avg_time_on_page + " s"
            });
          } else {
            almacenamiento.push({
              rank: "0",
              keyword: item.label,
              count: 0,
              time: 0 + " s"
            });
          }
          this.websiteskeyword.push(almacenamiento);
        }
      });
    }
    this.comp.reload();
  }

  /**
   * Método para cargar la tabla de campañas de cada sitio.
   * @param id 
   */
  loadCampaignTable(id: string) {
    this.dataCampaign = [];
    this.trackerServ.getCampaings(id).subscribe((data: any) => {
      if (data.length > 0) {
        for (const item of data) {
          this.dataCampaign.push({
            name: item.label,
            n_visits: item.nb_visits.toString(),
            n_action: item.nb_actions.toString(),
            bounce_count: item.bounce_count + "%"
          });
        }
        console.log(this.dataCampaign);
      }
      this.tabCamp.reload();
    });
    setTimeout(() => {
      this.tabCamp.reload();
    }, 1000)
  }

  /**
   * Metodo que introducira un nuevo sitio web y genera su codigo de seguimiento.
   *
   * @param nombreSitio
   * @param dominio
   */
  async setNewSite(nombreSitio: string, dominio: string) {

    await this.trackerServ.insertSite(nombreSitio, dominio).subscribe((data: any) => {
      this.idSite = data.value;
    })

    this.loadSiteCharts();

    await this.trackerServ.getCodeJS(this.idSite).subscribe((data: any) => {
      this.codigoToInsert = data.value;
    });

    this.comp.reload();
  }

  /**
     * Obtener el código de seguimiento de cada sitio web.
     * @param id
     */
  async viewCode(id: string) {
    await this.trackerServ.getCodigoSeguimiento(id).then(data => {
      console.log(data);
      this.codigoSeguimiento = data['value'];
    });
    this.showModal(3);
  }

  /**
   * Metodos para el tratamiento de el modal(visualizar,ocultar,aceptar,etc)
   * @param modal
   */
  showModal(modal: number): void {
    if (modal == 3) {
      this.isVisible3 = true;
    } else {
      this.isVisible = true;
    }
  }

  /**
   * Interacción que realiza al hacer click a el botón OK de un modal.
   * @param nombreSitio
   * @param dominio
   * @param modal
   */
  handleOk(nombreSitio: string, dominio: string, modal: number): void {
    if (dominio != null && dominio != "" && dominio != undefined && nombreSitio != null && nombreSitio != "" && nombreSitio != undefined) {
      switch (modal) {
        case 1:
          this.isVisible = false;
          this.isOkLoading = false;
          this.setNewSite(nombreSitio, dominio);
          this.isVisibleModel2 = true
          break;
        case 2:
          this.isVisibleModel2 = false;
          this.isOkLoadingModel2 = false;
          break;
      }
    }
  }

  /**
   * Interacción que realiza al hacer click a el botón Cancelar de un modal.
   */
  handleCancel(): void {
    this.isVisible = false;
  }

  /**
   * Interacción que realiza al hacer click a el botón OK del segundo modal.
   */
  handleOk2(): void {
    this.isVisible3 = false;
    this.isOkLoading = false;
    this.isVisibleModel3 = true
  }

  /**
   * Pintamos las gráficas de los sitios para mostrar las visitas por sitio web.
   */
  DrawChart() {
    let a = this.visitDataArray;
    try {
      for (let i = 0; i < a.length; i++) {
        let element = document.querySelector('#contenedor' + i);
        const data = this.visitDataArray[i];
        this.chart = new G2.Chart({
          container: element,
          forceFit: false,
          height: 300,
        });
        this.chart.source(data, {
          'x': {
            type: 'cat',
            values: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']
          },
          'y': {
            formatter: val => {
              return val;
            }
          }
        });
        this.chart.interval().position('x*y').size(14);
        this.chart.render();
      }
    } catch (Exception) {
      setTimeout(() => {
        this.DrawChart()
      }, 2000);
    }
  }

  /**
   * Para el IFRAME tenemos dos rutas que podemos encontrar en tracker-routing.module.ts
   * Una es para mostar la gráfica de los Emails abiertos -> /site/:id/:action
   * La otra es para mostrar la gráfica y los datos del sitio escogido -> siteinfo/:id
   */
  pruebarutas() {
    this.router.navigateByUrl('/siteinfo/1');
  }

}
