import { Component, OnInit } from '@angular/core';
// import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // cuando lo construye
  constructor( private authService: AuthService) { }

  // cada vez que se muestra por pantalla
  ngOnInit(): void {
  }

  public cerrarSesion (){
    this.authService.logout();
  }

  public getIsLoged (){
    return this.authService.getIsLogged();
  }

}
