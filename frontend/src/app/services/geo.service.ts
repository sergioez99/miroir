import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UsuarioService } from './usuario.service';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  constructor( private ApiService: ApiService,
               private UsuarioService: UsuarioService,
               private GeolocationService: GeolocationService,
               private HttpClient: HttpClient ) { }

  getLatLng(){

    return new Promise<[number, number]> ((resolve, reject) => {

      this.GeolocationService.subscribe((res) => {

        resolve([res.coords.latitude, res.coords.longitude]);

      }, (err) =>{

        resolve([0,0]);

      });

    });

  }

  async getCiudad(){

    let coordenadas = await this.getLatLng();

    let respuesta = await this.HttpClient.get('https://api.positionstack.com/v1/reverse?access_key=40dd594d99cd7c88132ba1e6c7bcebeb&query=' + coordenadas[0] + ',' + coordenadas[1] + '&limit=1').toPromise();

    return respuesta['data'][0]['region_code'];

  }

  async guardarDatoGeo(prenda){

    let ciudad = await this.getCiudad();

    if(ciudad == null){

      return false;

    }

    return new Promise ( (resolve, reject) => {
      this.ApiService.registrarGeoCall(this.UsuarioService.getToken(), ciudad, prenda).subscribe((res) => {

        resolve(res);

      }, (err) =>{
        console.error(err);
        reject(err);
      });

    });

  }

  getRegiones(){

    return new Promise ( (resolve, reject) => {
      this.ApiService.getListaRegionesChartCall(this.UsuarioService.getToken()).subscribe( (res) => {

        resolve(res);

      }, (err) =>{
        reject(err);
      });

    });

  }

}
