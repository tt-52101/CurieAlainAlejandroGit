import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit,
  ElementRef,
} from '@angular/core';

import { Router, ActivationEnd } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { filter, debounceTime } from 'rxjs/operators';
import { _HttpClient } from '@delon/theme';
import { FullContentService } from '@delon/abc';
@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigComponent implements AfterViewInit, OnDestroy {

  private resize$: Subscription;
  private router$: Subscription;
  mode = 'inline';
  title: string;
  user: any;

  menus: any[] = [
    {
      key: 'general',
      title: 'general',
    },
    {
      key: 'deployment',
      title: 'deployment',
    },
    {
      key: 'binding',
      title: 'binding',
    },
    {
      key: 'notification',
      title: 'notification',
    },
  ];

  constructor(private router: Router, private cdr: ChangeDetectorRef, private el: ElementRef, private full: FullContentService) {
    this.router$ = this.router.events
      .pipe(filter(e => e instanceof ActivationEnd))
      .subscribe(() => this.setActive());
  }

  ngOnInit() {
    this.full.toggle();
  }

  private setActive() {
    const key = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    this.menus.forEach(i => {
      i.selected = i.key === key;
    });
    this.title = this.menus.find(w => w.selected).title;
  }

  to(item: any) {
    this.router.navigateByUrl(`/cms/config/${item.key}`);
  }


  private resize() {
    const el = this.el.nativeElement as HTMLElement;
    let mode = 'inline';
    const { offsetWidth } = el;
    if (offsetWidth < 641 && offsetWidth > 400) {
      mode = 'horizontal';
    }
    if (window.innerWidth < 768 && offsetWidth > 400) {
      mode = 'horizontal';
    }
    this.mode = mode;
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.resize$ = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => this.resize());
  }

  ngOnDestroy(): void {
    this.resize$.unsubscribe();
    this.router$.unsubscribe();
  }



}
