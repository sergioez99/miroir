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



@Injectable({
  providedIn: 'root'
})
export class PrendaService{

  private rol :string;
  private token :string;
  private id :string;

  private prenda;


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

  cargarPrendas( desde: number, textoBusqueda?: string ): Observable<object> {


    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/prendas/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }


  borrarPrenda( uid: string) {
    if (!uid || uid === null) {uid = 'a'; }
    return this.http.delete(`${environment.base_url}/prendas/${uid}` , this.cabeceras);
  }

  crearPrenda(formData) :Promise<any>{

    let form :PrendaForm = {
      identificador : formData.identificador,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      talla: formData.talla,
      objeto: formData.objeto,
    };

    return new Promise ( (resolve, reject)=>{

      this.apiService.crearPrendaCall(form, this.usuarioService.getToken()).subscribe(res =>{

        console.log('Respuesta del servidor: ', res);
        resolve(true);

      }, (error)=>{
        console.warn('error respuesta api:; ', error);
        reject(error);
      });
    });

  }

}
