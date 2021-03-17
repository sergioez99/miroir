import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ClienteService } from '../../../services/cliente.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Cliente } from '../../../models/cliente.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  public loading = true;

  public totalusuarios = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;

  private ultimaBusqueda = '';
  public listaUsuarios: Cliente[] = [];

  constructor( private clienteService: ClienteService,
               private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarClientes(this.ultimaBusqueda);
  }

  cargarClientes( textoBuscar: string ) {
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    console.log("hola");
    this.clienteService.cargarClientes( this.posicionactual, textoBuscar )
      .subscribe( res => {
        // Lo que nos llega lo asignamos a lista clienntes para renderizar la tabla
        // Comprobamos si estamos en una página vacia, si es así entonces retrocedemos una página si se puede

        if (res['clientes'].length === 0) {
          if (this.posicionactual > 0) {
            this.posicionactual = this.posicionactual - this.registrosporpagina;
            if (this.posicionactual < 0) { this.posicionactual = 0};
            this.cargarClientes(this.ultimaBusqueda);
          } else {
            this.listaUsuarios = [];
            this.totalusuarios = 0;
          }
        } else {
          this.listaUsuarios = res['clientes'];
          this.totalusuarios = res['page'].total;
        }
        this.loading = false;
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
      });

  }

  eliminarCliente( uid: string, email: string) {
    // Solo los admin pueden borrar usuarios
    if (this.usuarioService.getRol() !== 'ROL_ADMIN') {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción',});
      return;
    }

    Swal.fire({
      title: 'Eliminar cliente',
      text: `Al eliminar al cliente '${email}' se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
          if (result.value) {
            this.clienteService.borrarCliente(uid)
              .subscribe( resp => {
                this.cargarClientes(this.ultimaBusqueda);
              }
              ,(err) =>{
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
                //console.warn('error:', err);
              })
          }
      });
  }

  cambiarPagina( pagina: number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarClientes(this.ultimaBusqueda);
  }

}
