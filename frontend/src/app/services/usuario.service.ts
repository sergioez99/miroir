// en este servicio guardaremos los datos del usuario que usaran el resto de componentes.

import { Injectable } from '@angular/core';
import { UsuarioForm } from '../interfaces/usuario-form.interface';
import { ApiService } from './api.service';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class UsuarioService{

  private rol :string;
  private token :string;
  private id :string;
  private email :string;

  private usuario;

  private rol_admin = 'ROL_ADMIN';
  private rol_cliente = 'ROL_CLIENTE';
  private rol_usuario = 'ROL_USUARIO';

  constructor( private apiService :ApiService, private http: HttpClient,private router: Router) { }

  login(guardar :boolean) {

    if (guardar) {
      localStorage.setItem('rol', this.rol);
      localStorage.setItem('usuario', this.usuario['uid']);
      localStorage.setItem('token', this.token);
    }
  }

  inicializar (usuarioRecibido, tokenRecibido? :string){

    // introducir los valores del usuario logueado
    this.usuario = usuarioRecibido;

    this.rol = this.usuario['rol'];
    this.id = this.usuario['uid'];

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


     console.log('estamos modificando las medidas del usuario: ', formData);

     let form :UsuarioForm = {
       email: this.usuario['email'],
       password:this.usuario['password'],//ATENCION
       id: this.usuario['uid'],
       altura: formData.altura,
       peso: formData.peso,
       pecho: formData.pecho,
       cintura: formData.cintura,
       cadera: formData.cadera
     };


     console.log(form);

     this.apiService.actualizarMedidasCall(this.token, this.id, form).subscribe( (res) => {

        // medidas modificadas correctamente
        console.log(res);

        this.usuario = res['usuario'];
        resolve(true);

      }, (err) =>{

        console.error(err);
        reject(err);

      });


    });



  }

  getID (){
    return this.usuario['uid'];
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
  isUsuario (){
    return this.rol == this.rol_usuario;
  }


  getToken (){

    if (!this.token) {
      this.token = localStorage.getItem('token');
    }

    return this.token;


  }

  getPeso() {
    return this.usuario['peso'];
  }
  getAltura() {
    return this.usuario['altura'];
  }
  getPecho() {
    return this.usuario['pecho'];
  }
  getCintura() {
    return this.usuario['cintura'];
  }
  getCadera() {
    return this.usuario['cadera'];
  }

  get cabeceras() {
    return {
      headers: {
        'x-token': this.token
      }};
  }

  cargarUsuarios( desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/usuarios/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }

  borrarUsuario( uid: string) {
    if (!uid || uid === null) {uid = 'a'; }
    return this.http.delete(`${environment.base_url}/usuarios/${uid}` , this.cabeceras);
  }

  cargarUsu( uid: string) {
    return this.http.get(`${environment.base_url}/usuarios/?id=${uid}` , this.cabeceras);
  }

  actualizarMedidasUsuario(formData) :Promise<any>{
    
    return new Promise ( (resolve, reject) => {


      console.log('estamos modificando las medidas del usuario: ', formData);
 
      let form :UsuarioForm = {
        //email: this.usuario['email'],
        //id: this.usuario['uid'],
        email: formData.email,
        password: formData.password,
        id: formData.uid,
        altura: formData.altura,
        peso: formData.peso,
        pecho: formData.pecho,
        cintura: formData.cintura,
        cadera: formData.cadera
      };
 
 
      console.log(form);

      if(form.id!=='nuevo'){
        this.apiService.actualizarMedidasUsuariosCall(this.token, form.id, form).subscribe( (res) => {
 
          // medidas modificadas correctamente
          console.log(res);
  
          this.usuario = res['usuario'];
          resolve(true);
  
        }, (err) =>{
  
          console.error(err);
          reject(err);
  
        });
      }
      else{
        this.apiService.crearUsuarioCall(this.token, form.id, form).subscribe( (res) => {
 
          // medidas modificadas correctamente
          console.log(res);
  
          this.usuario = res['usuario'];
          resolve(true);
  
        }, (err) =>{
  
          console.error(err);
          reject(err);
  
        });
      }
    });
  }


  getEmail(){
    return this.email;
  }
  setEmail(nuevo :string) {
    this.email = nuevo;
  }

}
