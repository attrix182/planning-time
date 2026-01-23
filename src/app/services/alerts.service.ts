import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private translate: TranslateService) {}

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
      this.translate.get(['COMMON.YES', 'COMMON.CANCEL']).subscribe(translations => {
        Swal.fire({
          title: messagge,
          showDenyButton: true,
          reverseButtons: true,
          confirmButtonText: translations['COMMON.YES'],
          denyButtonText: translations['COMMON.CANCEL']
        }).then((result) => {
          if (result.isConfirmed) {
            resolve(true);
          }
          resolve(false);
        });
      });
    });
  }

  promptAlert() {
    return new Promise((resolve) => {
      this.translate.get(['ALERTS.ENTER_NAME', 'ALERTS.ENTER']).subscribe(translations => {
        Swal.fire({
          title: translations['ALERTS.ENTER_NAME'],
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: false,
          confirmButtonText: translations['ALERTS.ENTER'],
          showLoaderOnConfirm: true,
          allowOutsideClick: false
        }).then((name) => {
          resolve(name);
        });
      });
    });
  }
}
