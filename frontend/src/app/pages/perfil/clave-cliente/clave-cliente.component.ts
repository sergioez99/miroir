import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../../services/ticket.service';
//para mensajes de alerta
import Swal from 'sweetalert2';
// para copiar en el portapapeles
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-clave-cliente',
  templateUrl: './clave-cliente.component.html',
  styleUrls: ['./clave-cliente.component.css']
})
export class ClaveClienteComponent implements OnInit {

  public clave = null;
  public hide = true;

  constructor( private ticketService: TicketService,
               private clipboard: Clipboard,
               private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  obtenerClave() {

    this.ticketService.obtenerClave().then((res) => {

      this.clave = res;
      console.log(res);

    }).catch((error) => {

      console.log('error cargando la clave');
      console.log(error);

    });

  }

  cambiarClave() {

    Swal.fire({
      title: 'Cambiar clave',
      text: 'Si cambia la clave, la anterior dejará de ser funcional, ¿desea continuar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.ticketService.cambiarClave().then((res) => {

          this.clave = res;
          console.log(res);

          Swal.fire({
            title: 'Clave cambiada correctamente',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
          });

        }).catch((error) => {

          console.log('error cambiando la clave');
          console.log(error);

          /* Swal.fire({
            title: 'Ha habido algún problema, intentelo de nuevo.',
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Volver'
          }); */

        });


      }
    });

  }

  copiarClave() {
    // Se copia el texto del input al portapapeles
    this.clipboard.copy(this.clave);

    // Se muestra un snackbar durante 2 segundos en la parte inferior
    let snackBarRef = this.snackBar.open('¡Felicidades!','Clave copiada con éxito',{
      duration: 20000,
      verticalPosition: 'top'
    });
  }


}
