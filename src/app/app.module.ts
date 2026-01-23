import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
import { ScaleModalComponent } from './pages/home/components/scale-modal/scale-modal.component';
import { DorDefinitionComponent } from './components/dor-definition/dor-definition.component';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader, TRANSLATE_HTTP_LOADER_CONFIG } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
    ScaleModalComponent,
    DorDefinitionComponent,
    
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimengModule,
    BrowserAnimationsModule,
    QrCodeModule,
    MarkdownModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory
      },
      defaultLanguage: 'es'
    }),

  ],
  providers: [
    MarkdownService, 
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), 
    provideFirestore(() => getFirestore()),
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: './assets/i18n/',
        suffix: '.json'
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(): TranslateHttpLoader {
  return new TranslateHttpLoader();
}
