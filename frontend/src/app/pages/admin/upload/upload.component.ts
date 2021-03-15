import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder,Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
//para mensajes de alerta
import Swal from 'sweetalert2';
//importamos el servicio de la prenda
import {PrendaService} from './../../../services/prenda.service';

import {UploadService} from './../../../services/upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})


export class UploadComponent implements OnInit {

  uid;


  archivoASubir :Array<File>;

  constructor(private uploadService: UploadService,
              private route: ActivatedRoute ) {  }


  ngOnInit(): void {

    this.uid = this.route.snapshot.params['uid'];
    console.log('Recuperar uid de la url: ',this.uid);

   }

   enviar(){
     if(this.uid == 'nuevo'){
      this.crearArchivo();
     }
   }

   crearArchivo() {

    if (this.uid.valid) {

      this.uploadService.crearArchivo().then( (res)=>{

        Swal.fire({
          title:'Archivo subido correctamente',
          text: 'Archivo subido al sistema de forma correcta',
          icon: 'success',
          showCloseButton: true,
          confirmButtonText: 'Aceptar'
        });

      }).catch( (error)=>{

        console.log(error);

        Swal.fire({
          title:'¡Error!',
          text: error.error.msg,
          icon: 'error',
          showCloseButton: true,
          confirmButtonText: 'Volver a intentar',
          footer: 'Parece que ya tienes una cuenta, <a href="/login">¿Iniciar sesión?</a>'
        });
      });

    }
    else{
      Swal.fire({
        title: '¡Error!',
        text: 'El archivo no se ha subido correctamente',
        icon: 'error',
        confirmButtonText: 'Volver a intentar',
      });
    }

  }

/*   modificarPrenda() {

    if (this.formPrenda.valid) {

      this.prendaService.modificarPrenda(this.formPrenda.value).then( (res)=>{

        Swal.fire({
          title:'Prenda creado correctamente',
          text: 'Le hemos enviado un email de confirmación. <p> Por favor, revise su bendeja de entrada.</p>',
          icon: 'success',
          showCloseButton: true,
          confirmButtonText: 'Aceptar'
        });

      }).catch( (error)=>{

        console.log(error);

        Swal.fire({
          title:'¡Error!',
          text: error.error.msg,
          icon: 'error',
          showCloseButton: true,
          confirmButtonText: 'Volver a intentar',
          footer: 'Parece que ya tienes una cuenta, <a href="/login">¿Iniciar sesión?</a>'
        });
      });

    }
    else{
      Swal.fire({
        title: '¡Error!',
        text: 'El formulario no se ha completado correctamente',
        icon: 'error',
        confirmButtonText: 'Volver a intentar',
      });
    }

  } */
}
