import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EventSesion } from 'src/app/models/event.model';
import { Feedback } from 'src/app/models/feedback.model';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'fc-feedback-view',
  templateUrl: './feedback-view.component.html',
  styleUrls: ['./feedback-view.component.scss']
})
export class FeedbackViewComponent implements OnInit {
  feedback: Feedback[];
  loading: boolean = true;
  event: EventSesion;
  getId = this.router.url.split('/')[2].trim();

  constructor(private router: Router, private storageSvc: StorageService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.getFeedback();
  }

  getFeedback() {
    this.loading = true;
    this.storageSvc.GetByParameter('feedbacks', 'id', this.getId).subscribe((res: any) => {
      this.feedback = res;
      console.log(this.feedback);
    });

    this.storageSvc.GetByParameter('events', 'id', this.getId).subscribe((res: any) => {
      this.event = res[0];
      this.loading = false;
    });
  }

  onConfirm() {
    this.messageService.clear('c');
    if (this.event.active) {
      this.event.active = false;
      this.storageSvc.Update(this.getId, 'events', this.event).then(() => {});
    } else {
      this.event.active = true;
      this.storageSvc.Update(this.getId, 'events', this.event).then(() => {});
    }
  }

  onReject() {
    this.messageService.clear('c');
}


  showConfirm() {
    this.messageService.clear();
    this.messageService.add({
      key: 'c',
      sticky: true,
      severity: 'warn',
      summary: '¿Queres cambiar el estado de la sesión?',
    });
  }
}
