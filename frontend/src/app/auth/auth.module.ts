import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from '../material/material.module';

import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './login/login.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { RegisterComponent } from './register/register.component';
// import { ButtonBackComponent } from '../commons/button-back/button-back.component';
// import { InputEmailComponent } from '../commons/input-email/input-email.component';
import { RegistroempresaComponent } from './registroempresa/registroempresa.component';
import { ElementosComunesModule } from '../commons/elementos-comunes.module';
import { VerificacionComponent } from './verificacion/verificacion.component';
import { VerificadoComponent } from './verificado/verificado.component';
import { CambiarpasswordComponent } from './cambiarpassword/cambiarpassword.component';
import { RegisterClienteComponent } from './register-cliente/register-cliente.component';
import { RegisterUsuarioComponent } from './register-usuario/register-usuario.component';



@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    RecoveryComponent,
    RegisterComponent,
    RegisterClienteComponent,
    RegisterUsuarioComponent,
    // InputEmailComponent,
    // ButtonBackComponent,
    VerificacionComponent,
    VerificadoComponent,
    CambiarpasswordComponent,


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
