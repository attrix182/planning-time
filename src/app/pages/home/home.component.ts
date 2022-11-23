import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EventSesion } from 'src/app/models/event.model';
import { StorageService } from 'src/app/services/storage.service';

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
  succesfullyCreate: boolean = false;
  showParticipate: boolean = false;
  idHandled: string;
  event: EventSesion;
  loading: boolean = false;
  actualSection = this.router.url.split('/')[1];
  fullUrl: string = this.router.url;
  passID: string;
  eventLocal: EventSesion;

  constructor(private storageSvc: StorageService, private router: Router) {}

  ngOnInit(): void {
    this.checkUrl();
    this.getLocalEvents();
  }

  toggleShowCreate() {
    this.showCreate = !this.showCreate;
  }

  toggleShowParticipate() {
    this.showParticipate = !this.showParticipate;
  }

  checkUrl() {
    if (this?.actualSection.toString().includes('info')) {
      this.passID = this.fullUrl.split('/')[2];
      this.handleID(this.passID);
    }
    if (this.actualSection?.length > 2 && this?.actualSection === 'participate') {
      this.showParticipate = true;
    } else {
      if (this.actualSection.length < 2) {
        return;
      }
      this.showParticipate = true;
      this.passID = this.actualSection;
    }
  }

  getLocalEvents() {
    this.eventLocal = JSON.parse(localStorage.getItem('events'));
  }

  goToLocalEvent() {
    if (this.eventLocal) {
      this.router.navigate(['/info/', this.eventLocal.id]);
    }
  }

  goToLanding() {
    this.router.navigateByUrl('/about/landing');
  }

  handleID(id: string) {
    console.log(id);
    this.idHandled = id;
    this.loading = true;
    this.showCreate = false;
    this.storageSvc.GetByParameter('events', 'id', id).subscribe((res: any) => {
      console.log(res);
      this.loading = false;
      this.event = res[0];
      this.succesfullyCreate = true;
    });
  }
}
