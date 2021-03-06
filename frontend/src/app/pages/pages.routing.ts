import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { Probador01Component } from './probador01/probador01.component';
import { HomeComponent } from './home/home.component';
import { BaseLayoutComponent } from '../layouts/base-layout/base-layout.component';
import { PlanesComponent } from './planes/planes.component';
import { PerfilAdminComponent } from './perfil/perfil-admin/perfil-admin.component';
import { PerfilClienteComponent } from './perfil/perfil-cliente/perfil-cliente.component';
import { PerfilUsuarioComponent } from './perfil/perfil-usuario/perfil-usuario.component';
import { NotAuthComponent } from './perfil/not-auth/not-auth.component';
import { PerfilGuard } from '../services/guards/perfil.guard';
import { PerfilLayoutComponent } from '../layouts/perfil-layout/perfil-layout.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { UsuarioComponent } from './admin/usuario/usuario.component';
import { PrendasComponent } from './admin/prendas/prendas.component';
import { PrendaComponent } from './admin/prenda/prenda.component';
import { ClientesComponent } from './admin/clientes/clientes.component';
import { ClienteComponent } from './admin/cliente/cliente.component';
import { ClienteGuard } from '../services/guards/cliente.guard';
import { UsuarioGuard } from '../services/guards/usuario.guard';
import { AdminGuard } from '../services/guards/admin.guard';
import { CrearDatosComponent } from './admin/crear-datos/crear-datos.component';
import { CuadroUsuarioComponent } from './admin/cuadro-usuario/cuadro-usuario.component';
import { CuadroClienteComponent } from './admin/cuadro-cliente/cuadro-cliente.component';
import { CambioContraComponent } from './perfil/cambio-contra/cambio-contra.component';
import { TicketComponent } from '../ticket/ticket.component';
import { ClaveClienteComponent } from './perfil/clave-cliente/clave-cliente.component';
import { AyudaClienteComponent } from './admin/ayuda-cliente/ayuda-cliente.component';
import { SceneComponent } from '../scene/scene.component';


const routes: Routes = [

  {
    path: 'probador', component: BaseLayoutComponent,
    children: [
      { path: '', component: Probador01Component },
      { path: '**', redirectTo: ''}
    ]
  },
  {
    path: 'home', component: BaseLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: '**', redirectTo: ''}
    ]
  },
  {
    path: 'planes', component: BaseLayoutComponent,
    children: [
      { path: '', component: PlanesComponent },
      { path: '**', redirectTo: ''}
    ]
  },


  {
    path: 'perfil', component: PerfilLayoutComponent, canActivate: [ PerfilGuard ], canActivateChild: [ PerfilGuard ],
    children: [
      { path: '', component: NotAuthComponent },
      { path:'cliente', canActivate: [ ClienteGuard ], canActivateChild: [ ClienteGuard ],
        children: [
          { path:'prendas', component: PrendasComponent },
          { path:'prendas/prenda/:uid', component: PrendaComponent },
          { path:'clave', component: ClaveClienteComponent },
          { path:'ayuda', component: AyudaClienteComponent },
          { path:'cuadro', component: CuadroClienteComponent },
          { path: '**', redirectTo:'cuadro' }
        ]
      },
      { path:'usuario', canActivate: [ UsuarioGuard ], canActivateChild: [ UsuarioGuard ],
        children: [
          { path: '', component: PerfilUsuarioComponent }
        ]
      },
      { path:'contra', canActivate: [ UsuarioGuard ], canActivateChild: [ UsuarioGuard ],
        children: [
          { path: '', component: CambioContraComponent }
        ]
      },
      { path:'contracli', canActivate: [ ClienteGuard ], canActivateChild: [ ClienteGuard ],
        children: [
          { path: '', component: CambioContraComponent }
        ]
      },

      { path: '**', redirectTo: ''}
    ]
  },





  { path:'admin', component: PerfilLayoutComponent, canActivate: [ AdminGuard ], canActivateChild: [ AdminGuard ],
    children:[
      //{ path: '', component: NotAuthComponent },
      { path:'usuarios', component: UsuariosComponent },
      { path:'usuarios/usuario/:uid', component: UsuarioComponent },
      { path:'prendas', component: PrendasComponent },
      { path:'prendas/prenda/:uid', component: PrendaComponent },
      { path:'clientes', component: ClientesComponent },
      { path:'clientes/cliente/:uid', component: ClienteComponent },
      { path:'crear-datos', component: CrearDatosComponent },
      { path: 'cuadro', component: CuadroUsuarioComponent },
      { path:'perfil', component: PerfilUsuarioComponent },//added, not working
      { path: '**', redirectTo: 'cuadro' }
    ]
  },

  {
    path: 'scene',
    children: [
      { path: '', component: SceneComponent },
      { path: ':ticket', component: SceneComponent },
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
export class PagesRoutingModule { }
