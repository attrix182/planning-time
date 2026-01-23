import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'fc-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  currentLanguage: string = 'es';
  languages: { code: string; label: string }[] = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' }
  ];

  constructor(
    private languageService: LanguageService,
    public translate: TranslateService
  ) {
    this.currentLanguage = this.languageService.getCurrentLanguage();
  }

  ngOnInit(): void {
  }

  changeLanguage(lang: string): void {
    this.languageService.setLanguage(lang, true);
    this.currentLanguage = lang;
  }

}
