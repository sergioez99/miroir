import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { PrendaService } from '../../../services/prenda.service';
import { Prenda } from '../../../models/prenda.model';
import Swal from 'sweetalert2';

import { } from '../../../services/prenda.service';
import { UsuarioService } from '../../../services/usuario.service';

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

  constructor(private prendaService: PrendaService,
    private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarPrendas(this.ultimaBusqueda);
  }

  cargarPrendas(textoBuscar: string) {
    //debugger



    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.prendaService.cargarPrendas(this.posicionactual, textoBuscar)
      .then(res => {

        //console.log(res['prendas']);

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
          this.listaPrendas = res['prendas'];
          this.totalprendas = res['page'].total;
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
    if (!this.usuarioService.isAdmin()) {
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
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.value) {
        this.prendaService.borrarPrenda(uid)
          .then(resp => {
            this.cargarPrendas(this.ultimaBusqueda);
          }).catch((err) => {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo', });
            //console.warn('error:', err);
          });
      }
    });
  }
}
