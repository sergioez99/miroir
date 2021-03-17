import { componentFactoryName } from '@angular/compiler';
import {Component, OnInit} from '@angular/core';
import {UsuarioService} from '../../../services/usuario.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  authUrl= 'token'+this.usuarioService.getToken();
  constructor(private usuarioService: UsuarioService){}

  ngOnInit(): void{

  }

  algo(valor:number){
    console.log('desde dashboard recibo:', valor);
  }
}
