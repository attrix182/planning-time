import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LanguageService } from '../services/language.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageGuard implements CanActivate {
  constructor(
    private router: Router,
    private languageService: LanguageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url = state.url;
    const urlWithoutHash = url.startsWith('#') ? url.substring(1) : url;
    const segments = urlWithoutHash.split('/').filter(segment => segment);
    
    // Si no hay idioma en la URL, detectar del navegador y redirigir
    if (segments.length === 0 || !['es', 'en'].includes(segments[0])) {
      // Obtener idioma del navegador
      const browserLang = navigator.language || (navigator as any).userLanguage;
      const langCode = browserLang.split('-')[0].toLowerCase();
      const defaultLang = ['es', 'en'].includes(langCode) ? langCode : 'es';
      
      // Si la URL es solo '/' o está vacía, redirigir a /lang
      if (segments.length === 0 || urlWithoutHash === '/') {
        this.router.navigateByUrl(`/${defaultLang}`);
      } else {
        // Mantener el resto de la ruta y agregar el idioma al principio
        const pathWithoutLang = urlWithoutHash.startsWith('/') ? urlWithoutHash : '/' + urlWithoutHash;
        const newUrl = `/${defaultLang}${pathWithoutLang}`;
        this.router.navigateByUrl(newUrl);
      }
      return false;
    }
    
    return true;
  }
}
