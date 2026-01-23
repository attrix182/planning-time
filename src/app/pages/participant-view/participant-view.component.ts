import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EventSesion } from 'src/app/models/event.model';
import { TaskModel } from 'src/app/models/task.model';
import { AlertService } from 'src/app/services/alerts.service';
import { StorageService } from 'src/app/services/storage.service';
import { FormValidator } from 'src/app/shared/primeng/form.validator';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fc-participant-view',
  templateUrl: './participant-view.component.html',
  styleUrls: ['./participant-view.component.scss']
})
export class ParticipantViewComponent extends FormValidator implements OnInit, OnDestroy {
  loading: boolean = false;
  getId: string;
  event: EventSesion;
  override formGroup: any;
  userName: any = undefined;
  userActive: any;
  options: string[];
  optionSelected: string = undefined;
  results: any[] = [];
  promedio: number = 0;
  showResults: boolean = false;
  activeUsers: any[] = undefined;
  showActions: boolean = false;
  selectedTask: TaskModel;
  showTasksModal: boolean = false;
  showAdminProfileModal: boolean = false;
  showAdminScale: boolean = false;
  
  private previousResultsCount: number = 0;
  private previousUsersCount: number = 0;
  private previousUserNames: Set<string> = new Set();
  private previousShowResults: boolean = false;
  private resultsSubscription: Subscription;
  private usersSubscription: Subscription;
  private eventSubscription: Subscription;
  private isLocalAction: boolean = false; // Bandera para evitar notificaciones duplicadas

  constructor(
    private storageSvc: StorageService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private alertService: AlertService,
    private messageService: MessageService,
    private languageService: LanguageService,
    public translate: TranslateService,
    private notificationsService: NotificationsService
  ) {
    super();
    this.loading = true;
  }

  ngOnInit(): void {
    this.parseUrl();
    this.initForm();
    this.getInfo();
    
    // Activar AudioContext cuando el componente se inicializa
    // Esto ayuda a que los sonidos funcionen para todos los usuarios
    this.notificationsService.activateAudioContext();
  }

