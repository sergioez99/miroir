import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { PrendaService } from '../../../services/prenda.service';
import { Prenda } from '../../../models/prenda.model';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../services/usuario.service';

import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../../services/ticket.service';

@Component({
  selector: 'app-prendas',
  templateUrl: './prendas.component.html',
  styleUrls: ['./prendas.component.css']
})
export class PrendasComponent implements OnInit {

  public loading = true;

  public totalprendas = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;

  private ultimaBusqueda = '';
  public listaPrendas: Prenda[] = [];
  public prendasFlitradas: Prenda[] = []; //para filtrar por cliente

  private uid: string = '';

  public admin = false;
  public ruta = "['/perfil/cliente/prendas/prenda', prenda.uid]";

  constructor(private prendaService: PrendaService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private ticketService: TicketService) { }

  ngOnInit(): void {

    this.admin = this.usuarioService.isAdmin();

    this.cargarPrendas(this.ultimaBusqueda);
    this.uid = this.usuarioService.getID();
  }

  cargarPrendas(textoBuscar: string) {

    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.prendaService.cargarPrendas(this.posicionactual, textoBuscar)
      .then(res => {

        console.log(res['prendas']);

        // Lo que nos llega lo asignamos a lista de prendas para renderizar la tabla
        // Comprobamos si estamos en un apágina vacia, si es así entonces retrocedemos una página si se puede
        if (res['prendas'].length === 0) {

          if (this.posicionactual > 0) {
            this.posicionactual = this.posicionactual - this.registrosporpagina;
            if (this.posicionactual < 0) { this.posicionactual = 0 };
            this.cargarPrendas(this.ultimaBusqueda);
          } else {
            this.listaPrendas = [];
            this.totalprendas = 0;
          }
        } else {

          if (this.usuarioService.isCliente()) {
            for (let i = 0; i < res['prendas'].length; i++) {
              if (res['prendas'][i].idCliente == this.uid) {
                this.prendasFlitradas.push(res['prendas'][i]);
              }
            }
            this.listaPrendas = this.prendasFlitradas;
            this.totalprendas = this.listaPrendas.length;
          } else {
            this.listaPrendas = res['prendas'];
            this.totalprendas = res['page'].total;
          }


        }
        this.loading = false;

      }).catch((err) => {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo', });
        //console.warn('error:', err);
        this.loading = false;
      });

  }

  cambiarPagina(pagina: number) {
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >= 0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarPrendas(this.ultimaBusqueda);
  }

  eliminarPrenda(uid: string, email: string) {
    /*
    // Comprobar que no me borro a mi mismo
    if (uid === this.prendaService.getID()) {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No puedes eliminar tu propio prenda',});
      return;
    }
    */
    // Solo los admin pueden borrar prendas
    if (this.usuarioService.isUsuario()) {
      Swal.fire({ icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción', });
      return;
    }

    Swal.fire({
      title: 'Eliminar prenda',
      text: `Al eliminar al prenda '${uid}' se perderá su información. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then((result) => {
      if (result.value) {
        this.prendaService.borrarPrenda(uid)
          .then(resp => {
            Swal.fire({ icon: 'success', title: 'Prenda eliminada' });
            this.cargarPrendas(this.ultimaBusqueda);
          }).catch((err) => {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo', });
            //console.warn('error:', err);
          });
      }
    });
  }

  crearTicket(prendaID, prendaTalla) {

    console.log('crearTicket');

    console.log('recibido en la función: ', prendaID);

    let cliente = '';
    let usuario = '';
    let prenda = prendaID;
    let talla = '';

    let variable = Swal.fire({
      title: '¿Cómo deseas visualizar la prenda?',
      icon: 'question',
      input: 'select',
      inputOptions: {
        Tallas: prendaTalla,
      },
      inputPlaceholder: 'Selecciona la talla',
      inputValidator: (value) => {
        return new Promise((resolve, reject) => {
          if (value) {
            console.log('valor seleccionado: ', value);
            console.log('valor seleccionado: ', prendaTalla[value]);
            resolve(null);
          } else {
            reject('sin seleccionar');
          }
        })
      },
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Volver a modificar'
    }).then( (result) => {
      console.log(result);
      if (result.isConfirmed) {
        talla = prendaTalla[result.value];
        this.obtenerTicketPrevisualizar(prenda, talla);
      }
    });

  }

  obtenerTicketPrevisualizar(prenda, talla) {

    // let usuario = 'usuario12@usuario.com';
    let usuario = 'sergi@gmail.com';

    this.ticketService.obtenerTicketPrevisualizar(prenda, talla, usuario).then((res) => {

      // abrir en una pestaña nueva
      let url = environment.url_front + '/scene/' + res;
      console.log('url del probador: ', url);
      window.open(url, "_blank");

    }).catch((error) => {
      console.warn('error con la creación de ticket de previsualización: ', error);
    });
  }
}
