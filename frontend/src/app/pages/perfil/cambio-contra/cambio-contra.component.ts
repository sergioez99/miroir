import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';
import { RecuperacionService } from '../../../services/recuperacion.service';
import {CustomValidators} from '../../../services/auth.password.repeat.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-cambio-contra',
  templateUrl: './cambio-contra.component.html',
  styleUrls: ['./cambio-contra.component.css']
})
export class CambioContraComponent implements OnInit {

  public formRecovery: FormGroup | null = null;
  public formSubmit = false;

  public hide = true;
  public hideR = true;
  private email;

  constructor( private fb: FormBuilder,
               private router: Router,
               private route: ActivatedRoute,
               private recuperacionService :RecuperacionService,
               private usuarioService :UsuarioService) { }

  ngOnInit(): void {
    this.formRecovery = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      passwordRepeat: ['', [Validators.required]]
    });

    this.formRecovery.get('passwordRepeat').setValidators(
      CustomValidators.equals(this.formRecovery.get('password'))
    );
  }

  cambiarpassword() {

    //this.formRecovery.controls.['email'].setValue(localStorage.getItem('email'));
    //Esto hay que cambiarlo con algo del token
    this.email = this.usuarioService.getEmail();
    this.formRecovery.patchValue({ email : this.email });
    console.log(localStorage.getItem('email'));

    this.recuperacionService.cambiarPassword(this.formRecovery.value).then((response) =>{

      Swal.fire({
        title:'Contraseña cambiada correctamente',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Aceptar'
      }).then((result) => {
          this.router.navigateByUrl('/login');
      });

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
