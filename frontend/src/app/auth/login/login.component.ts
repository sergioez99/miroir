import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

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
               private usuarioService: UsuarioService,
               private router: Router) {  }

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    this.formSubmit = true;
    console.log(this.formLogin);
    if (this.formLogin.valid) {
      console.log('enviar');
      this.usuarioService.login(this.formLogin.value).subscribe( res => {

        console.log('respuesta al subscribe:', res);
        // coger el token y guardarlo en localStorage
        localStorage.setItem('token', res['token']);
        // navegacion a dashboard con router
        this.router.navigateByUrl('/home');

      }, (err) => {
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


}
