import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
// import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
//para traer la base_URL
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  imagenURL = '';

  // cuando lo construye
  constructor( private authService:    AuthService,
               private usuarioService: UsuarioService) { }



  // cada vez que se muestra por pantalla
  ngOnInit(): void {
    this.usuarioService.cargarUsuario(this.usuarioService.getID()).subscribe(res =>{
      this.imagenURL = `${environment.base_url}/upload/fotoperfil/` + res['usuarios'].imagen || 'no-imagen';
      this.imagenURL += `?token=${this.usuarioService.getToken()}`;
    });
  }

  public cerrarSesion (){
    this.authService.logout();
  }

  public getIsLoged (){
    return this.authService.getIsLogged();
  }

}
