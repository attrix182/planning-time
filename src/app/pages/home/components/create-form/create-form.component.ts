import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { StorageService } from 'src/app/services/storage.service';
import { FormValidator } from 'src/app/shared/primeng/form.validator';
import { TranslateService } from '@ngx-translate/core';

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
    public translate: TranslateService
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
    form.id = Math.random().toString(36).substring(2);
    form.options = ['1', '2', '3', '5', '8', '13', '?', '☕'];
    form.active = true;
    this.storageSvc
      .insertCustomID('events', form.id, form)
      .then((res) => {
        this.isLoading = false;
        this.translate.get('CREATE_FORM.SUCCESS_MESSAGE').subscribe(msg => {
          this.messageService.add({ severity: 'success', summary: msg, detail: msg });
        });
        this.formGroup.reset();
        this.nextStepEvent.emit(form.id);
      })
      .catch((err) => {
        this.isLoading = false;
        this.translate.get('CREATE_FORM.ERROR_MESSAGE').subscribe(msg => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
        });
      });
  }
}
