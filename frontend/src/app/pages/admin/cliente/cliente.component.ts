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
  public isNew: boolean=false;
  public formCliente: FormGroup | null = null;
  private uid: string = '';
  @Input() email: string = '';
  @Input() password: string='';
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
    this.esNuevo();

    if(this.uid!=='nuevo'){
      this.clienteService.cargarCli(this.uid)
        .subscribe( (res) => {
          console.log('nos responde: ');
          console.log(res);
          this.cargarFormulario(res);
        }, (err) => {
          console.log('nos da error en el back');
          console.log(err);
        });
    }
    



    this.formCliente = this.fb.group({
      uid:this.uid,//
      email: this.email,//
      password:this.password,
      nombreEmpresa: this.empresa,
      nombre: this.nombre,
      nif: this.NIF,
      telefono: this.telefono,
    });

  }

  cargarFormulario(res:any):void{
    this.formCliente.get('email').setValue(res['clientes'].email);//
    this.formCliente.get('nombreEmpresa').setValue(res['clientes'].nombreEmpresa);
    this.formCliente.get('nombre').setValue(res['clientes'].nombre);
    this.formCliente.get('nif').setValue(res['clientes'].nif);
    this.formCliente.get('telefono').setValue(res['clientes'].telefono);

  }
  esNuevo(){
    if(this.uid==='nuevo'){
      this.isNew = true;
    }
    else{
      this.isNew = false;
    } 
  }
  
  actualizarCliente(){
    if (this.formCliente.valid) {


      this.clienteService.actualizarDatosCliente(this.formCliente.value).then((response) => {

        // medidas introducidas correctamente

        Swal.fire({
          title: 'Felicidades',
          text: 'Su usuario ha sido actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });

      }).catch((error) =>{

        Swal.fire({
          title: '¡Error!',
          text: error,
          icon: 'error',
          confirmButtonText: 'Volver a intentar',
        });

      });

    }
    else {
      Swal.fire({
        title: 'Datos incorrectos',
        text: 'Hay algún error en los datos introducidos, por favor revíselo',
        icon: 'error',
        confirmButtonText: 'Volver a intentar',
      });
    }

  }
  
}
