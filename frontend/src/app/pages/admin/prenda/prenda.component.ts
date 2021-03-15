import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
//para mensajes de alerta
import Swal from 'sweetalert2';
//importamos el servicio de la prenda
import { PrendaService } from './../../../services/prenda.service';
import { UploadService } from '../../../services/upload.service';
import { UsuarioService } from '../../../services/usuario.service';
@Component({
  selector: 'app-prenda',
  templateUrl: './prenda.component.html',
  styleUrls: ['./prenda.component.css']
})


export class PrendaComponent implements OnInit {


  public formPrenda: FormGroup | null = null;
  tallas: string[] = ['XS', 'S', 'M', 'L', 'XL'];
  toppingList: string[] = ['XS', 'S', 'M', 'L', 'XL'];

  uid;


  archivoASubir: Array<File>;

  constructor(private fb: FormBuilder,
    private prendaService: PrendaService,
    private usuarioService: UsuarioService,
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private router: Router,) { }


  ngOnInit(): void {
    this.uid = this.route.snapshot.params['uid'];

    console.log('uid undefined???: ', this.uid);

    let talla = '';
    let nombre = '';
    let descripcion = '';
    let visible = true;
    let archivo = null;
    let identificador = '';
    let idCliente = this.usuarioService.getID();


    if (this.uid != 'nuevo') {

      // recuperar de la BD los datos de esa prenda

      this.prendaService.cargarPrendas(null, null, this.uid).then((res) => {

        console.log('respuesta al buscar la prenda por id:', res['prendas']);

        const prenda = res['prendas'];

        talla = prenda['talla'];
        nombre = prenda['nombre'];
        descripcion = prenda['descripcion'];
        visible = prenda['visible'];
        archivo = prenda['archivo'];
        identificador = prenda['identificador'];
        idCliente = prenda['idCliente'];

        console.log('no muestra los datos de la prenda: ', talla);

      }).catch(error => {
        Swal.fire({
          title: 'Ha habido un error recuperando los datos de la prenda',
          icon: 'error',
          showCloseButton: true,
          confirmButtonText: 'Aceptar'
        });

      }).finally(() => {
        this.formPrenda = this.fb.group({
          talla: [talla, Validators.required],
          nombre: [nombre, Validators.required],
          descripcion: [descripcion, Validators.required],
          visible: [visible, Validators.required],
          archivo: [archivo],
          identificador: [identificador, Validators.required],
          idCliente: [idCliente],
        });
      });
    }
    else {
      this.formPrenda = this.fb.group({
        talla: [talla, Validators.required],
        nombre: [nombre, Validators.required],
        descripcion: [descripcion, Validators.required],
        visible: [visible, Validators.required],
        archivo: [archivo],
        identificador: [identificador, Validators.required],
        idCliente: [idCliente],
      });
    }

  }

  enviar() {

    console.log('de donde saca el idCliente? ', this.formPrenda);
    console.log('sera el mismo?, ', this.usuarioService.getID());
    if (this.uid == 'nuevo') {
      this.crearPrenda();
    }
    else {
      this.modificarPrenda();
    }
  }

  crearPrenda() {

    if (this.formPrenda.valid) {

      this.prendaService.crearPrenda(this.formPrenda.value).then((res) => {

        console.log('buscando id de la prenda: ', res['prenda'].uid);

        // guardar archivo de la prenda
        this.uploadService.crearArchivoPrenda(res['prenda'].uid, this.archivoASubir).then( (res) => {

          console.log('hola holita: ', res);

          Swal.fire({
            title: 'Prenda creada correctamente',
            icon: 'success',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: 'Crear una nueva',
            cancelButtonText: 'Volver'
          }).then(res => {

            if (res.isConfirmed) {
              console.log('aceptar, vaciar el formulario y volver a crear');

              let talla = '';
              let nombre = '';
              let descripcion = '';
              let visible = true;
              let archivo = null;
              let identificador = '';
              let idCliente = this.usuarioService.getID();

              this.formPrenda = this.fb.group({
                talla: [talla, Validators.required],
                nombre: [nombre, Validators.required],
                descripcion: [descripcion, Validators.required],
                visible: [visible, Validators.required],
                archivo: [archivo],
                identificador: [identificador, Validators.required],
                idCliente: [idCliente],
              });
            }
            else {
              this.router.navigateByUrl('/admin/prendas');
            }

          });

        }).catch ( (error) =>{
          console.log(error);
          Swal.fire({
            title: 'Error cargando el archivo',
            text: error.error.msg,
            icon: 'error',
            showCloseButton: true,
            confirmButtonText: 'Volver a intentar',
            footer: 'Parece que ha habido un error, intentelo de nuevo'
          });
        });



      }).catch((error) => {

        console.log(error);

        Swal.fire({
          title: '¡Error!',
          text: error.error.msg,
          icon: 'error',
          showCloseButton: true,
          confirmButtonText: 'Volver a intentar',
          footer: 'Parece que ha habido un error, intentelo de nuevo'
        });
      });

    }
    else {
      Swal.fire({
        title: '¡Error!',
        text: 'El formulario no se ha completado correctamente',
        icon: 'error',
        confirmButtonText: 'Volver a intentar',
      });
    }

  }

  modificarPrenda() {

    console.log('formulario no validado', this.formPrenda);

    if (this.formPrenda.valid) {

      this.prendaService.modificarPrenda(this.uid, this.formPrenda.value).then((res) => {

        console.log('como que undefined: ', res);

        // guardar archivo de la prenda
        this.uploadService.crearArchivoPrenda(res['prenda'].uid, this.archivoASubir).then( (res) => {

          console.log('hola holita: ', res);

          Swal.fire({
            title: 'Prenda creada correctamente',
            icon: 'success',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Volver a modificar'
          }).then(res => {

            if (res.isDismissed) {
              console.log('aceptar, volver a la lista');
            }
            else {
              this.router.navigateByUrl('/admin/prendas');
            }

          });

        }).catch ( (error) =>{
          console.log(error);
          Swal.fire({
            title: 'Error cargando el archivo',
            text: error.error.msg,
            icon: 'error',
            showCloseButton: true,
            confirmButtonText: 'Volver a intentar',
            footer: 'Parece que ha habido un error, intentelo de nuevo'
          });
        });



      }).catch((error) => {

        console.log('error modificando la prenda: ',error);

        Swal.fire({
          title: '¡Error!',
          text: error.error.msg,
          icon: 'error',
          showCloseButton: true,
          confirmButtonText: 'Volver a intentar',
          footer: 'Parece que ha habido un problema modificando la prenda'
        });
      });

    }
    else {
      Swal.fire({
        title: '¡Error!',
        text: 'El formulario no se ha completado correctamente',
        icon: 'error',
        confirmButtonText: 'Volver a intentar',
      });
    }

  }

  cambioArchivo(element) {

    this.archivoASubir = element.target.files;

    console.log(this.archivoASubir);

  }

}
