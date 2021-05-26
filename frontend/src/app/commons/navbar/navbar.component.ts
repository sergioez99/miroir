import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
// import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
//para traer la base_URL
import {environment} from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public logeado:boolean = false;
  imagenURL = '';

  // cuando lo construye
  constructor( private authService:    AuthService,
               private usuarioService: UsuarioService,
               private router:         Router) { }



  // cada vez que se muestra por pantalla
  ngOnInit(): void {
  }

  public cerrarSesion (){
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  public getIsLoged (){
    this.logeado = this.authService.getIsLogged();
    return this.logeado;
  }



  clickPerfil(){
    let direccion = '/home';
    if(this.usuarioService.isCliente()){
      direccion = '/perfil/cliente';
    }
    else if(this.usuarioService.isAdmin()){
      direccion = '/admin/perfil';

    }
    else if(this.usuarioService.isUsuario()){
      direccion = '/perfil/usuario';
    }
    this.router.navigate([direccion]);

  }

}
