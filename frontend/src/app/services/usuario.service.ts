
// aqui crearemos la conexion con backend para hacer el inicio de sesion, por ejemplo

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginForm } from '../interfaces/login-form.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url = 'http://localhost:3000';

  private isLogged: boolean;

  constructor( private http: HttpClient ) {
    console.log('hola, soy el constructor de usuario service');
    this.isLogged = false;
  }

  getIsLogged(){
    return this.isLogged;
  }
  setIsLogged(value:boolean) {
    this.isLogged = value;
  }

  login( formData: LoginForm) {
    console.log('login desde Usuario.service: ', formData);

    return this.http.post(this.url+'/api/login', formData);
  }

  register( formData: LoginForm) {
    console.log('registro desde Usuario.service', formData);

    return this.http.post(this.url+'/api/usuarios', formData);
  }

}
