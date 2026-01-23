import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage: string = 'es';
  private supportedLanguages: string[] = ['es', 'en'];

  constructor(
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Inicializar con el idioma del navegador
    this.currentLanguage = this.getBrowserLanguage();
    this.translate.use(this.currentLanguage);
    
    // Detectar idioma desde la URL al iniciar
    this.detectLanguageFromUrl();
    
    // Escuchar cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.detectLanguageFromUrl();
      });
  }

  private detectLanguageFromUrl(): void {
    const url = this.router.url;
    // Manejar hash routing (#/es/...)
    const urlWithoutHash = url.startsWith('#') ? url.substring(1) : url;
    const segments = urlWithoutHash.split('/').filter(segment => segment);
    
    // Verificar si el primer segmento es un idioma válido
    if (segments.length > 0 && this.supportedLanguages.includes(segments[0])) {
      const lang = segments[0];
      if (lang !== this.currentLanguage) {
        this.setLanguage(lang, false);
      }
    } else {
      // Si no hay idioma en la URL, detectar del navegador
      const browserLang = this.getBrowserLanguage();
      if (browserLang !== this.currentLanguage) {
        this.setLanguage(browserLang, false);
      }
    }
  }

  private getBrowserLanguage(): string {
    // Obtener el idioma del navegador
    const browserLang = navigator.language || (navigator as any).userLanguage;
    
    // Extraer el código de idioma (ej: 'en-US' -> 'en')
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    // Si el idioma del navegador está soportado, usarlo, sino usar español por defecto
    if (this.supportedLanguages.includes(langCode)) {
      return langCode;
    }
    
    // Si el idioma del navegador es inglés o similar, usar inglés
    if (langCode.startsWith('en')) {
      return 'en';
    }
    
    // Por defecto, español
    return 'es';
  }

  setLanguage(lang: string, updateUrl: boolean = true): void {
    if (this.supportedLanguages.includes(lang)) {
      this.currentLanguage = lang;
      this.translate.use(lang);
      
      if (updateUrl) {
        this.updateUrlWithLanguage(lang);
      }
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  getSupportedLanguages(): string[] {
    return this.supportedLanguages;
  }

  private updateUrlWithLanguage(lang: string): void {
    const currentUrl = this.router.url;
    // Manejar hash routing
    const urlWithoutHash = currentUrl.startsWith('#') ? currentUrl.substring(1) : currentUrl;
    const segments = urlWithoutHash.split('/').filter(segment => segment);
    
    // Remover el idioma actual si existe
    if (segments.length > 0 && this.supportedLanguages.includes(segments[0])) {
      segments.shift();
    }
    
    // Construir nueva URL con el idioma (con hash si es necesario)
    const newUrl = '/' + lang + (segments.length > 0 ? '/' + segments.join('/') : '');
    this.router.navigateByUrl(newUrl);
  }

  getUrlWithoutLanguage(): string {
    const currentUrl = this.router.url;
    const segments = currentUrl.split('/').filter(segment => segment);
    
    // Remover el idioma si existe
    if (segments.length > 0 && this.supportedLanguages.includes(segments[0])) {
      segments.shift();
    }
    
    return '/' + segments.join('/');
  }
}
