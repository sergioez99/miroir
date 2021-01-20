import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LoginForm } from '../interfaces/login-form.interface';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLogged: boolean;

  constructor( private apiService: ApiService,
               private usuarioService :UsuarioService ) {

    console.log('hola, soy el constructor de auth service');
    this.isLogged = false;

    this.validarToken().then( () =>{} ).catch( ()=>{} );
   }


  validarToken () : Promise<any>{

    const key = 'token';
    const token = this.usuarioService.getToken();
    console.log('validando token, ', token);

    return new Promise ( (resolve, reject) => {

      if(token != null){

        this.apiService.tokenCall(token).subscribe( (res) => {
          // token valido
          console.log(res);

          this.usuarioService.inicializar(res['usuario'], token);
          this.setIsLogged(true);

          resolve(true);

        }, (err) =>{

          console.error(err);
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

      this.apiService.loginCall(formData).subscribe(res => {

        console.log('respuesta al subscribe:', res);

        console.log('ahora no va... ', formData);
        // decir que nos hemos logueado
        this.usuarioService.inicializar(res['usuario'], res['token']);
        this.usuarioService.login(formData.remember);
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

      this.apiService.registerCall(formData).subscribe(res => {

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
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    this.setIsLogged(false);
  }

  getIsLogged(){
    return this.isLogged;
  }

  private setIsLogged(value:boolean) {
    this.isLogged = value;
  }
}
