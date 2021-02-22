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

  private rol_admin = 'ROL_ADMIN';
  private rol_cliente = 'ROL_CLIENTE';
  private rol_usuario = 'ROL_USUARIO';

  constructor( private apiService :ApiService, private http: HttpClient,private router: Router,
    private usuarioService: UsuarioService) { }


  inicializar (prendaRecibido, tokenRecibido? :string){

    // introducir los valores del usuario logueado
    this.prenda = prendaRecibido;

    this.rol = this.prenda['rol'];
    this.id = this.prenda['uid'];

    if (tokenRecibido){
      this.actualizarToken(tokenRecibido);
    }

  }


  actualizarToken (tokenRecibido: string){

    this.token = tokenRecibido;

    if(localStorage.getItem('token')){
      localStorage.setItem('token', this.token);
    }

  }

  actualizarMedidas(formData) :Promise<any>{

    return new Promise ( (resolve, reject) => {

     console.log('estamos modificando la informacion de la prenda: ', formData);

     let form :PrendaForm = {
       id: this.prenda['uid'],
       nombre: formData.nombre,
       descripcion: formData.descripcion,
       talla: formData.talla,
       valido: formData.valido,

     };

     console.log(form);

     this.apiService.actualizarMedidasCall(this.token, this.id, formData).subscribe( (res) => {

        // medidas modificadas correctamente
        console.log(res);

        this.prenda = res['prenda'];
        resolve(true);

      }, (err) =>{

        console.error(err);
        reject(err);

      });


    });



  }

  getID (){
    return this.prenda['uid'];
  }

  getRol (){
    return this.rol;
  }

  isAdmin (){
    return this.rol == this.rol_admin;
  }
  isCliente (){
    return this.rol == this.rol_cliente;
  }
  isPrenda (){
    return this.rol == this.rol_usuario;
  }

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
   // debugger
   //console.log("valor: "+desde + "texto busqueda es: "+textoBusqueda);



    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/prendas/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }


  borrarPrenda( uid: string) {
    if (!uid || uid === null) {uid = 'a'; }
    return this.http.delete(`${environment.base_url}/prendas/${uid}` , this.cabeceras);
  }

}
