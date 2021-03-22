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

  getTotalUsuarios (){
    return new Promise ( (resolve, reject) => {
      this.apiService.getTotalUsuariosChartCall(this.usuarioService.getToken()).subscribe( (res) => {

        resolve(res['valor']);

      }, (err) =>{
        reject(err);
      });

    });

  }

  getTotalClientes (){
    return new Promise ( (resolve, reject) => {
      this.apiService.getTotalClientesChartCall(this.usuarioService.getToken()).subscribe( (res) => {

        resolve(res['valor']);

      }, (err) =>{
        reject(err);
      });

    });

  }

  getTotalPrendas (){
    return new Promise ( (resolve, reject) => {
      this.apiService.getTotalPrendasChartCall(this.usuarioService.getToken()).subscribe( (res) => {

        resolve(res['valor']);

      }, (err) =>{
        reject(err);
      });

    });

  }


  getAltasFechas(fecha_inicio, fecha_fin){

    return new Promise ( (resolve, reject) => {
      this.apiService.getAltasFechasChartCall(this.usuarioService.getToken(), fecha_inicio, fecha_fin).subscribe( (res) => {

        resolve(res);

      }, (err) =>{
        console.error(err);
        reject(err);
      });

    });
  }

  getAltasHoras(){

    return new Promise ( (resolve, reject) => {
      this.apiService.getAltasHorasChartCall(this.usuarioService.getToken()).subscribe( (res) => {

        resolve(res);

      }, (err) =>{
        console.error(err);
        reject(err);
      });

    });
  }

}
