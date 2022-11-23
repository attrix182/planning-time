import { FormGroup, UntypedFormGroup } from '@angular/forms';

export abstract class FormValidator {
  public formGroup: UntypedFormGroup;
  public mensajesError: any;

  constructor() {
    this.definirMensajesError();
  }

  isValidField(field: string): string {
    const validateField = this.formGroup.get(field);
    return !validateField.valid && validateField.touched
      ? 'is-invalid'
      : validateField.touched
      ? 'is-valid'
      : '';
  }

  debeMostrarError(field: string): boolean {
    const validateField = this.formGroup.get(field);

    return !validateField.valid && validateField.touched;
  }

  obtenerTextoError(field: string) {
    const validateField = this.formGroup.get(field);
    const primerError = Object.keys(validateField.errors)[0];
    return this.mensajesError[field] && this.mensajesError[field][primerError]
      ? this.mensajesError[field][primerError]
      : 'Este dato no parece valido';
  }

  abstract definirMensajesError(): void;
}
