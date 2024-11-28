import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'fc-dor-definition',
  templateUrl: './dor-definition.component.html',
  styleUrls: ['./dor-definition.component.scss'],
})
export class DorDefinitionComponent implements OnInit {
  @Input() dor:string = '';
  @Output() dorChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

}
