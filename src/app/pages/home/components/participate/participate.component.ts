import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'fc-participate',
  templateUrl: './participate.component.html',
  styleUrls: ['./participate.component.scss']
})
export class ParticipateComponent implements OnInit {
  @Input('id') sesionId: string = '';
  @Output('back') goBack: any = new EventEmitter();

  constructor(private router: Router) {}

  ngOnInit(): void {

  }

  goToSesion() {
    if (this.sesionId.length > 5) {
      if(this.sesionId.includes('https')){
        this.sesionId = this.sesionId.split('/')[4];
      }
      this.router.navigate(['/sesion/', this.sesionId.trim()]);
    }
  }
}
