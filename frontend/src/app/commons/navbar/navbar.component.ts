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
  public tipo: string='';
  imagenURL = '';

  // cuando lo construye
  constructor( private authService:    AuthService,
               private usuarioService: UsuarioService) { }



  // cada vez que se muestra por pantalla
  ngOnInit(): void {

    this.tipoDePerfil();

    this.usuarioService.cargarUsuario(this.usuarioService.getID()).subscribe(res =>{
      if(!res['usuarios'].imagen)
        this.imagenURL = `http://localhost:4200/assets/no-photo.png`;
      else
        this.imagenURL = `${environment.base_url}/uploads/` + res['usuarios'].imagen;
      console.log(this.imagenURL);
      document.getElementById('navbar').innerHTML = '<a class="nav-link dropdown-toggle text-muted waves-effect waves-dark prop-pic" id="link-image" routerLink="/home" ng-reflect-router-link="/home" href="/home" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a>'
      var imagen = document.createElement('img');
      imagen.setAttribute("src", this.imagenURL);
      imagen.setAttribute("alt", "user");
      imagen.setAttribute("class", "rounded-circle");
      imagen.setAttribute("width", "31");
      imagen.setAttribute("height", "31");
      document.getElementById('link-image').append(imagen);
      //this.imagenURL += `?token=${this.usuarioService.getToken()}`;
    });
  }

  public cerrarSesion (){
    this.authService.logout();
  }

  public getIsLoged (){
    return this.authService.getIsLogged();
  }

  public tipoDePerfil(){
    console.log(this.usuarioService.getRol());
    if(this.usuarioService.getRol()=='ROL_CLIENTE'){
      this.tipo='cliente';
    }
    if(this.usuarioService.getRol()=='ROL_USUARIO'){
      this.tipo='usuario';
    }
    if(this.usuarioService.getRol()=='ROL_ADMIN'){
      this.tipo='admin';
    }
  }

}
