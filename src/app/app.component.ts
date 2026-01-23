import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { LanguageService } from './services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {

  constructor(
    private primengConfig: PrimeNGConfig,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {
    this.primengConfig.ripple = true;
  }

  ngOnInit() {
    // El servicio de idioma ya detecta el idioma del navegador si no hay uno en la URL
    // Solo asegurar que el idioma actual esté configurado
    const currentLang = this.languageService.getCurrentLanguage();
    this.translate.use(currentLang);
  }

  ngAfterViewInit() {
   // this.analytics.logEvent('page_view_home');
  }

}
