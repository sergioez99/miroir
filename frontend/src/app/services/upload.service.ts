// en este servicio guardaremos los datos del usuario que usaran el resto de componentes.

import { Injectable } from '@angular/core';
//import { PrendaForm } from '../interfaces/prenda-form.interface';
import { ApiService } from './api.service';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
//import { tap, map, catchError } from 'rxjs/operators';
//import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UsuarioService } from './usuario.service';
//import { Usuario } from '../models/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class UploadService{

  private rol :string;
  private token :string;
  private id :string;


  constructor( private apiService :ApiService, private http: HttpClient,private router: Router,
    private usuarioService: UsuarioService) { }


  getToken (){

    let token;

    if (!token) {
      token = this.usuarioService.getToken();
    }
    return token;
  }

  get cabeceras() {
    return {
      headers: {
        'x-token': this.getToken()
            }};
  }

/*
  borrarPrenda( uid: string) {
    if (!uid || uid === null) {uid = 'a'; }
    return this.http.delete(`${environment.base_url}/prendas/${uid}` , this.cabeceras);
  }
  */

  crearArchivo() :Promise<any>{

    let idUsuario = this.usuarioService.getID();


    return new Promise ( (resolve, reject)=>{

      this.apiService.subirArchivosCall(idUsuario, this.usuarioService.getToken()).subscribe(res =>{

        console.log('Respuesta del servidor: ', res);
        resolve(true);

      }, (error)=>{
        console.warn('error respuesta api:; ', error);
        reject(error);
      });
    });
  }
}
