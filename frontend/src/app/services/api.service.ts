import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginForm } from '../interfaces/login-form.interface';
import { MedidasForm } from '../interfaces/usuario-medidas-form.interface';
import { UsuarioForm } from '../interfaces/usuario-form.interface';
import { RegisterClientForm } from '../interfaces/registro-cliente-form.interface';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = 'http://localhost:3000';

  constructor( private http: HttpClient ) { }

  recuperacionCall(email: string){

    return this.http.get(this.url+'/api/recuperar/'+email );
  }

  cambiarpasswordCall(formData){
    return this.http.post(this.url+'/api/recuperar/cambiarpassword', formData);
  }

  verificationCall( token: string){

    return this.http.get(this.url+'/api/verificacion/verificar/'+token );
  }

  reenviarCall(email: string){

    return this.http.get(this.url+'/api/verificacion/reenviar/'+email);
  }

  registerCall( formData: LoginForm) {
    // console.log('registro desde registerCall', formData);

    return this.http.post(this.url+'/api/usuarios', formData);
  }

  registerClientCall( formData: RegisterClientForm) {
    console.log('registro desde registerClienteCall', formData);

    return this.http.post(this.url+'/api/clientes', formData);
  }

  loginCall( formData: LoginForm) {
    // console.log('login desde loginCall: ', formData);

    return this.http.post(this.url+'/api/login', formData);
  }

  tokenCall (token: string) {

    const headers = new HttpHeaders({
      'x-token': token,
    });

    return this.http.post(this.url + '/api/login/token','',{ headers: headers });
  }

  actualizarMedidasCall (token :string, id :string, formData :UsuarioForm){

    // console.log ('Medidas desde Call: ', formData);

    const headers = new HttpHeaders({
      'x-token': token,
    });

    return this.http.put(this.url + '/api/usuarios/'+id, formData, { headers: headers });
  }

  crearPrendaCall( formData, token) {

    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.post(this.url+'/api/prendas', formData, { headers: headers });
  }

  modificarPrendaCall( id, formData, token) {

    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.put(this.url+'/api/prendas/'+id, formData, { headers: headers });
  }

  borrarPrendaCall( uid: string, token) {
    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.delete(`${environment.base_url}/prendas/${uid}` , { headers: headers });
  }

  getPrendaCall (token:string, desde?:number, textoBusqueda?: string, id?: string) {

    const headers = new HttpHeaders({
      'x-token': token,
    });

    let url = `${environment.base_url}/prendas/?`;

    if (desde) {
      url += `desde=${desde}&`;
    }
    if (textoBusqueda) {
      url += `texto=${textoBusqueda}&`;
    }
    if (id){
      url += `id=${id}`;
    }

    return this.http.get(url ,  { headers: headers });
  }

  crearDatosUsuariosCall( formData, token) {

    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.post(this.url+'/api/datos/usuarios', formData, { headers: headers });
  }

  crearDatosClientesCall( formData, token) {

    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.post(this.url+'/api/datos/clientes', formData, { headers: headers });
  }

  crearDatosPrendasCall( formData, token) {

    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.post(this.url+'/api/datos/prendas', formData, { headers: headers });
  }

  getUsuariosChartCall(token){
    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.get(this.url+'/api/chart/usuarios', { headers: headers });
  }

  getClientesChartCall(token){
    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.get(this.url+'/api/chart/clientes', { headers: headers });
  }

  subirArchivosCall(id, tipo, archivo: File, token){

    const headers = new HttpHeaders({
      'x-token': token,
    });
    const datos: FormData = new FormData();
    datos.append('archivo', archivo, archivo.name);

    console.log(headers);

    return this.http.post(this.url+'/api/upload/'+tipo+'/'+id, datos, { headers: headers });
  }


}
