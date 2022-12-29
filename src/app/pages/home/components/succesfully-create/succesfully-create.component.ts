import { Component, inject, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EventSesion } from 'src/app/models/event.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'fc-succesfully-create',
  templateUrl: './succesfully-create.component.html',
  styleUrls: ['./succesfully-create.component.scss']
})
export class SuccesfullyCreateComponent {
  @Input() event: EventSesion;
  copied: boolean = false;
  url: string = '';
  messageSvc = inject(MessageService)


  ngOnInit(): void {
    this.url = `${environment.url_deploy }/sesion/${this.event.id}`;
  }

  copyLink() {
    navigator.clipboard.writeText(this.url);
    this.copied = true;
    this.messageSvc.add({
      severity: 'success',
      summary: 'Link Copiado',
      detail: 'El link ha sido copiado al portapapeles'
    });
  }

  goToPanel() {
    window.open(`${environment.url_deploy }/sesion/${this.event.id}`);
  }
}
