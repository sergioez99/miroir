import { Component, OnInit,Input } from '@angular/core';
import { ClienteService } from '../../../services/cliente.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../../models/cliente.model';

import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-perfil-cliente',
  templateUrl: './perfil-cliente.component.html',
  styleUrls: ['./perfil-cliente.component.css']
})
export class PerfilClienteComponent implements OnInit {
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
      this.uid=this.clienteService.getID();
      this.password=this.clienteService.getPass();
      this.email=this.clienteService.getEmail();
      console.log(this.email);
      this.empresa=this.clienteService.getEmpresa();
      this.telefono=this.clienteService.getTelefono();
      this.NIF=this.clienteService.getNIF();
      this.nombre=this.clienteService.getNombre();
      
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
