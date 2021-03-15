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

  constructor( private apiService :ApiService,
               private http: HttpClient,
               private router: Router,
               private usuarioService: UsuarioService) { }


  crearArchivoPrenda(id, archivo: Array<File>) :Promise<any>{

    let tipo = 'prenda';
    return new Promise ( (resolve, reject)=>{

      console.log(archivo);

      for (let i=0; i<archivo.length; i++){

        this.apiService.subirArchivosCall(id, tipo, archivo[i], this.usuarioService.getToken()).subscribe(res =>{

          console.log('Respuesta del servidor: ', res);
          resolve(true);

        }, (error)=>{
          console.warn('error respuesta api:; ', error);
          reject(error);
        });
      }




    });
  }



}
