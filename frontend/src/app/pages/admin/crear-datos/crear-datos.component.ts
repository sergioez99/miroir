import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CrearDatosService } from '../../../services/crearDatos.service';


@Component({
  selector: 'app-crear-datos',
  templateUrl: './crear-datos.component.html',
  styleUrls: ['./crear-datos.component.css']
})
export class CrearDatosComponent implements OnInit {

  public formCrearUsuarios: FormGroup | null = null;
  public formCrearPrendas: FormGroup | null = null;
  public formCrearClientes: FormGroup | null = null;


  constructor( private fb: FormBuilder,
               private crearDatosService :CrearDatosService

  ) { }

  ngOnInit(): void {
    this.formCrearUsuarios = this.fb.group({
      cantidad: [0, [Validators.required, Validators.min(0)]]
    });
    this.formCrearPrendas = this.fb.group({
      cantidad: [0, [Validators.required, Validators.min(0)]]
    });
    this.formCrearClientes = this.fb.group({
      cantidad: [0, [Validators.required, Validators.min(0)]]
    });
  }

  enviarUsuarios() {
    if (this.formCrearUsuarios.valid) {
      this.crearDatosService.crearDatosUsuarios(this.formCrearUsuarios.value).then((response) => {

        // navegacion en función del tipo de usuario

        console.log('todo ha ido bien en el servicio');

        Swal.fire({
          title: 'Usuarios creados correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });

      }).catch((error) => {

        console.log('el servicio de creacion de datos devuelve error', error);


        Swal.fire({
          title: '¡Error!',
          text: 'Parece que ha habido algun error. Inténtelo más tarde.',
          icon: 'error',
          confirmButtonText: 'Volver',
        });

      });

    }
  }

  enviarClientes() {
    if (this.formCrearClientes.valid) {
      this.crearDatosService.crearDatosClientes(this.formCrearClientes.value).then((response) => {

        // navegacion en función del tipo de usuario

        console.log('todo ha ido bien en el servicio');

        Swal.fire({
          title: 'Clientes creados correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });

      }).catch((error) => {

        console.log('el servicio de creacion de datos devuelve error', error);

        Swal.fire({
          title: '¡Error!',
          text: 'Parece que ha habido algun error. Inténtelo más tarde.',
          icon: 'error',
          confirmButtonText: 'Volver',
        });

      });

    }
  }

  enviarPrendas() {
    if (this.formCrearPrendas.valid) {
      this.crearDatosService.crearDatosPrendas(this.formCrearPrendas.value).then((response) => {

        // navegacion en función del tipo de usuario

        console.log('todo ha ido bien en el servicio');

        Swal.fire({
          title: 'Prendas creados correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });

      }).catch((error) => {

        console.log('el servicio de creacion de datos devuelve error', error);

        Swal.fire({
          title: '¡Error!',
          text: 'Parece que ha habido algun error. Inténtelo más tarde.',
          icon: 'error',
          confirmButtonText: 'Volver',
        });

      });

    }
  }

}
