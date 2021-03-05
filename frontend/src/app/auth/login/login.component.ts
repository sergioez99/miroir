import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { VerificacionService } from '../../services/verificacion.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formLogin: FormGroup | null = null;
  public formSubmit = false;

  public hide = true;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router,
               private usuarioService :UsuarioService,
               private verificacionService :VerificacionService) {  }

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false],
    });
  }


  login() {

    this.formSubmit = true;

    if (this.formLogin.valid) {
      this.authService.login(this.formLogin.value).then((response) => {

        this.usuarioService.setEmail(this.formLogin.value.email);
        console.log(this.formLogin.value.email);

        // navegacion en función del tipo de usuario

        switch ( this.usuarioService.getRol() ){

          case 'ROL_USUARIO':
            this.router.navigateByUrl('/perfil/usuario');
            break;
          case 'ROL_CLIENTE':
            this.router.navigateByUrl('/perfil/cliente');
            break;
          case 'ROL_ADMIN':
            this.router.navigateByUrl('/admin');
            break;
        }

      }).catch((error) =>{

        console.log('error en login');

        if (error.error.errorCod == 2){

          // aqui el email del usuario no ha sido validado
          Swal.fire({
            title: 'Ups, Parece que tu email no ha sido validado',
            text: '¿Quieres que te lo volvamos a enviar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Envíamelo`,
            cancelButtonText: `Volver`,
          }).then((result) => {
            if (result.isConfirmed) {

              // aquí hay que hacer la llamada al servicio para reenviar el email
              this.verificacionService.reenviarEmail(this.formLogin.value.email).then( (response) => {

                Swal.fire('¡Enviado!',
                          'Ya hemos enviado otro email a su correo. <br> Por favor, valide su cuenta en inténtelo de nuevo.',
                          'success');
              }).catch( (error) => {

                console.log( 'error reenviando email: ', error);

                Swal.fire({
                  title: '¡Error!',
                  text: 'Parece que ha habido algun error en el reenvio. Inténtelo más tarde.',
                  icon: 'error',
                  confirmButtonText: 'Volver',
                });

              });



            }
          });

        }
        else{
          Swal.fire({
            title: '¡Error!',
            text: error.error.msg,
            icon: 'error',
            confirmButtonText: 'Volver a intentar',
          });
        }



      });

    }
  }
/*
  login() {
    this.formSubmit = true;
    console.log(this.formLogin);
    if (this.formLogin.valid) {
      console.log('enviar');
      this.usuarioService.loginCall(this.formLogin.value).subscribe( res => {

        console.log('respuesta al subscribe:', res);
        // coger el token y guardarlo en localStorage
        localStorage.setItem('token', res['token']);
        // decir que nos hemos logueado
        this.usuarioService.setIsLogged(true);
        // navegacion a dashboard con router
        this.router.navigateByUrl('/home');

      }, (err) => {
        this.usuarioService.setIsLogged(false);
        console.warn ('error respuesta api: ', err);
        // mostrar un mensaje de alerta


        Swal.fire({
          title: '¡Error!',
          text: err.error.msg,
          icon: 'error',
          confirmButtonText: 'Volver a intentar',
        });



      });
    }
    else{
      console.warn('errores en el formulario');
    }
  }
 */

}
