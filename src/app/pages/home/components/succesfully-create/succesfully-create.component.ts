import { Component, inject, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EventSesion } from 'src/app/models/event.model';
import { environment } from 'src/environments/environment';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'fc-succesfully-create',
  templateUrl: './succesfully-create.component.html',
  styleUrls: ['./succesfully-create.component.scss']
})
export class SuccesfullyCreateComponent implements OnInit {
  @Input() event: EventSesion;
  copied: boolean = false;
  url: string = '';
  messageSvc = inject(MessageService);
  languageService = inject(LanguageService);
  translate = inject(TranslateService);


  ngOnInit(): void {
    const lang = this.languageService.getCurrentLanguage();
    const baseUrl = environment.url_deploy.replace(/\/+$/, ''); // Remover barras finales
    this.url = `${baseUrl}/${lang}/sesion/${this.event.id}`;
  }

  copyLink() {
    navigator.clipboard.writeText(this.url);
    this.copied = true;
    this.translate.get(['SUCCESSFULLY_CREATE.LINK_COPIED', 'SUCCESSFULLY_CREATE.LINK_COPIED_DETAIL']).subscribe(translations => {
      this.messageSvc.add({
        severity: 'success',
        summary: translations['SUCCESSFULLY_CREATE.LINK_COPIED'],
        detail: translations['SUCCESSFULLY_CREATE.LINK_COPIED_DETAIL']
      });
    });
  }

  goToPanel() {
    const lang = this.languageService.getCurrentLanguage();
    const baseUrl = environment.url_deploy.replace(/\/+$/, ''); // Remover barras finales
    window.open(`${baseUrl}/${lang}/sesion/${this.event.id}`);
  }
}
