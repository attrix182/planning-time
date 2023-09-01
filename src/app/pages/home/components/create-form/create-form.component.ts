import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { StorageService } from 'src/app/services/storage.service';
import { FormValidator } from 'src/app/shared/primeng/form.validator';

@Component({
  selector: 'fc-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.scss']
})
export class CreateFormComponent extends FormValidator implements OnInit {
  override formGroup: UntypedFormGroup;
  isLoading: boolean = false;
  @Output('back') back: any = new EventEmitter<void>();
  @Output('nextStep') nextStepEvent: any = new EventEmitter<string>();
  constructor(
    private fb: UntypedFormBuilder,
    private messageService: MessageService,
    private storageSvc: StorageService,
    private cloudFireStore: AngularFirestore
  ) {
    super();
  }

  definirMensajesError(): void {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formGroup = this.fb.group({
      team: ['', [Validators.required]]
    });
  }

  createSesion() {
    this.isLoading = true;
    let form = this.formGroup.value;
    form.id = this.cloudFireStore.createId();
    form.options = ['1', '2', '3', '5', '8', '13', '?', '☕'];
    form.active = true;
    this.storageSvc
      .InsertCustomID('events', form.id, form)
      .then((res) => {
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: '¡Creada!', detail: 'Sesión creada con éxito' });
        this.formGroup.reset();
        this.nextStepEvent.emit(form.id);
      })
      .catch((err) => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la sesión' });
      });
  }
}
