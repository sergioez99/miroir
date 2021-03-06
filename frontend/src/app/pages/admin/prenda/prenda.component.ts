import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder,Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
//para mensajes de alerta
import Swal from 'sweetalert2';
//importamos el servicio de la prenda
import {PrendaService} from './../../../services/prenda.service';
@Component({
  selector: 'app-prenda',
  templateUrl: './prenda.component.html',
  styleUrls: ['./prenda.component.css']
})


export class PrendaComponent implements OnInit {


  public formPrenda: FormGroup | null = null;
  tallas:string[] = ['S','M','L','XL'];
  toppingList: string[] = ['S','M', 'L', 'XL'];

  uid;


  archivoASubir :Array<File>;

  constructor(private fb: FormBuilder,
             private prendaService: PrendaService,
             private route: ActivatedRoute ) {  }


  ngOnInit(): void {
    this.formPrenda = this.fb.group({
      talla: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      validar: [true, Validators.required],
      archivo:[null, Validators.required],
      identificador:['', Validators.required]
    })

    // comprobar si en la url viene un 'nuevo' o un identificador
    // si es 'nuevo', lo que hace hasta ahora
    // si es un id, recuperar los datos de esa prenda y meterlos en los inputs
    this.uid = this.route.snapshot.params['uid'];

    console.log('Recuperar uid de la url: ',this.uid);

    // recuperar de la BD los datos de esa prenda

    // meter los datos de la prenda en el formulario

   }

   enviar(){
     if(this.uid == 'nuevo'){
      this.crearPrenda();
     }
   }

   crearPrenda() {

    if (this.formPrenda.valid) {

      this.prendaService.crearPrenda(this.formPrenda.value).then( (res)=>{

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

  cambioArchivo( element ){

    this.archivoASubir = element.target.files;

    console.log(this.archivoASubir);

  }

}
