import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {CustomValidators} from '../../services/auth.password.repeat.service';
import {AuthService} from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-usuario',
  templateUrl: './register-usuario.component.html',
  styleUrls: ['./register-usuario.component.css']
})
export class RegisterUsuarioComponent implements OnInit {

  public formRegister: FormGroup | null = null;
  public formSubmit = false;
  terminos = false;
  public hide = true;
  public hideR = true;


  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router) {  }

  ngOnInit(): void {
    this.formRegister = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordRepeat: ['', [Validators.required]],
      terminos: [false, [Validators.required] ],
    });

    this.formRegister.get('passwordRepeat').setValidators(
      CustomValidators.equals(this.formRegister.get('password'))
    );

  }


   registrarse(){
    this.formSubmit = true;
    console.log(this.formRegister);

    if(this.terminos){
      if (this.formRegister.valid){
        console.log('enviar');

        this.authService.registro(this.formRegister.value).then( res => {

          Swal.fire({
            title:'Usuario creado correctamente',
            text: 'Le hemos enviado un email de confirmación. <br> Por favor, revise su bendeja de entrada.',
            icon: 'success',
            showCloseButton: true,
            confirmButtonText: 'Aceptar'
          }).then((result) => {
            // navegacion a login con router
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
    }

  }

}
