import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EventSesion } from 'src/app/models/event.model';

@Component({
  selector: 'fc-succesfully-create',
  templateUrl: './succesfully-create.component.html',
  styleUrls: ['./succesfully-create.component.scss']
})
export class SuccesfullyCreateComponent {
  @Input() event: EventSesion;
  copied: boolean = false;
  url: string = '';

  constructor(private messageSvc: MessageService) {}

  ngOnInit(): void {
    this.url = 'https://planningtime.com.ar/#/' + this.event.id;
  }

  removeLocalEvent(){
   localStorage.removeItem("events")
  }

  localStorageManager() {
    let events: any[] = [];
    events = JSON.parse(localStorage.getItem('events'));
    if (events == null) {
      localStorage.setItem('events', JSON.stringify(this.event));
    } else {
      localStorage.setItem('events', JSON.stringify(this.event));
    }
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
    window.open('https://planningtime.com.ar/#/sesion/' + this.event.id);
  }
}
