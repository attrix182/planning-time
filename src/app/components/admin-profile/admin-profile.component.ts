import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'fc-admin-profile-modal',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {
  getId = this.router.url.split('/')[2].trim();
  @Input() userActive: any;
  @Output('onClose') onClose: any = new EventEmitter<void>();
  @Output('onChangeName') onChangeName: any = new EventEmitter<void>();

  constructor(private router: Router, private storageSVC:StorageService) {}

  ngOnInit(): void {
    console.log(this.userActive);
  }
  saveAndClose() {
    this.storageSVC.update(this.userActive.id, 'activeUsers', this.userActive)
    this.onClose.emit();
  }
  
  changeName(){
    this.onChangeName.emit()
  }

  toggleFacilitator(){
    this.userActive.facilitator = !this.userActive.facilitator;
  }

  closeModal() {
    this.onClose.emit();
  }
}
