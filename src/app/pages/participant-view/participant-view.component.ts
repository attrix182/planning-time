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
  userName: string = undefined;
  options: string[] = ['1', '2', '3', '5', '8', '13', '?'];
  optionSelected: string = undefined;
  results: any[];
  promedio: number = 0;

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
    this.setActiveUserInSesion();
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
      this.event = res[0];
      this.loading = false;
      this.validate();
    });
    this.getUserActive();
  }

  validate() {
    if (!this.event) {
      this.router.navigateByUrl('');
    }
  }

  getUserActive() {
    this.userName = localStorage.getItem('user-name');
    if (!this.userName) {
      this.userName = prompt('Ingrese su nombre a mostrar:');
      localStorage.setItem('user-name', this.userName);
    }
  }

  setActiveUserInSesion() {
    let active = true;
    let user = { name: this.userName, active: active, sesion: this.getId.trim() };
    this.storageSvc.Insert('activeUsers', user).then((res: any) => {});
  }

  setInactiveUserInSesion() {
    let active = false;
    let user = { name: this.userName, active: active, sesion: this.getId.trim() };
    this.storageSvc.Insert('activeUsers', user).then((res: any) => {});
  }

  selectOption(opt: string) {
    this.optionSelected = opt;
    let result = { user: this.userName, vote: this.optionSelected, sesion: this.getId.trim() };
    this.storageSvc.Insert(this.getId.trim(), result).then(() => {});
  }
  getResults() {
    this.storageSvc.GetAll(this.getId.trim()).subscribe((res: any) => {
      this.results = res;
      this.calcularPromedio()
    });
  }

  calcularPromedio(){
    let total = 0
    this.results.forEach((v)=> {total +=  parseInt(v.vote)})
    console.log(total)
    this.promedio = total / this.results.length
  }

  restart() {
    this.optionSelected = undefined;
    this.storageSvc.DeleteColecction(this.getId.trim());
  }
}
