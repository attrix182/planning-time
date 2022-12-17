import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EventSesion } from 'src/app/models/event.model';
import { AlertService } from 'src/app/services/alerts.service';
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
  userName: any = undefined;
  options: string[] = ['1', '2', '3', '5', '8', '13', '?'];
  optionSelected: string = undefined;
  results: any[] = [];
  promedio: number = 0;
  showResults: boolean = false;
  activeUsers: any[] = undefined;
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event): void {
    this.setInactiveUserInSesion();
  }

  constructor(
    private storageSvc: StorageService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private messageSvc: MessageService,
    private cloudFireStore: AngularFirestore,
    private alertService: AlertService
  ) {
    super();
    this.loading = true;
  }

  ngOnInit(): void {
    this.getSesion();
    this.initForm();
    this.getActiveUsers();
  }

  definirMensajesError(): void {}

  initForm() {
    this.formGroup = this.fb.group({
      name: [''],
      feedback: ['', Validators.required]
    });
  }

  getActiveUsers() {
    console.log(this.getId)
    this.storageSvc.GetByParameter('activeUsers', 'sesion', this.getId).subscribe((u) => {
      this.activeUsers = u;
      console.log(u);
      this.setActiveUserInSesion();
    });
  }

  getSesion() {
    this.loading = true;

    let aux = this.getId.trim();

    this.storageSvc.GetByParameter('events', 'id', aux).subscribe((res: any) => {
      this.event = res[0];
      this.loading = false;
      this.validate();
      this.getResults();
    });
    this.getUserActive();
  }

  validate() {
    if (!this.event) {
      this.router.navigateByUrl('');
    }
  }

  async getUserActive() {
    this.userName = localStorage.getItem('user-name');

    if (!this.userName) {
      await this.alertService.promptAlert().then((name: any) => (this.userName = name.value)); //prompt('Ingrese su nombre a mostrar:');
      localStorage.setItem('user-name', this.userName);
      this.setActiveUserInSesion();
    }else{
      this.setActiveUserInSesion();
    }
 
  }

  setActiveUserInSesion() {
    if(this.activeUsers == undefined) return;
    let active = true;
    let user = { name: this.userName, active, sesion: this.getId.trim() };
    let exist = this.activeUsers.findIndex((u) => (u.name == this.userName));
    console.log(exist);
    if (!user.name) return;
    if (exist == -1) {this.storageSvc.Insert('activeUsers',user)}; 
  }

  setInactiveUserInSesion() {
    let active = false;
    let user = { name: this.userName, active: active, sesion: this.getId.trim() };
    let exist = this.activeUsers.findIndex((u) => (u.name == this.userName && u.sesion == this.getId.trim()));
    if (!user.name) return;
    if (exist == -1) this.storageSvc.Update('activeUsers', this.activeUsers[exist].id,user)
  }

  selectOption(opt: string) {
    this.optionSelected = opt;
    let result = { user: this.userName, vote: this.optionSelected, sesion: this.getId.trim() };
    let exist = this.results.findIndex((r) => r.user == result.user);
    if (exist != -1) return;
    this.storageSvc.Insert(this.getId.trim(), result).then(() => {});
  }

  getResults() {
    this.storageSvc.GetAll(this.getId.trim()).subscribe((res: any) => {
      this.results = res;
      this.calcularPromedio();
    });
  }

  presentResults() {
    this.showResults = true;
  }

  hideResults() {
    this.showResults = false;
  }

  calcularPromedio() {
    let total = 0;
    this.results.forEach((v) => {
      total += v.vote != '?' ? parseInt(v.vote) : 0;
    });
    this.promedio = total / this.results.length;
  }

  restart() {
    this.showResults = false;
    this.optionSelected = undefined;
    this.storageSvc.DeleteColecction(this.getId.trim());
  }
}