  private parseUrl(): void {
    // Usar ActivatedRoute para obtener el parámetro 'id' de la ruta
    // Usar snapshot para obtener el valor inmediatamente (síncrono)
    const params = this.route.snapshot.params;
    
    if (params['id']) {
      this.getId = params['id'].trim();
    } else {
      // Fallback: parsear manualmente si no hay parámetro (retrocompatibilidad)
      // Esto puede pasar si alguien entra con una URL antigua sin idioma
      const urlSegments = this.router.url.split('/').filter(segment => segment);
      const sesionIndex = urlSegments.indexOf('sesion');
      
      if (sesionIndex !== -1 && urlSegments.length > sesionIndex + 1) {
        // El ID está después de 'sesion'
        this.getId = urlSegments[sesionIndex + 1].trim();
      } else if (urlSegments.length > 0 && !['es', 'en'].includes(urlSegments[0])) {
        // Si no hay idioma y no hay 'sesion', tomar el primer segmento como ID
        this.getId = urlSegments[0].trim();
      }
    }
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
    this.translate.get('PARTICIPANT_VIEW.CANT_CHANGE_NAME').subscribe(msg => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
    });
  }

  getUser() {
    return this.activeUsers.find((u) => u.name == this.userName);
  }

  removeUser(id: string) {
    this.storageSvc.delete('activeUsers', id).then(() => {
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
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
    
    this.usersSubscription = this.storageSvc.getByParameter('activeUsers', 'sesion', this.getId).subscribe((u: any[]) => {
      const currentUsersCount = u?.length || 0;
      const userNames: string[] = (u || []).map((user: any) => String(user?.name || '')).filter((name: string) => name.length > 0);
      const currentUserNames = new Set<string>(userNames);
      
      // Detectar nuevos participantes
      if (this.previousUserNames.size > 0 && currentUsersCount > this.previousUsersCount) {
        const newUsers = userNames.filter((name: string) => !this.previousUserNames.has(name));
        newUsers.forEach((name: string) => {
          if (name !== this.userName) {
            this.notificationsService.notifyNewParticipant(name);
          }
        });
      }
      
      // Detectar participantes que se fueron
      if (this.previousUserNames.size > 0 && currentUsersCount < this.previousUsersCount) {
        const leftUsers = Array.from(this.previousUserNames).filter((name: string) => !currentUserNames.has(name));
        leftUsers.forEach((name: string) => {
          if (name !== this.userName) {
            this.notificationsService.notifyParticipantLeft(name);
          }
        });
      }
      
      this.activeUsers = u;
      this.previousUsersCount = currentUsersCount;
      this.previousUserNames = currentUserNames;
      this.setActiveUserInSesion();
      
      // Restaurar el estado de quién ha votado después de actualizar la lista de usuarios
      // Esto es necesario porque cuando se actualiza activeUsers desde Firebase,
      // se pierden las propiedades locales como 'answer'
      // Usar setTimeout para asegurar que activeUsers esté completamente actualizado
      // IMPORTANTE: Solo restaurar si hay resultados y usuarios válidos
      setTimeout(() => {
        if (this.results && Array.isArray(this.results) && this.results.length > 0 && 
            this.activeUsers && Array.isArray(this.activeUsers) && this.activeUsers.length > 0) {
          this.setAnswered();
        } else if (this.results && this.results.length === 0) {
          // Si no hay resultados, asegurarse de que nadie esté marcado como votado
          this.restartAnswered();
        }
      }, 0);
    });
  }

  getSesion() {
    this.loading = true;

    let aux = this.getId;

    this.storageSvc.getByParameter('events', 'id', aux).subscribe((res: any) => {
      if (!res || res.length === 0) {
        this.loading = false;
        return;
      }
      
      this.event = res[0];
      this.loading = false;
      this.options = res[0].options ? res[0].options : ['1', '2', '3', '5', '8', '13', '?', '☕'];
      this.selectedTask = res[0].selectedTask;
      this.previousShowResults = res[0].resultsVisibility || false;
      this.validate();
      this.getResults();
    });
    this.getUserActive();
  }

  validate() {
    if (!this.event) {
      const lang = this.languageService.getCurrentLanguage();
      this.router.navigateByUrl(`/${lang}`);
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
      this.storageSvc.insert('activeUsers', user);
    }
    this.userActive = this.getUser();
  }

  setInactiveUserInSesion() {
    let active = false;
    let user = { name: this.userName, active: active, sesion: this.getId };
    let exist = this.activeUsers.findIndex((u) => u.name == this.userName && u.sesion == this.getId);
    if (!user.name) return;
    if (exist == -1) this.storageSvc.update('activeUsers', this.activeUsers[exist].id, user);
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

    // Activar AudioContext cuando el usuario interactúa (requerido por navegadores)
    this.notificationsService.activateAudioContext();

    this.optionSelected = opt;

    let result = { user: this.userName, vote: this.optionSelected, sesion: this.getId };
    let exist = this.results.findIndex((r) => r.user == result.user);
    if (exist != -1) return;
    
    // Notificar voto propio (sonido más suave)
    this.notificationsService.notifyVote(this.userName, true);
    
    this.storageSvc.insert(this.getId, result);
  }

  cantVoteShowResults() {
    this.messageService.clear();
    this.translate.get('PARTICIPANT_VIEW.CANT_VOTE_SHOW_RESULTS').subscribe(msg => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: msg
      });
    });
    return;
  }

  areVotedMsg() {
    this.messageService.clear();
    this.translate.get('PARTICIPANT_VIEW.CANT_CHANGE_VOTE').subscribe(msg => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
    });
  }

  getResults() {
    if (this.resultsSubscription) {
      this.resultsSubscription.unsubscribe();
    }
    
    this.resultsSubscription = this.storageSvc.getAll(this.getId).subscribe((res: any) => {
      const currentResultsCount = res?.length || 0;
      
      // Detectar nuevos votos (solo si no es el propio voto)
      if (this.previousResultsCount > 0 && currentResultsCount > this.previousResultsCount) {
        const previousUserVotes = new Set(
          this.results.map((r: any) => r.user)
        );
        const newVotes = res.filter((r: any) => !previousUserVotes.has(r.user));
        
        newVotes.forEach((vote: any) => {
          if (vote.user !== this.userName) {
            this.notificationsService.notifyVote(vote.user, false);
          }
        });
      }
      
      this.results = res;
      this.previousResultsCount = currentResultsCount;
      this.restartAnswered();
      this.setAnswered();
      this.calcularPromedio();
    });
  }

  getResultsVisibility() {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
    
    this.eventSubscription = this.storageSvc.getByParameter('events', 'id', this.getId).subscribe((res: any) => {
      if (!res || res.length === 0) return;
      
      const previousShowResults = this.previousShowResults;
      this.event = res[0];
      this.showResults = this.event.resultsVisibility;
      
      // Notificar cambios en visibilidad de resultados solo si:
      // 1. Hubo un cambio real
      // 2. El cambio NO fue causado por una acción local del usuario
      if (previousShowResults !== this.showResults && !this.isLocalAction) {
        if (this.showResults) {
          this.notificationsService.notifyResultsShown();
        } else {
          this.notificationsService.notifyResultsHidden();
        }
      }
      
      // Resetear la bandera después de procesar
      this.isLocalAction = false;
      this.previousShowResults = this.showResults;
    });
  }

  presentResults() {
    if (this.results.length == 0) {
      this.messageService.clear();
      this.translate.get('PARTICIPANT_VIEW.NO_RESULTS_YET').subscribe(msg => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
      });
      return;
    }
    
    // Marcar como acción local para evitar notificación duplicada
    this.isLocalAction = true;
    this.event.resultsVisibility = true;
    this.storageSvc.update(this.getId, 'events', this.event);
    this.showResults = true;
    
    // Notificar inmediatamente (solo una vez)
    this.notificationsService.notifyResultsShown();
  }

  hideResults() {
    // Marcar como acción local para evitar notificación duplicada
    this.isLocalAction = true;
    this.event.resultsVisibility = false;
    this.storageSvc.update(this.getId, 'events', this.event);
    this.showResults = false;
    
    // Notificar inmediatamente (solo una vez)
    this.notificationsService.notifyResultsHidden();
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
    if (!this.activeUsers || !this.results) return;
    
    if (this.results.length == 0) {
      this.restartAnswered();
      return;
    }
    
    // Restaurar el voto seleccionado del usuario actual
    this.results.forEach((r) => {
      if (r.user === this.userName) {
        this.optionSelected = r.vote;
      }
    });

    // Marcar qué usuarios han votado basándose en los resultados
    // Primero resetear todos los estados
    this.activeUsers.forEach((user) => {
      if (user) {
        user.answer = false;
      }
    });
    
    // Luego marcar SOLO los que realmente han votado
    // IMPORTANTE: 
    // 1. Verificar que el usuario existe y tiene nombre
    // 2. Verificar que hay un resultado que coincide EXACTAMENTE con ese nombre
    // 3. Asegurarse de que el resultado tiene un voto válido
    this.activeUsers.forEach((user) => {
      if (user && user.name && typeof user.name === 'string') {
        // Buscar un resultado que coincida exactamente con el nombre del usuario
        const userVote = this.results.find((item) => {
          return item && item.user && typeof item.user === 'string' && item.user === user.name;
        });
        
        // Solo marcar como votado si existe un voto válido para ese usuario
        if (userVote && userVote.vote !== undefined && userVote.vote !== null) {
          user.answer = true;
        }
      }
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
    this.translate.get('PARTICIPANT_VIEW.RESTART_VOTING').subscribe(msg => {
      this.alertService.confirmAlert(msg).then((confirm) => {
        if (confirm) {
          // Marcar como acción local
          this.isLocalAction = true;
          this.hideResults();
          this.storageSvc.deleteCollection(this.getId.trim()).then(() => {
            this.restartAnswered();
            this.previousResultsCount = 0;
            this.getInfo();
            this.optionSelected = undefined;
          });
        }
      });
    });
  }

  toggleShowActions() {
    this.showActions = !this.showActions;
    // Activar AudioContext en cualquier interacción
    this.notificationsService.activateAudioContext();
  }

  toggleTasksModal() {
    this.showTasksModal = !this.showTasksModal;
    // Activar AudioContext en cualquier interacción
    this.notificationsService.activateAudioContext();
  }

  toggleAdminProfileModal() {
    this.showAdminProfileModal = !this.showAdminProfileModal;
    // Activar AudioContext en cualquier interacción
    this.notificationsService.activateAudioContext();
  }

  toggleAdminScaleModal(){
    this.showAdminScale = !this.showAdminScale;
  }

  deleteUser(user) {
    if (this.results.length > 0) {
      this.translate.get('PARTICIPANT_VIEW.CANT_DELETE_USER').subscribe(msg => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: msg
        });
      });
      return;
    }
    
    // Asegurarse de que no se está eliminando al usuario actual
    if (user.name === this.userName) {
      this.translate.get('PARTICIPANT_VIEW.CANT_DELETE_YOURSELF').subscribe(msg => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: msg || 'No puedes eliminarte a ti mismo'
        });
      });
      return;
    }
    
    this.storageSvc.delete('activeUsers', user.id).then(() => {
      console.warn(user.name + ' deleted');
      // Asegurarse de que después de eliminar, se restaure correctamente el estado
      // Esperar un momento para que Firebase actualice antes de restaurar estados
      setTimeout(() => {
        if (this.results && this.results.length > 0 && this.activeUsers) {
          this.setAnswered();
        } else {
          this.restartAnswered();
        }
      }, 100);
    });
  }

  selectTask(selectedTask: TaskModel) {
    this.selectedTask = selectedTask;
    if (selectedTask?.title?._text) {
      this.notificationsService.notifyTaskSelected(selectedTask.title._text);
    }
  }

  ngOnDestroy(): void {
    if (this.resultsSubscription) {
      this.resultsSubscription.unsubscribe();
    }
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }
}
