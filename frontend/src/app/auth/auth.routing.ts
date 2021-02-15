import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './login/login.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { RegisterComponent } from './register/register.component';
import { RegistroempresaComponent } from './registroempresa/registroempresa.component';
import { VerificacionComponent } from './verificacion/verificacion.component';
import { VerificadoComponent } from './verificado/verificado.component';
import { CambiarpasswordComponent } from './cambiarpassword/cambiarpassword.component';

const routes: Routes = [
  {
    path: 'login', component: AuthLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: '**', redirectTo: ''}
    ]
  },
  {
    path: 'registrarse', component: AuthLayoutComponent,
    children: [
      { path: '', component: RegisterComponent },
      { path: '**', redirectTo: ''}
    ]
  },
  {
    path: 'registro', component: AuthLayoutComponent,
    children: [
      { path: '', component: RegistroempresaComponent },
      { path: '**', redirectTo: ''}
    ]
  },
  { path: 'verificacion', component: AuthLayoutComponent,
    children: [
      { path: '', component: VerificacionComponent },
      { path: '**', redirectTo: ''}
    ]
  },
  { path: 'verificado', component: AuthLayoutComponent,
    children: [
      { path: '', component: VerificadoComponent },
      { path: '**', redirectTo: ''}
    ]
 },
 { path: 'recuperar', component: AuthLayoutComponent,
    children: [
      { path: '', component: RecoveryComponent },
      { path: '**', redirectTo: ''}
    ]
 },
 { path: 'cambiarpassword', component: AuthLayoutComponent,
    children: [
      { path: '', component: CambiarpasswordComponent },
      { path: '**', redirectTo: ''}
    ]
 },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
