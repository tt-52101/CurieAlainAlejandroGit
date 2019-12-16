import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { FullContentService } from '@delon/abc';


@Component({
  selector: 'app-list-stepper',
  templateUrl: './list-stepper.component.html'
})
export class ListStepperComponent implements OnInit, OnDestroy {

  private router$: Subscription;
  pos = 0;
  tabs: any[] = [
    {
      key: 'newsletter',
      tab: 'Plantillas',
    },
    {
      key: 'templates-newsletter-code',
      tab: 'Subir Plantilla',
    },
  ];

 
  /**
   * Constructor
   * @param router Enrutador
   * @param full Vista completa
   * @param activateRoute ruta actual
   */
  constructor(private router: Router, private full: FullContentService, private activateRoute: ActivatedRoute) {}


  /**
   * ngOnInit
   */
  ngOnInit() {
    this.router$ = this.router.events
      .pipe(filter(e => e instanceof ActivationEnd))
      .subscribe(() => this.setActive());
      this.full.toggle();
    this.setActive();
  }


  /**
   * setActive
   */
  private setActive() {
    const key = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    const idx = this.tabs.findIndex(w => w.key === key);
    if (idx !== -1) this.pos = idx;
  }


  /**
   * Cambiarse de tab
   * @param item tab al que desea cambiarse
   */
  to(item: any) {
    this.activateRoute.queryParams.subscribe(params => { 
     this.router.navigateByUrl(`/addons/${item.key}?token=${params['token']}`);
    });
  }


  /**
   * Eliminar la suscripción a un observable para no dejarla en memoria
   */
  ngOnDestroy() {
    this.router$.unsubscribe();
  }

}
