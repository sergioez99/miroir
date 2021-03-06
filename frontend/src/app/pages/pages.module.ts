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
// import { ActivarCuentaComponent } from './usuario/activar-cuenta/activar-cuenta.component';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { ProgressbarComponent } from '../components/progressbar/progressbar.component';
import { CrearDatosComponent } from './admin/crear-datos/crear-datos.component';
import { CuadroUsuarioComponent } from './admin/cuadro-usuario/cuadro-usuario.component'
import { CambioContraComponent } from './perfil/cambio-contra/cambio-contra.component';
import { CuadroClienteComponent } from './admin/cuadro-cliente/cuadro-cliente.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ClaveClienteComponent } from './perfil/clave-cliente/clave-cliente.component';
import { AyudaClienteComponent } from './admin/ayuda-cliente/ayuda-cliente.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProbadorPruebaComponent } from './probador-prueba/probador-prueba.component';

import { SceneComponent } from '../scene/scene.component';

@NgModule({
  declarations: [
    BaseLayoutComponent,
    PerfilLayoutComponent,

    ProbadorPruebaComponent,
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
    // ActivarCuentaComponent,
    PaginationComponent,
    ProgressbarComponent,
    CrearDatosComponent,
    CuadroUsuarioComponent,
    CambioContraComponent,
    CuadroClienteComponent,
    ClaveClienteComponent,
    AyudaClienteComponent,

    SceneComponent,


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
    Ng2GoogleChartsModule,

    SidebarModule.forRoot(),

    MatExpansionModule
  ],
})
export class PagesModule { }
