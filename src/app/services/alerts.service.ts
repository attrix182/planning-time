import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor() {}

  alertBottom(icon: SweetAlertIcon, text: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,

      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: icon,
      title: text
    });
  }

  alertTop(icon: SweetAlertIcon, text: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,

      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: icon,
      title: text
    });
  }

  alertCenter(icon: SweetAlertIcon, text: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,

      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: icon,
      title: text
    });
  }

  confirmAlert(messagge:string) {
    return new Promise((resolve) => {
      Swal.fire({
        title: messagge,
        showDenyButton: true,
        reverseButtons: true,
        confirmButtonText: 'Si',
        denyButtonText: `Cancelar`
      }).then((result) => {
        if (result.isConfirmed) {
          resolve(true);
        }
        resolve(false);
      });
    });
  }

  promptAlert() {
    return new Promise((resolve) => {
      Swal.fire({
        title: 'Ingrese su nombre',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: false,
        confirmButtonText: 'Ingresar',
        showLoaderOnConfirm: true,
        allowOutsideClick: false
      }).then((name) => {
        resolve(name);
      });
    });
  }
}
