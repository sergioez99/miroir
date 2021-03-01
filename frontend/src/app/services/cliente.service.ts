import { Injectable, SystemJsNgModuleLoader } from '@angular/core';
import { ClienteForm } from '../interfaces/cliente-form.interface';
import { ApiService } from './api.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private token :string;

  private cliente;

  constructor( private apiService :ApiService,
               private http: HttpClient,
               private router: Router,
               private usuarioService :UsuarioService) { }

  inicializar (clienteRecibido, tokenRecibido? :string){

    // introducir los valores del usuario logueado
    this.cliente = clienteRecibido;

    if (tokenRecibido){
      this.actualizarToken(tokenRecibido);
    }

  }

  actualizarToken (tokenRecibido: string){

    this.token = tokenRecibido;

    if(localStorage.getItem('token')){
      localStorage.setItem('token', this.token);
    }

  }

  getID (){
    return this.cliente['uid'];
  }


  getToken (){

    if (!this.token) {
      this.token = localStorage.getItem('token');
    }

    return this.token;

  }

  getEmpresa() {
    return this.cliente['empresa'];
  }
  getNombre() {
    return this.cliente['nombre'];
  }
  getNIF() {
    return this.cliente['nif'];
  }
  getTelefono() {
    return this.cliente['telefono'];
  }

  get cabeceras() {
    return {
      headers: {
        'x-token': this.token
      }};
  }

  cargarClientes( desde: number, textoBusqueda?: string ): Observable<object> {

    const headers = new HttpHeaders({
      'x-token': this.usuarioService.getToken(),
    });
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/clientes/?desde=${desde}&texto=${textoBusqueda}`, { headers: headers });
  }

  borrarCliente( uid: string) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.getToken(),
    });
    if (!uid || uid === null) {uid = 'a'; }
    return this.http.delete(`${environment.base_url}/clientes/${uid}`, { headers: headers });
  }

  cargarCli( uid: string) {

    const headers = new HttpHeaders({
      'x-token': this.usuarioService.getToken(),
    });
    console.log('entra en el servicio');
    return this.http.get(`${environment.base_url}/clientes/?id=${uid}` , { headers: headers });
  }

}
