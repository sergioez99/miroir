import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginForm } from '../interfaces/login-form.interface';
import { MedidasForm } from '../interfaces/usuario-medidas-form.interface';
import { UsuarioForm } from '../interfaces/usuario-form.interface';
import { ClienteForm } from '../interfaces/cliente-form.interface';
import { RegisterClientForm } from '../interfaces/registro-cliente-form.interface';
import { environment } from '../../environments/environment';
import { FormBuilder } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = environment.base_url;

  constructor( private http: HttpClient,private fb: FormBuilder) { }

  recuperacionCall(email: string){

    return this.http.get(this.url+'/recuperar/'+email );
  }

  cargarModelo(nombre: string) {
     return this.http.get(this.url+'/assets/'+nombre);
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

  loginGoogleCall( tokenGoogle) {
    // console.log('login desde loginCall: ', formData);

    return this.http.post(this.url+'/login/google', {token : tokenGoogle});
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

  actualizarMedidasUsuariosCall (token :string, id :string, formData :UsuarioForm){

    // console.log ('Medidas desde Call: ', formData);

    const headers = new HttpHeaders({
      'x-token': token,
    });

    return this.http.put(this.url + '/usuarios/'+id, formData, { headers: headers });
  }

  modificarPrendaCall( id, formData, token) {

    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.put(this.url+'/prendas/'+id, formData, { headers: headers });
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

  crearUsuarioCall (token :string, id :string, formData :UsuarioForm){

     console.log ('crear usuario call', formData);

    const headers = new HttpHeaders({
      'x-token': token,
    });

    return this.http.post(this.url + '/usuarios', formData,{ headers: headers });
  }

  actualizarDatosClienteCall (token :string, id :string, formData :ClienteForm){

     console.log ('Datos cliente desde Call: ', formData);

    const headers = new HttpHeaders({
      'x-token': token,
    });


    return this.http.put(this.url + '/clientes/'+id, formData, { headers: headers });
  }


  // CHARTS
  getAltasFechasChartCall(token, fecha_inicio, fecha_fin){
    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.get(this.url+'/chart/usuarios/'+fecha_inicio+'/'+fecha_fin, { headers: headers });
  }
  getAltasHorasChartCall(token){

    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.get(this.url+'/chart/usuarios/horas', { headers: headers });
  }

  getUsos(token){
    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.get(this.url+'/chart/usos', { headers: headers });
  }

  getUsosCliente(token){
    const headers = new HttpHeaders({
      'id': token,
    });
    return this.http.get(this.url+'/chart/usosCliente', { headers: headers });
  }

  getUsosTallasCliente(token){
    const headers = new HttpHeaders({
      'id': token,
    });
    return this.http.get(this.url+'/chart/tallasCliente', { headers: headers });
  }




  crearClienteCall (token :string, id :string, formData :ClienteForm){

    console.log ('crear cliente call', formData);

   const headers = new HttpHeaders({
     'x-token': token,
   });

   return this.http.post(this.url + '/clientes', formData,{ headers: headers });
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

  getUsuariosChartCall(token){
    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.get(this.url+'/chart/usuarios', { headers: headers });
  }


  getTotalUsuariosChartCall(token){
    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.get(this.url+'/chart/usuarios/total', { headers: headers });
  }
  getTotalClientesChartCall(token){
    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.get(this.url+'/chart/clientes/total', { headers: headers });
  }
  getTotalPrendasChartCall(token){
    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.get(this.url+'/chart/prendas/total', { headers: headers });
  }

  subirArchivosCall(id, tipo, archivo: File, token, talla='XX'){

    const headers = new HttpHeaders({
      'x-token': token,
      'talla': talla
    });
    const datos: FormData = new FormData();
    datos.append('archivo', archivo, archivo.name);

    return this.http.post(this.url+'/upload/'+tipo+'/'+id, datos, { headers: headers });
  }

  // SISTEMA DE TICKETS
  getClienteClaveCall(token :string, id: string){

    const headers = new HttpHeaders({
      'x-token': token,
    });

    return this.http.get(this.url+'/ticket/clave/obtener/'+id, { headers: headers });
  }

  setClienteClaveCall(token :string, id: string){

    const headers = new HttpHeaders({
      'x-token': token,
    });

    return this.http.get(this.url+'/ticket/clave/cambiar/'+id, { headers: headers });
  }

  getTicketCall(cliente: string, usuario: string, prenda: string, talla: string){

    return this.http.get(this.url + '/ticket/obtener/' + '?email=' + usuario + '&identificador=' + prenda + '&clave=' + cliente + '&talla='+talla);
  }

  validarTicketCall(ticket: string){

    return this.http.get(this.url + '/ticket/validar/' + ticket);
  }

  archivoTicketCall(tipo: string, ticket: string){
    switch(tipo){
      case 'avatar':
      case 'prenda':
        return this.http.get(this.url + '/ticket/modelo/' + tipo + '/' + ticket);
        break;
      case 'vertexShader':
        return this.http.get(this.url + '/ticket/modelo/' + tipo + '/' + ticket, { responseType: 'text' });
        break;
      case 'fragmentShader':
        return this.http.get(this.url + '/ticket/modelo/' + tipo + '/' + ticket, { responseType: 'text' });
        break;
      case 'textura':
        return this.http.get(this.url + '/ticket/modelo/' + tipo + '/' + ticket, { responseType: 'blob' });
        break;
      default:
        return null;
        break;
    }
  }

  getListaRegionesChartCall(token){
    const headers = new HttpHeaders({
      'x-token': token,
    });
    return this.http.get(this.url+'/chart/mapa', { headers: headers });
  }

  registrarGeoCall(token, ciudad, prenda){
    const headers = new HttpHeaders({
      'x-token': token,
    });

    const datos: FormData = new FormData();
    datos.append('ciudad', ciudad);
    datos.append('prenda', prenda);

    return this.http.post(this.url+'/chart/mapa', datos, { headers: headers });
  }

}
