import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// import { UsuarioService } from '../../services/usuario.service';
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
               private usuarioService :UsuarioService) {  }

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

        // navegacion en función del tipo de usuario

        console.log('pues no redirige bien.. ', this.usuarioService.getRol());
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

        Swal.fire({
          title: '¡Error!',
          text: error.error.msg,
          icon: 'error',
          confirmButtonText: 'Volver a intentar',
        });

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
