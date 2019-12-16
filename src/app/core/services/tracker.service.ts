import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface Sitios {
  id: string;
  sitioweb: string;
  url: string;
  date: string;
  num_visit: {};
}

@Injectable({
  providedIn: 'root'
})


export class TrackerService {

  private url: string = "https://matomo.curieplatform.com/index.php";
  private token: string = "fb3755c4e74f854685482e2702260246";

  /*   private url: string = "http://localhost/piwik/index.php";
    private token: string = "55710b7a29cefb0546d007ff89adede6"; */

  constructor(private httpclient: HttpClient) { }

  // METODOS PARA EL MODULO DE TRACKEO
  getParam() {
    const params = new HttpParams()
      .set('module', 'API')
      .set('period', 'day')
      .set('date', 'today')
      .set('format', 'json')
      .set('token_auth', this.token);
    return params;
  }

  getSitesForId() {
    let sitio: Sitios;
    let params = this.getParam()
      .set('method', 'SitesManager.getAllSites');
    return this.httpclient.get(this.url, { params }).pipe(
      map((res: any) => res.map(e => {
        sitio = {
          id: e.idsite,
          sitioweb: e.name,
          url: e.main_url,
          date: e.ts_created,
          num_visit: {}
        }
        return sitio;
      }))
    )
  }

  insertSite(nombreSitio: string, dominio: string) {
    let params = this.getParam()
      .set('method', 'SitesManager.addSite')
      .set('siteName', nombreSitio)
      .set('urls', dominio);

    return this.httpclient.get(this.url, { params });
  }

  getCodeJS(id: string) {
    let params = this.getParam()
      .set('method', 'SitesManager.getJavascriptTag')
      .set('idSite', id)
      .set('piwikUrl ', this.url);

    return this.httpclient.get(this.url, { params });
  }

  getInfoEmail(id: string, actionTitle: string) {
    let params = new HttpParams()
      .set('module', 'API')
      .set('method', 'Live.getLastVisitsDetails')
      .set('idSite', id)
      .set('period', 'week')//month
      .set('date', 'today')
      .set('format', 'json')
      .set('segment', 'pageTitle==' + actionTitle)
      .set('token_auth', this.token);

    return this.httpclient.get(this.url, { params });
  }

  getInfoEmailAll(id: string) {
    let params = new HttpParams()
      .set('module', 'API')
      .set('method', 'Referrers.getCampaigns')
      .set('idSite', id)
      .set('period', 'week')//month
      .set('date', 'today')
      .set('format', 'json')
      .set('segment', 'referrerName==emailtracking')
      .set('token_auth', this.token);

    return this.httpclient.get(this.url, { params });
  }

  getNumberVisits(id: string) {
    let params = new HttpParams()
      .set('module', 'API')
      .set('method', 'VisitTime.getByDayOfWeek')
      .set('idSite', id)
      .set('period', 'week')
      .set('date', 'today')
      .set('format', 'json')
      .set('token_auth', this.token);

    return this.httpclient.get(this.url, { params }).pipe(
      map((res: any) => res.map(e => {
        console.log(e);
        return e;
      }))
    )
  }

  getVisitID(eventAction: string) {
    let params = this.getParam()
      .set('method', 'Live.getLastVisitsDetails')
      .set('idSite', '1')
      .set('segment', 'eventAction==' + eventAction);

    return this.httpclient.get(this.url, { params });
  }

  getKeywords(idSitio: string) {
    let params = new HttpParams()
      .set('module', 'API')
      .set('method', 'Actions.getEntryPageTitles')
      .set('idSite', idSitio)
      .set('period', 'week')
      .set('date', 'today')
      .set('format', 'json')
      .set('token_auth', this.token);
    return this.httpclient.get(this.url, { params });

  }

  getCodigoSeguimiento(idSitio: string) {
    let params = this.getParam()
      .set('method', 'SitesManager.getJavascriptTag')
      .set('idSite', idSitio);
    return this.httpclient.get(this.url, { params }).toPromise();
  }

  getCampaings(idSitio: string) {
    let params = new HttpParams()
      .set('module', 'API')
      .set('method', 'Referrers.getCampaigns')
      .set('idSite', idSitio)
      .set('period', 'month')
      .set('date', 'today')
      .set('format', 'json')
      .set('token_auth', this.token);
    return this.httpclient.get(this.url, { params });
  }

  getVisitsSumary(idSitio: string) {
    let params = new HttpParams()
      .set('module', 'API')
      .set('method', 'VisitsSummary.get')
      .set('idSite', idSitio)
      .set('period', 'week')
      .set('date', 'today')
      .set('format', 'json')
      .set('token_auth', this.token);
    return this.httpclient.get(this.url, { params });
  }

  getVisitPerHours(idSitio: string) {
    let params = new HttpParams()
      .set('module', 'API')
      .set('method', 'VisitTime.getVisitInformationPerServerTime')
      .set('idSite', idSitio)
      .set('period', 'week')
      .set('date', 'today')
      .set('format', 'json')
      .set('token_auth', this.token);
    return this.httpclient.get(this.url, { params });
  }
}