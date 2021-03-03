import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginForm } from '../interfaces/login-form.interface';
import { MedidasForm } from '../interfaces/usuario-medidas-form.interface';
import { UsuarioForm } from '../interfaces/usuario-form.interface';
import { RegisterClientForm } from '../interfaces/registro-cliente-form.interface';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = environment.base_url;

  constructor( private http: HttpClient ) { }

  recuperacionCall(email: string){

    return this.http.get(this.url+'/recuperar/'+email );
  }

  cambiarpasswordCall(formData){
    return this.http.post(this.url+'/recuperar/cambiarpassword', formData);
  }

  verificationCall( token: string){

    return this.http.get(this.url+'/verificacion/verificar/'+token );
  }

  reenviarCall(email: string){

    return this.http.get(this.url+'/verificacion/reenviar/'+email);
  }

  registerCall( formData: LoginForm) {
    // console.log('registro desde registerCall', formData);

    return this.http.post(this.url+'/usuarios', formData);
  }

  registerClientCall( formData: RegisterClientForm) {
    console.log('registro desde registerClienteCall', formData);

    return this.http.post(this.url+'/clientes', formData);
  }

  loginCall( formData: LoginForm) {
    // console.log('login desde loginCall: ', formData);

    return this.http.post(this.url+'/login', formData);
  }

  tokenCall (token: string) {

    const headers = new HttpHeaders({
      'x-token': token,
    });

    return this.http.post(this.url + '/login/token','',{ headers: headers });
  }

  actualizarMedidasCall (token :string, id :string, formData :UsuarioForm){

    // console.log ('Medidas desde Call: ', formData);

    const headers = new HttpHeaders({
      'x-token': token,
    });

    return this.http.put(this.url + '/usuarios/'+id, formData, { headers: headers });
  }

  crearPrendaCall( formData, token) {

    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.post(this.url+'/prendas', formData, { headers: headers });
  }

  crearDatosUsuariosCall( formData, token) {

    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.post(this.url+'/datos/usuarios', formData, { headers: headers });
  }

  crearDatosClientesCall( formData, token) {

    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.post(this.url+'/datos/clientes', formData, { headers: headers });
  }

  crearDatosPrendasCall( formData, token) {

    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.post(this.url+'/datos/prendas', formData, { headers: headers });
  }

}
