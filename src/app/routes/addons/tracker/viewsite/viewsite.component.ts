import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrackerService } from '@core';
import { FullContentService, STColumn } from '@delon/abc';
import { deepCopy } from '@delon/util';

export class SitiosObj {
  id: string;
  sitioweb: string;
  url: string;
  date: string;
  num_visit: Object;
}

@Component({
  selector: 'app-viewsite',
  templateUrl: './viewsite.component.html',
  styleUrls: ['./viewsite.component.less']
})
export class ViewsiteComponent implements OnInit {

  custom = [];
  searchInput = [];
  searchStructure = {};
  searchType = {};
  id: string;
  chart: any;
  sto: SitiosObj;
  dataChart2: any[] = [];
  dataTable: any[] = [];

  data_copy: any[];

  searchColumn: STColumn[];

  @ViewChild('st') tabla;
  @ViewChild('graf') graf;


  constructor(private _route: ActivatedRoute, private trackerServ: TrackerService, private full: FullContentService) {

  }

  ngOnInit() {
    this.custom = ['hora', 'visit'];

    this.searchColumn = [
      {
        title: 'Hora',
        i18n: 'app.tracker.table.visitas.horas',
        renderTitle: this.custom[0],
        index: 'hora'
        , sort: {
          compare: (a, b) => a.hora - b.hora,
        }
      },
      {
        title: 'Visitas',
        i18n: 'app.tracker.visitas.visitas',
        renderTitle: this.custom[1],
        index: 'visit', sort: {
          compare: (a, b) => a.visit - b.visit,
        }
      },
      {
        title: 'Visitas unicas',
        i18n: 'app.tracker.visitas.visitas_uniq',
        renderTitle: this.custom[2],
        index: 'visit_uniq', sort: {
          compare: (a, b) => a.visit_uniq - b.visit_uniq,
        }
      },
      {
        title: 'Acciones',
        i18n: 'app.tracker.table.visitas.acciones',
        renderTitle: this.custom[3],
        index: 'action', sort: {
          compare: (a, b) => a.action - b.action,
        }
      }
    ];
    for (let i in this.searchColumn) if (this.searchColumn[i].hasOwnProperty('renderTitle')) this.searchInput.push('')
    this.id = this._route.snapshot.paramMap.get('id');
    this.getData();
    this.getVisitDataTable();
    this.full.toggle();
  }

  findcolumn(c) {
    const custom_ = this.custom[c]
    for (let i in this.searchColumn) if (this.searchColumn[i].hasOwnProperty('renderTitle')) if (this.searchColumn[i]['renderTitle'] === custom_) return this.searchColumn[i]
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
    this.dataTable = this.data_copy;
    const keys = Object.keys(this.searchStructure)
    for (let i in keys) {
      switch (this.searchType[keys[i]]) {
        case 'string':
        case 'number':
          this.dataTable = deepCopy(this.dataTable).filter(w => ~w[keys[i]].toString().indexOf(this.searchStructure[keys[i]].toString()));
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
    for (let i in this.searchInput) { this.searchInput[i] = ''; this.changeFill(i) }
    this.dataTable = this.data_copy;
    for (let i in document.getElementsByClassName('icon_search_fill')) this.changeFill(i)
  }

  changeFill(i) {
    if (this.searchInput[i] !== '' && this.searchInput[i] !== undefined) (<HTMLElement>document.getElementsByClassName('icon_search_fill')[i].firstChild).style.fill = '#00A477'
    else (<HTMLElement>document.getElementsByClassName('icon_search_fill')[i].firstChild).style.fill = "currentColor";
  }

  async getData() {
    let sitiosWeb = [];
    let datos = {};
    const visita = await this.trackerServ.getNumberVisits(this.id).toPromise();
    for (const item of visita) {
      datos = {
        x: item.label,
        y: item.nb_visits
      };
      sitiosWeb.push(datos);
      this.dataChart2.push(datos);

      this.DrawChart(sitiosWeb);
    }
  }

  async getVisitDataTable() {

    let datos = {}
    await this.trackerServ.getVisitPerHours(this.id).subscribe((data: any) => {
      console.log(data);
      for (const item of data) {
        datos = {
          hora: item.label + ':00',
          visit: item.nb_visits,
          visit_uniq: item.sum_daily_nb_uniq_visitors,
          action: item.nb_actions,
        };
        this.dataTable.push(datos);
      }
    })
    this.tabla.data = this.dataTable;
    this.data_copy = this.dataTable;
    setTimeout(() => {
      this.tabla.reload();
    }, 2000)
  }

  DrawChart(a: any) {
    let element = document.querySelector('#contenedor');
    this.chart = new G2.Chart({
      container: element,
      forceFit: true,
      height: 300,
    });
    this.chart.source(a, {
      'x': {
        type: 'cat',
        values: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
      },
      'y': {
        formatter: val => {
          return val;
        }
      }
    });
    this.chart.area().position('x*y').size(5);
    this.chart.render();
  }
}
