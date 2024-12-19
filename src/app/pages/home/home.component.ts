import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventSesion } from 'src/app/models/event.model';
import { StorageService } from 'src/app/services/storage.service';
import { Section } from 'src/app/types/section.type';
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
  actualSection: Section = this.router.url.split('/')[1] as Section;
  fullUrl: string = this.router.url;
  event: EventSesion;
  eventID: string = this.fullUrl.split('/')[2];
  constructor(private storageSvc: StorageService, private router: Router) {}

  ngOnInit(): void {
    this.checkUrl();
  }

  toggleShowCreate() {
    this.showCreate = !this.showCreate;
  }

  toggleShowParticipate() {
    this.showParticipate = !this.showParticipate;
  }

  goToLanding() {
    this.router.navigateByUrl('/about/landing');
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
