import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  Input,
} from '@angular/core';
import { SettingsService, ALAIN_I18N_TOKEN } from '@delon/theme';
import { I18NService } from '@core/i18n/i18n.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'pro-langs',
  templateUrl: './langs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangsComponent {
  langs: any[];

  @Input() placement = 'bottomRight';
  @Input() btnClass = 'alain-pro__header-item';
  @Input() btnIconClass = 'alain-pro__header-item-icon';

  constructor(
    public settings: SettingsService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    @Inject(DOCUMENT) private doc: any,
  ) {
    this.langs = this.i18n.getLangs().map((v: any) => {
      v.abbr = '🇨🇳';
      switch (v.code) {
        case 'zh-TW':
          v.abbr = '🇭🇰';
          break;
        case 'en-US':
          v.abbr = '🇬🇧';
          break;
        case 'es-ES':
          v.abbr = 'es';
          break;
      }
      return v;
    });
  }

  change(lang: string) {
    console.log("Idioma1 " + this.settings.layout.lang)
    const spinEl = this.doc.createElement('div');
    spinEl.setAttribute(
      'class',
      `page-loading ant-spin ant-spin-lg ant-spin-spinning`,
    );
    console.log("Idioma2 " + this.settings.layout.lang)

    spinEl.innerHTML = `<span class="ant-spin-dot ant-spin-dot-spin"><i></i><i></i><i></i><i></i></span>`;
    this.doc.body.appendChild(spinEl);
    console.log("Idioma3 " + this.settings.layout.lang)

    this.i18n.use(lang);
    console.log("Idioma4 " + this.settings.layout.lang)

    this.settings.setLayout('lang', lang);
    console.log("Idioma5 " + this.settings.layout.lang)

    setTimeout(() => this.doc.location.reload());
  }
}
