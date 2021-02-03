import { Injectable } from '@angular/core';
import { sidebarItem } from '../interfaces/sidebar.interface';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menuAdmin: sidebarItem[] =[
    { titulo: 'Usuarios', icono: 'groups', sub: false, url: '/admin/usuarios'},
    { titulo: 'Clientes', icono: 'airline_seat_recline_normal', sub: false, url: '/admin/clientes'},
    { titulo: 'Prendas', icono: 'pages', sub: false, url: '/admin/prendas'},
  ];
  menuCliente: sidebarItem[]=[
    { titulo: 'Tu Perfil', icono: 'person', sub: false, url: '/perfil/cliente/'},
    { titulo: 'Prendas', icono: 'pages', sub: false, url: '/perfil/cliente/prendas'},
  ];
  menuUsuario: sidebarItem[]=[
    { titulo: 'Perfil', icono: 'person', sub: false, url: '/perfil/usuario/'},
    { titulo: 'Activación de cuenta', icono: 'history_edu', sub: false, url: '/perfil/usuario/activar'},

  ];
  none: sidebarItem[]=[
    { titulo: 'error', icono: 'fa fa-exclamation-triangle', sub: false, url: '/error'}
  ]
  constructor( private usuarioService: UsuarioService) { }

  getmenu() {

    switch (this.usuarioService.getRol()) {
      case 'ROL_ADMIN':
        return this.menuAdmin;
      case 'ROL_CLIENTE':
        return this.menuCliente;
      case 'ROL_USUARIO':
        return this.menuUsuario;
    }

    return this.none;
  }
}
