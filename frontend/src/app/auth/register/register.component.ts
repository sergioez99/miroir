import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioService } from '../../services/usuario.service';
import {CustomValidators} from '../../services/auth.password.repeat.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  public formRegister: FormGroup | null = null;
  public formSubmit = false;

  public hide = true;
  public hideR = true;


  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private router: Router) {  }

  ngOnInit(): void {
    this.formRegister = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordRepeat: ['', [Validators.required]]
    });

    this.formRegister.get('passwordRepeat').setValidators(
      CustomValidators.equals(this.formRegister.get('password'))
    );
  }


   registrarse(){
    this.formSubmit = true;
    console.log(this.formRegister);

    if (this.formRegister.valid){
      console.log('enviar');

      this.usuarioService.register(this.formRegister.value).subscribe( res => {

        console.log('Respuesta del servidor: ', res);

        // coger el token y guardarlo en localStorage
        // localStorage.setItem('token', res['token']);
        // navegacion a dashboard con router
        // this.router.navigateByUrl('/home');

      }, (err) => {
        console.warn('error rspuesta api:; ', err);
        // mostrar mensaje de alerta
      })
    }

  }
/*
  campoValido(campo: string) {

    return this.formRegister.get(campo).valid || !this.formSubmit;
  } */


}

/*
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterForm } from '../../interfaces/register-form.interface';
import { validarQueSeanIguales, CustomValidators } from '../../services/auth.password.repeat.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: FormGroup;
  constructor( private fb: FormBuilder ) {
  }

  ngOnInit(): void {
    this.user = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required]
    });
  }

  passwordMatchValidator(g: FormGroup) {
    console.log(g.get('password').value);
    return g.get('password').value === g.get('passwordRepeat').value
       ? null : {'mismatch': true};
 }

} */




