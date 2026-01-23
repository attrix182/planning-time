import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventSesion } from 'src/app/models/event.model';
import { StorageService } from 'src/app/services/storage.service';
import { Section } from 'src/app/types/section.type';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'fc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('exitAnimationY', [
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateY(100%)', opacity: 1 }))
      ]),
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 1 }),
        animate('500ms', style({ transform: 'translateY(0)', opacity: 0 }))
      ])
    ]),
    trigger('enterAnimationY', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('700ms', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('500ms', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  showCreate: boolean = false;
  showParticipate: boolean = false;
  succesfullyCreate: boolean = false;
  isLoading: boolean = false;
  actualSection: Section;
  fullUrl: string = this.router.url;
  event: EventSesion;
  eventID: string;
  currentLanguage: string = 'es';
  languages: { code: string; label: string }[] = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' }
  ];

  constructor(
    private storageSvc: StorageService, 
    private router: Router,
    private languageService: LanguageService,
    public translate: TranslateService
  ) {
    this.parseUrl();
    this.currentLanguage = this.languageService.getCurrentLanguage();
  }

  ngOnInit(): void {
    this.checkUrl();
  }

  private parseUrl(): void {
    const urlSegments = this.router.url.split('/').filter(segment => segment);
    // Si el primer segmento es un idioma, ajustar los índices
    if (urlSegments.length > 0 && ['es', 'en'].includes(urlSegments[0])) {
      this.actualSection = (urlSegments[1] || '') as Section;
      this.eventID = urlSegments[2] || '';
    } else {
      this.actualSection = (urlSegments[0] || '') as Section;
      this.eventID = urlSegments[1] || '';
    }
  }

  toggleShowCreate() {
    this.showCreate = !this.showCreate;
  }

  toggleShowParticipate() {
    this.showParticipate = !this.showParticipate;
  }

  goToLanding() {
    const lang = this.languageService.getCurrentLanguage();
    this.router.navigateByUrl(`/${lang}/about/landing`);
  }

  changeLanguage(lang: string): void {
    this.languageService.setLanguage(lang, true);
    this.currentLanguage = lang;
  }

  checkUrl() {
    if (this?.actualSection.toString().includes('info')) {
      this.handleID();
    }
    if (this?.actualSection === 'participate') {
      this.showParticipate = true;
    } else {
      if (this.actualSection.length < 2) {
        return;
      }
      this.showParticipate = true;
    }
  }

  handleID($event?:Event) {
    this.isLoading = true;
    this.showCreate = false;
    $event ? this.eventID = $event.toString() : this.eventID;
    this.storageSvc.getByParameter('events', 'id', this.eventID).subscribe((res: any) => {
      this.isLoading = false;
      this.event = res[0];
      this.succesfullyCreate = true;
    });
  }
}
