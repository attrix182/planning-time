import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { NotificationsService, NotificationSettings } from 'src/app/services/notifications.service';

@Component({
  selector: 'fc-admin-profile-modal',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {
  getId: string;
  @Input() userActive: any;
  @Output('onClose') onClose: any = new EventEmitter<void>();
  @Output('onChangeName') onChangeName: any = new EventEmitter<void>();
  currentLanguage: string = 'es';
  languages: { code: string; label: string }[] = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' }
  ];
  notificationSettings: NotificationSettings;

  constructor(
    private router: Router, 
    private storageSVC:StorageService,
    public translate: TranslateService,
    private languageService: LanguageService,
    private notificationsService: NotificationsService
  ) {
    this.parseUrl();
    this.notificationSettings = this.notificationsService.getSettings();
  }

  private parseUrl(): void {
    const urlSegments = this.router.url.split('/').filter(segment => segment);
    // Si el primer segmento es un idioma, buscar 'sesion' y tomar el ID después
    if (urlSegments.length > 0 && ['es', 'en'].includes(urlSegments[0])) {
      const sesionIndex = urlSegments.indexOf('sesion');
      if (sesionIndex !== -1 && urlSegments.length > sesionIndex + 1) {
        this.getId = urlSegments[sesionIndex + 1].trim();
      } else {
        // Fallback: tomar el tercer segmento si no hay 'sesion'
        this.getId = (urlSegments[2] || '').trim();
      }
    } else {
      // URL retrocompatible sin idioma
      const sesionIndex = urlSegments.indexOf('sesion');
      if (sesionIndex !== -1 && urlSegments.length > sesionIndex + 1) {
        this.getId = urlSegments[sesionIndex + 1].trim();
      } else {
        // Fallback: tomar el segundo segmento
        this.getId = (urlSegments[1] || '').trim();
      }
    }
  }

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();
  }

  changeLanguage(lang: string): void {
    this.languageService.setLanguage(lang, true);
  }
  saveAndClose() {
    this.storageSVC.update(this.userActive.id, 'activeUsers', this.userActive);
    this.notificationsService.saveSettings(this.notificationSettings);
    this.onClose.emit();
  }

  updateNotificationSettings(setting: keyof NotificationSettings, value: boolean): void {
    this.notificationSettings[setting] = value;
    this.notificationsService.saveSettings(this.notificationSettings);
  }
  
  changeName(){
    this.onChangeName.emit()
  }

  toggleFacilitator(){
    this.userActive.facilitator = !this.userActive.facilitator;
  }

  closeModal() {
    this.onClose.emit();
  }
}
