// en este servicio guardaremos los datos del usuario que usaran el resto de componentes.

import { Injectable } from '@angular/core';
import { PrendaForm } from '../interfaces/prenda-form.interface';
import { ApiService } from './api.service';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../models/usuario.model';



@Injectable({
  providedIn: 'root'
})
export class PrendaService{

  constructor( private apiService :ApiService,
               private http: HttpClient,
               private router: Router,
               private usuarioService: UsuarioService) { }


  cargarPrendas( desde?: number, textoBusqueda?: string, id?: string ): Promise<any> {


    return new Promise ( (resolve, reject)=>{

      this.apiService.getPrendaCall(this.usuarioService.getToken(), desde, textoBusqueda, id).subscribe(res =>{

        console.log('Respuesta del servidor: ', res);
        resolve(res);

      }, (error)=>{
        console.warn('error respuesta api:; ', error);
        reject(error);
      });
    });

  }


  borrarPrenda( uid: string) {
    return new Promise ( (resolve, reject)=>{

      this.apiService.borrarPrendaCall( uid, this.usuarioService.getToken()).subscribe(res =>{

        console.log('Respuesta del servidor: ', res);
        resolve(res);

      }, (error)=>{
        console.warn('error respuesta api:; ', error);
        reject(error);
      });
    });
  }

  crearPrenda(formData) :Promise<any>{

    let idCliente = this.usuarioService.getID();
    let form :PrendaForm = {
      identificador : formData.identificador,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      talla: formData.talla,
      idCliente: idCliente,
      visible: formData.visible
    };

    return new Promise ( (resolve, reject)=>{

      this.apiService.crearPrendaCall(form, this.usuarioService.getToken()).subscribe(res =>{

        console.log('Respuesta del servidor: ', res);
        resolve(res);

      }, (error)=>{
        console.warn('error respuesta api:; ', error);
        reject(error);
      });
    });

  }

  modificarPrenda(uid, formData) :Promise<any>{

    let form :PrendaForm = {
      identificador : formData.identificador,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      talla: formData.talla,
      visible: formData.visible,
    };

    if(formData.idCliente != null){
      form.idCliente = formData.idCliente;
    }

    return new Promise ( (resolve, reject)=>{

      this.apiService.modificarPrendaCall(uid, form, this.usuarioService.getToken()).subscribe(res =>{

        console.log('Respuesta del servidor: ', res);
        resolve(res);

      }, (error)=>{
        console.warn('error respuesta api:; ', error);
        reject(error);
      });
    });

  }

}
