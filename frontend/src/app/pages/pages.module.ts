import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CarouselModule, WavesModule } from 'angular-bootstrap-md'; //carrusel


import { Probador01Component } from './probador01/probador01.component';
import { HomeComponent } from './home/home.component';
import { BaseLayoutComponent } from '../layouts/base-layout/base-layout.component';
import { PlanesComponent } from './planes/planes.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PerfilAdminComponent } from './perfil/perfil-admin/perfil-admin.component';

import { SidebarModule } from 'ng-sidebar';
import { PerfilClienteComponent } from './perfil/perfil-cliente/perfil-cliente.component';
import { PerfilUsuarioComponent } from './perfil/perfil-usuario/perfil-usuario.component';
import { NotAuthComponent } from './perfil/not-auth/not-auth.component';
import { ElementosComunesModule } from '../commons/elementos-comunes.module';
import { PerfilLayoutComponent } from '../layouts/perfil-layout/perfil-layout.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { ClientesComponent } from './admin/clientes/clientes.component';
import { UsuarioComponent } from './admin/usuario/usuario.component';
import { ClienteComponent } from './admin/cliente/cliente.component';
import { PrendasComponent } from './admin/prendas/prendas.component';
import { PrendaComponent } from './admin/prenda/prenda.component';
import { ActivarCuentaComponent } from './usuario/activar-cuenta/activar-cuenta.component';

@NgModule({
  declarations: [
    BaseLayoutComponent,
    PerfilLayoutComponent,

    Probador01Component,
    HomeComponent,
    PlanesComponent,
    PerfilComponent,
    NotAuthComponent,
    PerfilAdminComponent,
    PerfilClienteComponent,
    PerfilUsuarioComponent,
    UsuariosComponent,
    ClientesComponent,
    UsuarioComponent,
    ClienteComponent,
    PrendasComponent,
    PrendaComponent,
    ActivarCuentaComponent,


  ],
  exports: [
    BaseLayoutComponent,
    PerfilLayoutComponent,
    Probador01Component,
    HomeComponent,

    ReactiveFormsModule,
  ],
  imports: [
    CommonModule,
    RouterModule,
    CarouselModule,
    WavesModule,
    ReactiveFormsModule,

    ElementosComunesModule,

    SidebarModule.forRoot()
  ],
})
export class PagesModule { }
