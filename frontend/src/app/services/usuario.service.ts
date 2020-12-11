
// aqui crearemos la conexion con backend para hacer el inicio de sesion, por ejemplo

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginForm } from '../interfaces/login-form.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url = 'http://localhost:3000';

  constructor( private http: HttpClient ) { }

  login( formData: LoginForm) {
    console.log('login desde Usuario.service', formData);

    return this.http.post(this.url+'/api/login', formData);
  }

  register( formData: LoginForm) {
    console.log('registro desde Usuario.service', formData);

    return this.http.post(this.url+'/api/register', formData);
  }
}
