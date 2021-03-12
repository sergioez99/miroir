// en este servicio guardaremos los datos del usuario que usaran el resto de componentes.

import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UsuarioService } from './usuario.service';


@Injectable({
  providedIn: 'root'
})
export class ChartService{



  constructor( private apiService :ApiService,
               private usuarioService :UsuarioService) {


  }

  getAltasFechas(fecha_inicio, fecha_fin){

    return new Promise ( (resolve, reject) => {
      this.apiService.getAltasFechasChartCall(this.usuarioService.getToken(), fecha_inicio, fecha_fin).subscribe( (res) => {

        console.log(res);
        resolve(res);

      }, (err) =>{
        console.error(err);
        reject(err);
      });

    });
  }

  getUsuarios (){

    return new Promise ( (resolve, reject) => {
      this.apiService.getUsuariosChartCall(this.usuarioService.getToken()).subscribe( (res) => {

        console.log(res);
        resolve(res);

      }, (err) =>{
        console.error(err);
        reject(err);
      });

    });
  }
  getClientes (){

    return new Promise ( (resolve, reject) => {
      this.apiService.getClientesChartCall(this.usuarioService.getToken()).subscribe( (res) => {

        console.log(res);
        resolve(res);

      }, (err) =>{
        console.error(err);
        reject(err);
      });

    });
  }

}
