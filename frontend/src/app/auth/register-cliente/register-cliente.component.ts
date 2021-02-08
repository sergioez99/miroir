import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CustomValidators } from '../../services/auth.password.repeat.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-cliente',
  templateUrl: './register-cliente.component.html',
  styleUrls: ['./register-cliente.component.css']
})
export class RegisterClienteComponent implements OnInit {

  public formRegistroCliente: FormGroup | null = null;

  terminos = false;
  hide = true;
  hideR = true;


  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router) { }

  ngOnInit(): void {
    this.formRegistroCliente = this.fb.group({
      nombre: [''],
      email: ['', [Validators.required, Validators.email] ],
      password: ['', Validators.required],
      passwordRepeat: ['', [Validators.required] ],
      nombreEmpresa: [''],
      nif: ['', [Validators.required] ],
      telefono: [''],
      terminos: [false, [Validators.required] ],
    });

    this.formRegistroCliente.get('passwordRepeat').setValidators(
      CustomValidators.equals(this.formRegistroCliente.get('password'))
    );
  }

  enviar() {


    if(this.terminos){
      if(this.formRegistroCliente.valid){
        console.log('formulario de registro de cliente válido');

      }
      else{
        Swal.fire({
          title: '¡Error!',
          text: 'Hay algún error con el formulario, revíselo y envíelo de nuevo.',
          icon: 'error',
          showCloseButton: true,
          confirmButtonText: 'Volver a intentar',
          backdrop: false,
        });
      }

    }
    else{
      Swal.fire({
        title: 'Debe aceptar los términos y condiciones',
        icon: 'error',
        showCloseButton: true,
        confirmButtonText: 'Volver',
        backdrop: false,
      });
    }
  }

}
