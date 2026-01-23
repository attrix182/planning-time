import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';
import { ParticipantViewComponent } from './pages/participant-view/participant-view.component';
import { LanguageGuard } from './guards/language.guard';

const routes: Routes = [
  {path: '', canActivate: [LanguageGuard], component: HomeComponent},
  {path: ':lang', component: HomeComponent},
  {path: ':lang/:id',  component: HomeComponent},
  {path: ':lang/about/landing',  component: LandingComponent},
  {path: ':lang/info/:id', component: HomeComponent},
  {path: ':lang/sesion/:id', component: ParticipantViewComponent},
  // Rutas sin idioma - redirigirán automáticamente
  {path: ':id', canActivate: [LanguageGuard], component: HomeComponent},
  {path: 'about/landing', canActivate: [LanguageGuard], component: LandingComponent},
  {path:'info/:id', canActivate: [LanguageGuard], component: HomeComponent},
  {path:'sesion/:id', canActivate: [LanguageGuard], component: ParticipantViewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
