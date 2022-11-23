import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MenuItem, MessageService} from 'primeng/api';
import {InputTextModule} from 'primeng/inputtext';
import {StepsModule} from 'primeng/steps';
import {SkeletonModule} from 'primeng/skeleton';
import {ToastModule} from 'primeng/toast';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {ToolbarModule} from 'primeng/toolbar';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ProgressSpinnerModule} from 'primeng/progressspinner';

const PrimeNGModules = [
  InputTextModule,
  StepsModule,
  SkeletonModule,
  ToastModule,
  DynamicDialogModule,
  ToolbarModule,
  ButtonModule,
  CardModule,
  MessagesModule,
  MessageModule,
  ProgressSpinnerModule,
];

@NgModule({
  declarations: [],
  imports: [
    ...PrimeNGModules

  ],
  providers: [MessageService],
  exports: [
    ...PrimeNGModules
  ]
})
export class PrimengModule { }
