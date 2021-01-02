import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // cuando lo construye
  constructor( private usuarioService: UsuarioService) { }

  // cada vez que se muestra por pantalla
  ngOnInit(): void {
  }

  public cerrarSesion (){
    this.usuarioService.logout();
  }

  public getIsLoged (){
    return this.usuarioService.getIsLogged();
  }

}
