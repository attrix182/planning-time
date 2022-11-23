import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EventSesion } from 'src/app/models/event.model';
import { StorageService } from 'src/app/services/storage.service';
import { FormValidator } from 'src/app/shared/primeng/form.validator';

@Component({
  selector: 'fc-participant-view',
  templateUrl: './participant-view.component.html',
  styleUrls: ['./participant-view.component.scss']
})
export class ParticipantViewComponent extends FormValidator implements OnInit {
  loading: boolean = false;
  loadingBtn: boolean = false;
  getId = this.router.url.split('/')[2].trim();
  event: EventSesion;
  override formGroup: any;

  constructor(
    private storageSvc: StorageService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private messageSvc: MessageService,
    private cloudFireStore: AngularFirestore
  ) {
    super();
    this.loading = true;
  }

  ngOnInit(): void {
    this.getSesion();
    this.initForm();
  }

  definirMensajesError(): void {}

  initForm() {
    this.formGroup = this.fb.group({
      name: [''],
      feedback: ['', Validators.required]
    });
  }

  sendFeedback() {

    this.loadingBtn = true;
    this.formGroup.value.id = this.getId;

    this.storageSvc
      .InsertCustomID('feedbacks', this.cloudFireStore.createId(), this.formGroup.value)
      .then((res: any) => {
        console.log(res);
        this.messageSvc.add({ severity: 'success', summary: 'Exito', detail: 'Gracias por tu feedback' });
        this.formGroup.reset();
        this.loading = false;
        this.loadingBtn = false;
        setTimeout(() => {
          this.router.navigateByUrl('');
        }, 1500);
      });
  }

  getSesion() {
    this.loading = true;

    let aux = this.getId.trim();

    this.storageSvc.GetByParameter('events', 'id', aux).subscribe((res: any) => {
      console.log(res[0]);
      this.event = res[0];
      this.loading = false;
      this.validate();
    });
  }

  validate() {
    console.log(this.event);
    if (!this.event) {
      this.router.navigateByUrl('');
    }
  }
}
