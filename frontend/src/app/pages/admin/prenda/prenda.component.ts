import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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

  seleccionados: string[];

  uid;

  // lista de las posibles texturas
  texturasList: string[] = ['diffuse', 'normal', 'height', 'roughness', 'AO'];
  // nombre de las diferentes grupos de texturas (textura0, textura1, ...)
  texturas: string[] = [];
  // dentro de una textura, cuales se van a subir (diffuse, normal, ...)
  texturasSeleccionadas: string[][] = [];

  archivoASubir: Map<String, Array<File>> = new Map();

  constructor(private fb: FormBuilder,
    private prendaService: PrendaService,
    private usuarioService: UsuarioService,
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private router: Router,) { }


  ngOnInit(): void {

    this.uid = this.route.snapshot.params['uid'];

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
          identificador: [identificador, Validators.required],
          idCliente: [idCliente],
          archivoXS: [archivo],
          archivoS: [archivo],
          archivoM: [archivo],
          archivoL: [archivo],
          archivoXL: [archivo],

        });
      });
    }
    else {
      this.formPrenda = this.fb.group({
        talla: [talla, Validators.required],
        nombre: [nombre, Validators.required],
        descripcion: [descripcion, Validators.required],
        visible: [visible, Validators.required],
        identificador: [identificador, Validators.required],
        idCliente: [idCliente],
        archivoXS: [archivo],
        archivoS: [archivo],
        archivoM: [archivo],
        archivoL: [archivo],
        archivoXL: [archivo],
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


        // guardar los modelos de las diferentes tallas de la prenda

        this.seleccionados.forEach(elemento => {

          // para cada talla seleccionada, buscar el file en el map y enviarlo al servidor

          let archivo = this.archivoASubir.get('archivo'+elemento);

          console.log('archivo: ', archivo);

          // guardar archivo de la prenda
          this.uploadService.crearArchivoPrenda(res['prenda'].uid, archivo, elemento).then((res) => {

            console.log('hola holita: ', res);
          });

        });

        console.log('supuestamente acabado');

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

            this.seleccionados = [];
            this.texturas = [];
            this.texturasSeleccionadas = [];

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





/*

        // guardar archivo de la prenda
        this.uploadService.crearArchivoPrenda(res['prenda'].uid, this.archivoASubir).then((res) => {

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

        }).catch((error) => {
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

*/























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
    /*
        if (this.formPrenda.valid) {

          this.prendaService.modificarPrenda(this.uid, this.formPrenda.value).then((res) => {

            if (this.archivoASubir) {
              // guardar archivo de la prenda
              this.uploadService.crearArchivoPrenda(res['prenda'].uid, this.archivoASubir).then((res) => {

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

              }).catch((error) => {
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

            }
            else{
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

            }



          }).catch((error) => {

            console.log('error modificando la prenda: ', error);

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
     */
  }

  cambioArchivo(element) {

    this.archivoASubir.set(element.target.id, element.target.files);

    console.log(this.archivoASubir);

  }

  pruebas() {
    console.log('seleccionados: ', this.seleccionados);
    console.log('texturas seleccionadas: ', this.texturasSeleccionadas);
    console.log('texturas que ya ni recuerdo que guarda', this.texturas);

    this.formPrenda.addControl(`textura${this.texturas.length}`, this.fb.control(null, Validators.required));
    this.texturas.push(`textura${this.texturas.length}`);

    console.log(this.texturasSeleccionadas);

    console.log(this.formPrenda);
  }

  seleccionarTexturas(event, textura) {

    if (event) {
      for (let i = 0; i < event.length; i++) {
        this.formPrenda.addControl(`textura${textura}${event[i]}`, this.fb.control(null));
      }
    }
  }

}
