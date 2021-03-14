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

  getPass(){
    return this.cliente['password'];
  }

  getToken (){

    if (!this.token) {
      this.token = localStorage.getItem('token');
    }

    return this.token;

  }
  getEmail(){
    return this.cliente['email'];
  }

  getEmpresa() {
    return this.cliente['nombreEmpresa'];
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

  actualizarDatosCliente(formData) :Promise<any>{
    
    return new Promise ( (resolve, reject) => {


      console.log('estamos modificando las medidas del usuario: ', formData);
 
      let form :ClienteForm = {
        rol: formData.rol,
        activo:formData.activo,
        validado:formData.validado,
        id: formData.uid,
        email: formData.email,
        password: formData.password,
        nombreEmpresa:formData.nombreEmpresa,
        nombre: formData.nombre,
        nif: formData.nif,
        telefono: formData.telefono   
      };
 
 
      console.log(form);

      if(form.id!=='nuevo'){
        this.apiService.actualizarDatosClienteCall(this.usuarioService.getToken(), form.id, form).subscribe( (res) => {
 
          this.cliente = res['cliente'];
          resolve(true);
  
        }, (err) =>{
          console.log('el error',err);
          //console.error(err);
          reject(err);
  
        });
      }
      
      else{
        this.apiService.crearClienteCall(this.usuarioService.getToken(), form.id, form).subscribe( (res) => {
 
          
          console.log(res);
  
          this.cliente = res['cliente'];
          resolve(true);
  
        }, (err) =>{
  
          console.error(err);
          reject(err);
  
        });
      }
    });
  }

}
