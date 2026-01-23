import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'fc-participate',
  templateUrl: './participate.component.html',
  styleUrls: ['./participate.component.scss']
})
export class ParticipateComponent  {
  @Input('id') sesionId: string = '';
  @Output('back') goBack: any = new EventEmitter();
  router = inject(Router);
  languageService = inject(LanguageService);
  translate = inject(TranslateService);

  ngOnInit(){
    const urlSegments = this.router.url.split('/').filter(segment => segment);
    // Si el primer segmento es un idioma, tomar el siguiente, sino tomar el primero
    if (urlSegments.length > 0 && ['es', 'en'].includes(urlSegments[0])) {
      this.sesionId = urlSegments[1] || '';
    } else {
      this.sesionId = urlSegments[0] || '';
    }
  }

  goToSesion() {
    if (this.sesionId.length > 5) {
      let extractedId = this.sesionId.trim();
      let extractedLang = this.languageService.getCurrentLanguage();
      
      // Si es una URL completa, extraer el ID y el idioma
      if (this.sesionId.includes('https') || this.sesionId.includes('http')) {
        try {
          const url = new URL(this.sesionId);
          const pathSegments = url.pathname.split('/').filter(segment => segment);
          
          // Buscar el idioma en la URL
          if (pathSegments.length > 0 && ['es', 'en'].includes(pathSegments[0])) {
            extractedLang = pathSegments[0];
            // El ID debería estar después de 'sesion'
            const sesionIndex = pathSegments.indexOf('sesion');
            if (sesionIndex !== -1 && pathSegments.length > sesionIndex + 1) {
              extractedId = pathSegments[sesionIndex + 1];
            } else {
              // Si no hay 'sesion', tomar el último segmento
              extractedId = pathSegments[pathSegments.length - 1];
            }
          } else {
            // Si no hay idioma en la URL, extraer solo el ID
            const sesionIndex = pathSegments.indexOf('sesion');
            if (sesionIndex !== -1 && pathSegments.length > sesionIndex + 1) {
              extractedId = pathSegments[sesionIndex + 1];
            } else {
              extractedId = pathSegments[pathSegments.length - 1];
            }
          }
        } catch (e) {
          // Si falla el parseo de URL, intentar extraer manualmente
          const parts = this.sesionId.split('/');
          const sesionIndex = parts.findIndex(p => p === 'sesion');
          if (sesionIndex !== -1 && parts.length > sesionIndex + 1) {
            extractedId = parts[sesionIndex + 1];
            // Verificar si hay idioma antes de 'sesion'
            if (sesionIndex > 0 && ['es', 'en'].includes(parts[sesionIndex - 1])) {
              extractedLang = parts[sesionIndex - 1];
            }
          } else {
            extractedId = parts[parts.length - 1];
          }
        }
      }
      
      // Actualizar el idioma si se detectó uno diferente
      if (extractedLang !== this.languageService.getCurrentLanguage()) {
        this.languageService.setLanguage(extractedLang, true);
      }
      
      this.router.navigate([`/${extractedLang}/sesion/`, extractedId]);
    }
  }
}
