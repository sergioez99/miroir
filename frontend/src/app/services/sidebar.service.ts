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
    { titulo: 'Crear Datos', icono: 'info', sub: false, url: '/admin/crear-datos'},
    { titulo: 'Cuadros', icono: 'info', sub: false, url: '/admin/cuadro'},
  ];
  menuCliente: sidebarItem[]=[
    { titulo: 'Cuadros', icono: 'history_edu', sub: false, url: '/perfil/cliente/cuadro'},
    { titulo: 'Prendas', icono: 'pages', sub: false, url: '/perfil/cliente/prendas'},
    { titulo: 'Cambiar contraseña', icono: 'history_edu', sub: false, url: '/perfil/contracli'},
    { titulo: 'Clave', icono: 'vpn_key', sub: false, url: '/perfil/cliente/clave'},
    { titulo: 'Ayuda', icono: 'help', sub: false, url: '/perfil/cliente/ayuda'},
  ];
  menuUsuario: sidebarItem[]=[
    { titulo: 'Perfil', icono: 'person', sub: false, url: '/perfil/usuario/'},
    { titulo: 'Cambiar contraseña', icono: 'history_edu', sub: false, url: '/perfil/contra'},
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
