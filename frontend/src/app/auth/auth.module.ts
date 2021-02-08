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
import { VerificationComponent } from './verification/verification.component';



@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    RecoveryComponent,
    RegisterComponent,
    // InputEmailComponent,
    // ButtonBackComponent,
    RegistroempresaComponent,
    VerificationComponent,


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
