import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginForm } from '../interfaces/login-form.interface';
import { MedidasForm } from '../interfaces/usuario-medidas-form.interface';
import { UsuarioForm } from '../interfaces/usuario-form.interface';
import { RegisterClientForm } from '../interfaces/registro-cliente-form.interface';

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

  getAltasFechasChartCall(token, fecha_inicio, fecha_fin){
    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.get(this.url+'/api/chart/usuarios/'+fecha_inicio+'/'+fecha_fin, { headers: headers });
  }

}
