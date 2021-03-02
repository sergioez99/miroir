import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class CrearDatosService {


  constructor( private apiService :ApiService,
               private usuarioService :UsuarioService ) { }



  crearDatosUsuarios( formData ) :Promise<any>{

    return new Promise ( (resolve, reject) => {

      this.apiService.crearDatosUsuariosCall(formData, this.usuarioService.getToken() ).subscribe(res => {

        console.log('Respuesta de backend al intentar crear un cliente: ', res);
        resolve(true);

      }, (err) =>{
        console.warn('error respuesta api: ', err);
        reject(err);

      });


    });

  }

  crearDatosPrendas( formData ) :Promise<any>{

    return new Promise ( (resolve, reject) => {

      this.apiService.crearDatosPrendasCall(formData, this.usuarioService.getToken() ).subscribe(res => {

        console.log('Respuesta de backend al intentar crear un cliente: ', res);
        resolve(true);

      }, (err) =>{
        console.warn('error respuesta api: ', err);
        reject(err);

      });


    });

  }

  crearDatosClientes( formData ) :Promise<any>{

    return new Promise ( (resolve, reject) => {

      this.apiService.crearDatosClientesCall(formData, this.usuarioService.getToken() ).subscribe(res => {

        console.log('Respuesta de backend al intentar crear un cliente: ', res);
        resolve(true);

      }, (err) =>{
        console.warn('error respuesta api: ', err);
        reject(err);

      });


    });

  }




}
