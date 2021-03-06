import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginForm } from '../interfaces/login-form.interface';
import { MedidasForm } from '../interfaces/usuario-medidas-form.interface';
import { UsuarioForm } from '../interfaces/usuario-form.interface';
import { ClienteForm } from '../interfaces/cliente-form.interface';
import { RegisterClientForm } from '../interfaces/registro-cliente-form.interface';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = 'http://localhost:3000';

  constructor( private http: HttpClient,private fb: FormBuilder) { }

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

  actualizarMedidasUsuariosCall (token :string, id :string, formData :UsuarioForm){

    // console.log ('Medidas desde Call: ', formData);

    const headers = new HttpHeaders({
      'x-token': token,
    });

    return this.http.put(this.url + '/api/usuarios/'+id, formData, { headers: headers });
  }

  crearUsuarioCall (token :string, id :string, formData :UsuarioForm){

     console.log ('crear usuario call', formData);

    const headers = new HttpHeaders({
      'x-token': token,
    });

    return this.http.post(this.url + '/api/usuarios', formData,{ headers: headers });
  }

  actualizarDatosClienteCall (token :string, id :string, formData :ClienteForm){

     console.log ('Datos cliente desde Call: ', formData);

    const headers = new HttpHeaders({
      'x-token': token,
    });
    
    
    return this.http.put(this.url + '/api/clientes/'+id, formData, { headers: headers });
  }

  crearClienteCall (token :string, id :string, formData :ClienteForm){

    console.log ('crear cliente call', formData);

   const headers = new HttpHeaders({
     'x-token': token,
   });

   return this.http.post(this.url + '/api/clientes', formData,{ headers: headers });
 }
}
