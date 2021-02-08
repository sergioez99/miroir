import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './login/login.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { RegisterComponent } from './register/register.component';
import { RegistroempresaComponent } from './registroempresa/registroempresa.component';
import { RegisterClienteComponent } from './register-cliente/register-cliente.component';

const routes: Routes = [
  {
    path: 'login', component: AuthLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: '**', redirectTo: ''}
    ]
  },
  {
    path: 'recovery', component: AuthLayoutComponent,
    children: [
      { path: '', component: RecoveryComponent },
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
  {
    path: 'registro-cliente', component: AuthLayoutComponent,
    children: [
      { path: '', component: RegisterClienteComponent },
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
