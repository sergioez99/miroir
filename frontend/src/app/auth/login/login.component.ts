import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { VerificacionService } from '../../services/verificacion.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formLogin: FormGroup | null = null;
  public formSubmit = false;
  public auth2: any;

  public hide = true;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router,
               private usuarioService :UsuarioService,
               private verificacionService :VerificacionService,
               private zone: NgZone) {  }

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      email: [localStorage.getItem('email'), [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false],
    });

    this.renderButton();
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 470,
      'longtitle': true,
      'theme': 'light',
    });
    this.startApp();
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


  startApp(){
    gapi.load('auth2', () => {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        client_id: '149404174892-4nt0dds6tcv01v77gilcj7lk50o34vo0.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        // Request scopes in addition to 'profile' and 'email'
        //scope: 'additional_scope'
      });
      this.attachSignin(document.getElementById('my-signin2'));
    });
  };

  attachSignin(element) {
    console.log(element.id);
    this.auth2.attachClickHandler(element, {},
        (googleUser) => {
          var id_token = googleUser.getAuthResponse().id_token;
          console.log(id_token);
          this.authService.loginGoogle(id_token).then((res) =>{
            switch ( this.usuarioService.getRol() ){

              case 'ROL_USUARIO':
                this.zone.run(() =>  {
                  this.router.navigateByUrl('/perfil/usuario');
                })
                break;
              case 'ROL_CLIENTE':
                this.zone.run(() =>  {
                  this.router.navigateByUrl('/perfil/cliente');
                })
                break;
              case 'ROL_ADMIN':
                this.zone.run(() =>  {
                  this.router.navigateByUrl('/admin');
                })
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
        }, function(error) {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}
