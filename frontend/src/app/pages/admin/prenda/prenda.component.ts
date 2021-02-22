import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder,Validators } from '@angular/forms';
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


  archivoASubir :Array<File>;

  constructor(private fb: FormBuilder,
             private prendaService: PrendaService ) {  }


  ngOnInit(): void {
    this.formPrenda = this.fb.group({
      talla: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      validar: [true, Validators.required],
      archivo:[null, Validators.required],
      identificador:['', Validators.required]
    })
   }

   crearPrenda() {
     //console.log(this.formPrenda.value);
     //this.archivoASubir.forEach((archivo)=>{
     // console.log(archivo);
   // })

    if (this.formPrenda.valid) {

/*
     this.archivoASubir.forEach((archivo)=>{
       console.log(archivo);
     })

      this.archivoASubir.forEach( (archivo)=>{
      });
       for (var i = 0; i < this.archivoASubir.length; i++) {
        this.formPrenda.append("uploads[]", this.archivoASubir[i], this.archivoASubir[i].name);
      }
      //Envía al servicio al formulario para que este se lo envie al backend con su promesica

     // this.prendaService.cargarPrendas(this.formPrenda.value).then((response) => {

     try{

       if(this.prendaService.cargarPrendas(this.formPrenda.value)){
          //Aquí entramos cuando va todo de luxe
        Swal.fire({
        title: 'Has creado correctamente la prenda!',
        icon: 'success',
        confirmButtonText: 'Aceptar',
            });
         }
      }catch(error){
        Swal.fire({
          title: '¡Error!',
          text: error.error.msg,
          icon: 'error',
          confirmButtonText: 'Volver a intentar',
        });
      };
      */
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

  cambioArchivo( element ){

    this.archivoASubir = element.target.files;

    console.log(this.archivoASubir);

  }

}
