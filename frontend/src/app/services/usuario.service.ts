
// aqui crearemos la conexion con backend para hacer el inicio de sesion, por ejemplo

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginForm } from '../interfaces/login-form.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService{

  private url = 'http://localhost:3000';

  private isLogged: boolean;

  constructor( private http: HttpClient ) {
    console.log('hola, soy el constructor de usuario service');
    this.isLogged = false;

    this.validarToken().then( () =>{} ).catch( ()=>{} );
  }




  private setIsLogged(value:boolean) {
    this.isLogged = value;
  }

  private registerCall( formData: LoginForm) {
    console.log('registro desde Usuario.service', formData);

    return this.http.post(this.url+'/api/usuarios', formData);
  }
  private loginCall( formData: LoginForm) {
    console.log('login desde Usuario.service: ', formData);

    return this.http.post(this.url+'/api/login', formData);
  }
  private tokenCall (token: string) {

    const headers = new HttpHeaders({
      'x-token': token,
    });

    return this.http.post(this.url + '/api/login/token','',{ headers: headers });
  }

  validarToken () : Promise<any>{

    const key = 'token';
    const token = localStorage.getItem(key);
    console.log('validando token, ', token);

    return new Promise ( (resolve, reject) => {

      if(token != null){

        this.tokenCall(token).subscribe( (res) => {
          // token valido
          console.log(res);
          // guardamos el token actualizado que ha devuelto el backend
          localStorage.setItem(key, res['nuevotoken']);

          this.setIsLogged(true);

          resolve(true);

        }, (err) =>{

          console.log(err);
          // quitamos el token caducado
          localStorage.removeItem(key);

          this.setIsLogged(false);

          reject(err);

        });

      } else {
        reject(false);
      }

    });


  }

  login (formData: LoginForm) : Promise<any>{

    return new Promise( (resolve, reject) => {

      this.loginCall(formData).subscribe(res => {

        console.log('respuesta al subscribe:', res);
        // coger el token y guardarlo en localStorage
        localStorage.setItem('token', res['token']);
        // decir que nos hemos logueado
        this.setIsLogged(true);

        resolve(true);

      }, (err) => {
        this.setIsLogged(false);
        console.warn ('error respuesta api: ', err);
        // mostrar un mensaje de alerta
        reject(err);
      });
    });
  }

  registro (formData:LoginForm) :Promise<any>{

    return new Promise( (resolve, reject) =>{

      this.registerCall(formData).subscribe(res => {

        console.log('Respuesta del servidor: ', res);
        resolve(true);

      }, (err)=> {

        console.warn('error respuesta api:; ', err);
        reject(err);

      });
    });
  }

  logout () {

    localStorage.removeItem('token');
    this.setIsLogged(false);
  }

  getIsLogged(){
    return this.isLogged;
  }




}
