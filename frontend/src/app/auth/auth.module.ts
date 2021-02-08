import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './login/login.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { RegisterComponent } from './register/register.component';
import { RegistroempresaComponent } from './registroempresa/registroempresa.component';
import { ElementosComunesModule } from '../commons/elementos-comunes.module';
import { RegisterClienteComponent } from './register-cliente/register-cliente.component';



@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    RecoveryComponent,
    RegisterComponent,
    // InputEmailComponent,
    // ButtonBackComponent,
    RegistroempresaComponent,
    RegisterClienteComponent,


  ],
  exports: [
    AuthLayoutComponent,
    LoginComponent,
    RecoveryComponent,
    RegisterComponent,

    FormsModule,
    ReactiveFormsModule,


  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    ElementosComunesModule,


  ]
})
export class AuthModule { }
