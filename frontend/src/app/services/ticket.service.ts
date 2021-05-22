import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

/*   token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1ZmQ5MDg4MGE4N2YzOTAzZmM0N2EwZmMiLCJyb2wiOiJST0xfQURNSU4iLCJpYXQiOjE2MDgwNTk5MTksImV4cCI6MTYzOTYxNzUxOX0._HDQ_8hZYCAd2y9UWW7ejIBoGrSAm6dP3aP528NifZE';
  id = '6027f0c61f4bcc08d4f2a114'; */

  ticket = '';

  avatar;
  prenda;
  vertex;
  fragment;


  constructor( private apiService: ApiService,
               private usuarioService: UsuarioService) { }

  obtenerClave(): Promise<any> {

    const token = this.usuarioService.getToken();
    const id = this.usuarioService.getID();

    return new Promise((resolve, reject) => {

      this.apiService.getClienteClaveCall(token, id).subscribe((res) => {

        resolve(res['clave']);

      }, (err) => {

        reject(err);

      });

    });

  }

  cambiarClave(): Promise<any> {

    const token = this.usuarioService.getToken();
    const id = this.usuarioService.getID();

    return new Promise((resolve, reject) => {

      this.apiService.setClienteClaveCall(token, id).subscribe((res) => {

        resolve(res['clave']);

      }, (err) => {

        reject(err);

      });

    });

  }

   obtenerTicket(clave, usuario, prendaID, talla, id?): Promise<any> {
     return new Promise((resolve, reject) => {

      this.apiService.getTicketCall(clave, usuario, prendaID, talla, id).subscribe((res) => {

        this.ticket = res['ticket'];
        resolve(this.ticket);

      }, (err) => {

        reject(err);

      });

    });
  }

  obtenerTicket2(clave, usuario, prendaID, talla, id?): Promise<any> {
    return new Promise((resolve, reject) => {

      this.apiService.getTicketCall(clave, usuario, prendaID, talla, id).subscribe((res) => {
      this.ticket = res['ticket'];
      resolve(this.ticket);

    }, (err) => {

      reject(err);

    });

  });
}

  canjearTicket(ticket): Promise<any> {

    return new Promise((resolve, reject) => {

     this.apiService.validarTicketCall(ticket).subscribe((res) => {

        console.log('respuesta validar ticket: ', res);

        resolve(res);

      }, (err) => {

        reject(err);

      });

    });
  }

  obtenerArchivoTicket(tipo, ticket): Promise<any> {

    return new Promise((resolve, reject) => {


      this.apiService.archivoTicketCall(tipo, ticket).subscribe((res) => {

        if(tipo == 'textura'){
          this.readFile(res).subscribe( (resp)=>{
            resolve(resp);
          });
        }

        // debugger;
        console.log('respuesta conseguir ' + tipo + ': ', res);
        resolve(res);

      }, (err) => {
        console.log(err);

        reject(err);

      });
    });
  }

  obtenerTicketPrevisualizar(prendaID, tallaSeleccionada, usuarioSeleccionado): Promise<any> {

    let cliente, usuario, prenda, talla;

    prenda = prendaID;
    talla = tallaSeleccionada;
    usuario = usuarioSeleccionado;

    return new Promise((resolve, reject) => {

      // obtener la clave del cliente
      this.obtenerClave().then( (res)=>{

        console.log('hemos obtenido la clave: ', res);

        cliente = res;

        this.obtenerTicket(cliente, usuario, prenda, talla, this.usuarioService.getID()).then( (res)=>{
        //this.obtenerTicket().then( (res)=>{

          console.log('hemos obtenido el ticket: ', res);

          resolve(res);

        }).catch( (error)=>{
          console.warn('error con el ticket: ', error);
          reject(error);
        });

      }).catch( (error)=>{
        console.warn('error con la clave: ', error);
        reject(error);
      });


    });

  }


  private readFile(blob): Observable<string> {
    return Observable.create(obs => {
      const reader = new FileReader();

      reader.onerror = err => obs.error(err);
      reader.onabort = err => obs.error(err);
      reader.onload = () => obs.next(reader.result);
      reader.onloadend = () => obs.complete();

      return reader.readAsDataURL(blob);
    });
  }


}
