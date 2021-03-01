import { Component, OnInit,Input } from '@angular/core';
import { ClienteService } from '../../../services/cliente.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../../models/cliente.model';

import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  public formCliente: FormGroup | null = null;
  private uid: string = '';
  @Input() email: string = '';
  @Input() empresa: string = '';
  @Input() nombre: string = '';
  @Input() NIF: string = '';
  @Input() telefono: number;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private clienteService :ClienteService,
    private router: Router) { }

  ngOnInit(): void {
    this.uid=this.route.snapshot.params['uid'];
    console.log(this.uid);

    this.clienteService.cargarCli(this.uid)
        .subscribe( (res) => {
          console.log('nos responde: ');
          console.log(res);
          this.cargarFormulario(res);
        }, (err) => {
          console.log('nos da error en el back');
          console.log(err);
    });



    this.formCliente = this.fb.group({
      uid:this.uid,//
      email: this.email,//
      empresa: this.empresa,
      nombre: this.nombre,
      NIF: this.NIF,
      telefono: this.telefono,
    });

  }

  cargarFormulario(res:any):void{
    this.formCliente.get('email').setValue(res['clientes'].email);//
    this.formCliente.get('empresa').setValue(res['clientes'].empresa);
    this.formCliente.get('nombre').setValue(res['clientes'].nombre);
    this.formCliente.get('NIF').setValue(res['clientes'].NIF);
    this.formCliente.get('telefono').setValue(res['clientes'].telefono);

  }

  /*
  actualizarCliente(){
    if (this.formCliente.valid) {


      this.clienteService.actualizarMedidasUsuario(this.formCliente.value).then((response) => {

        // medidas introducidas correctamente

        Swal.fire({
          title: 'Felicidades',
          text: 'Sus medidas han sido actualizadas correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });

      }).catch((error) =>{

        Swal.fire({
          title: '¡Error!',
          text: error.error.msg,
          icon: 'error',
          confirmButtonText: 'Volver a intentar',
        });

      });

    }
    else {
      Swal.fire({
        title: 'Medidas incorrectas',
        text: 'Hay algún error en las medidas introducidas, por favor revíselo',
        icon: 'error',
        confirmButtonText: 'Volver a intentar',
      });
    }

  }
  */
}
