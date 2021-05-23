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
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email] ],
      password: ['', Validators.required],
      passwordRepeat: ['', [Validators.required] ],
      nombreEmpresa: ['', Validators.required],
      nif: ['', [Validators.required] ],
      telefono: ['', Validators.required],
      terminos: [false, [Validators.required] ],
    });

    this.formRegistroCliente.get('passwordRepeat').setValidators(
      [
        Validators.required,
        CustomValidators.equals(this.formRegistroCliente.get('password'))
      ]
    );
  }

  enviar() {


    if(this.terminos){
      if(this.formRegistroCliente.valid){
        console.log('formulario de registro de cliente válido');

        this.authService.registroCliente(this.formRegistroCliente.value).then( res => {

          Swal.fire({
            title:'Usuario creado correctamente',
            text: 'Le hemos enviado un email de confirmación. <br> Por favor, revise su bendeja de entrada.',
            icon: 'success',
            showCloseButton: true,
            confirmButtonText: 'Aceptar'
          }).then((result) => {
            // navegacion a login con router
            localStorage.setItem('email', this.formRegistroCliente.value.email);
            this.router.navigateByUrl('/verificacion');
          });

        }).catch( err =>{

          Swal.fire({
            title:'¡Error!',
            text: err.error.msg,
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
