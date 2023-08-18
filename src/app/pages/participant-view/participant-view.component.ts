import { Component, HostListener, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EventSesion } from 'src/app/models/event.model';
import { TaskModel } from 'src/app/models/task.model';
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
  getId = this.router.url.split('/')[2].trim();
  event: EventSesion;
  override formGroup: any;
  userName: any = undefined;
  options: string[] = ['1', '2', '3', '5', '8', '13', '?', '☕'];
  optionSelected: string = undefined;
  results: any[] = [];
  promedio: number = 0;
  showResults: boolean = false;
  activeUsers: any[] = undefined;
  showActions: boolean = false;
  selectedTask: TaskModel;
  showModal: boolean = false;

  constructor(
    private storageSvc: StorageService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private alertService: AlertService,
    private messageService: MessageService
  ) {
    super();
    this.loading = true;
  }

  ngOnInit(): void {
    this.initForm();
    this.getInfo();
  }

  getInfo() {
    this.getSesion();
    this.getActiveUsers();
    this.getResultsVisibility();
  }

  changeName() {
    if (this.optionSelected) {
      this.cantVote();
      return;
    }
    localStorage.removeItem('user-name');

    this.removeUser(this.getUser().id);
  }

  cantVote() {
    this.messageService.clear();
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No puedes cambiar tu nombre si votaste' });
  }

  getUser() {
    return this.activeUsers.find((u) => u.name == this.userName);
  }

  removeUser(id: string) {
    this.storageSvc.Delete('activeUsers', id).then(() => {
      this.optionSelected = undefined;
      this.userName = undefined;
    });
    this.getUserActive();
  }

  definirMensajesError(): void {}

  initForm() {
    this.formGroup = this.fb.group({
      name: [''],
      feedback: ['', Validators.required]
    });
  }

  getActiveUsers() {
    console.log(this.getId);
    this.storageSvc.GetByParameter('activeUsers', 'sesion', this.getId).subscribe((u) => {
      this.activeUsers = u;
      this.setActiveUserInSesion();
    });
  }

  getSesion() {
    this.loading = true;

    let aux = this.getId;

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
      await this.alertService.promptAlert().then((name: any) => (this.userName = name.value));
      localStorage.setItem('user-name', this.userName);
      this.setActiveUserInSesion();
    } else {
      this.setActiveUserInSesion();
    }
  }

  setActiveUserInSesion() {
    if (this.activeUsers == undefined) return;
    let active = true;
    let user = { name: this.userName, active, sesion: this.getId };
    let exist = this.activeUsers.findIndex((u) => u.name == this.userName);
    if (!user.name) return;
    if (exist == -1) {
      this.storageSvc.Insert('activeUsers', user);
    }
  }

  setInactiveUserInSesion() {
    let active = false;
    let user = { name: this.userName, active: active, sesion: this.getId };
    let exist = this.activeUsers.findIndex((u) => u.name == this.userName && u.sesion == this.getId);
    if (!user.name) return;
    if (exist == -1) this.storageSvc.Update('activeUsers', this.activeUsers[exist].id, user);
  }

  selectOption(opt: string) {
    if (this.showResults) {
      this.cantVoteShowResults();
      return;
    }
    if (this.optionSelected) {
      this.areVotedMsg();
      return;
    }

    this.optionSelected = opt;

    let result = { user: this.userName, vote: this.optionSelected, sesion: this.getId };
    let exist = this.results.findIndex((r) => r.user == result.user);
    if (exist != -1) return;
    this.storageSvc.Insert(this.getId, result);
  }

  cantVoteShowResults() {
    this.messageService.clear();
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No puedes votar mientras los resultados son visibles'
    });
    return;
  }

  areVotedMsg() {
    this.messageService.clear();
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No puedes cambiar tu voto' });
  }

  getResults() {
    this.storageSvc.GetAll(this.getId).subscribe((res: any) => {
      this.results = res;
      this.restartAnswered();
      this.setAnswered();
      this.calcularPromedio();
    });
  }

  getResultsVisibility() {
    this.storageSvc.GetByParameter('events', 'id', this.getId).subscribe((res: any) => {
      this.event = res[0];
      this.showResults = this.event.resultsVisibility;
    });
  }

  presentResults() {
    if (this.results.length == 0) {
      this.messageService.clear();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Aún no hay resultados para mostrar' });
      return;
    }
    this.event.resultsVisibility = true;
    this.storageSvc.Update(this.getId, 'events', this.event);
    this.showResults = true;
  }

  hideResults() {
    this.event.resultsVisibility = false;
    this.storageSvc.Update(this.getId, 'events', this.event);
    this.showResults = false;
    this.restartAnswered();
  }

  calcularPromedio() {
    let total = 0;
    let resultsAux = this.results.filter((r) => r.vote !== '?');
    resultsAux = resultsAux.filter((r) => r.vote !== '☕');

    resultsAux.forEach((v) => {
      if (v.vote !== '?') {
        total += parseInt(v.vote);
      }
    });

    this.promedio = total / resultsAux.length;
  }

  setAnswered() {
    if (this.results.length == 0) this.restartAnswered();
    this.results.forEach((r) => {
      if (r.user == this.userName) {
        this.optionSelected = r.vote;
      }
    });

    this.activeUsers.forEach((user) => {
      this.results.forEach((item) => {
        if (user.name == item.user) {
          user.answer = true;
        }
      });
    });
  }

  restartAnswered() {
    this.optionSelected = undefined;
    this.activeUsers.forEach((user) => {
      user.answer = false;
    });
  }

  restart() {
    if (this.results.length == 0) return;
    this.alertService.confirmAlert('¿Desea reiniciar la votación?').then((confirm) => {
      if (confirm) {
        this.hideResults();
        this.storageSvc.DeleteColecction(this.getId.trim()).then(() => {
          this.restartAnswered();
          this.getInfo();
          this.optionSelected = undefined;
        });
      }
    });
  }

  toggleShowActions() {
    this.showActions = !this.showActions;
  }


  toggleModal(){
    this.showModal = !this.showModal
  }
  
  selectTask(selectedTask: TaskModel){
    this.selectedTask = selectedTask
    console.log(selectedTask)
  }
}
