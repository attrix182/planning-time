import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'fc-scale-modal',
  templateUrl: './scale-modal.component.html',
  styleUrls: ['./scale-modal.component.scss']
})
export class ScaleModalComponent implements OnInit {
  tasks: any = []; //TaskModel[] = [];
  getId = this.router.url.split('/')[2].trim();
  scaleInput: string = '';
  optionsFormatted: string = '';
  presets: any[] = [
    { name: 'fibonacci', values: '1,2,3,4,5,8,13,☕' },
    { name: 't-shirts', values: 'xxs,xs,s,m,l,xl,xxl,?,☕' }
  ];
  @Input() event: any = {};
  @Output('onClose') onClose: any = new EventEmitter<void>();

  constructor(private storageSVC: StorageService, private router: Router) {}

  ngOnInit(): void {
    //remove comas
    this.optionsFormatted = this.event?.options?.toString().replace(/,/g, ' - ');
  }

  formatOption(option: string) {
    return option.toString().replace(/,/g, ' - ');
  }

  setScale() {
    this.event.options = this.scaleInput.split(',');
    this.storageSVC.Update(this.getId, 'events', this.event);
    this.onClose.emit();
  }

  changeScale(option) {
    this.scaleInput = option.values;
    console.log(option);
  }

  saveAndClose() {
    this.onClose.emit();
  }

  closeModal() {
    this.onClose.emit();
  }
}
