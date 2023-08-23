import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { PrimengModule } from './shared/primeng/primeng.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CreateFormComponent } from './pages/home/components/create-form/create-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuccesfullyCreateComponent } from './pages/home/components/succesfully-create/succesfully-create.component';
import { ParticipateComponent } from './pages/home/components/participate/participate.component';
import { CommonModule } from '@angular/common';
import { ParticipantViewComponent } from './pages/participant-view/participant-view.component';
import { QrCodeModule } from 'ng-qrcode';
import { LandingComponent } from './pages/landing/landing.component';
import { TasksModalComponent } from './pages/home/components/tasks-modal/tasks-modal.component';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateFormComponent,
    SuccesfullyCreateComponent,
    ParticipateComponent,
    ParticipantViewComponent,
    LandingComponent,
    TasksModalComponent,
    AdminProfileComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    PrimengModule,
    BrowserAnimationsModule,
    QrCodeModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
