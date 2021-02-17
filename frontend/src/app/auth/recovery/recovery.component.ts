import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { RecuperacionService } from '../../services/recuperacion.service';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent implements OnInit {


  public formRecovery: FormGroup | null = null;
  public formSubmit = false;

  constructor( private fb: FormBuilder,
               private router: Router,
               private route: ActivatedRoute,
               private recuperacionService :RecuperacionService) { }

  ngOnInit(): void {
    this.formRecovery = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  recovery() {
    //localStorage.setItem(this.formRecovery.value.email, 'email')
    localStorage.setItem('email', this.formRecovery.value.email);

    this.recuperacionService.recuperarPassword(this.formRecovery.value.email.toString()).then((response) =>{

      Swal.fire({
        title:'Email enviado correctamente',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Aceptar'
      }).then((result) => {
          //Aquí se podría poner una página de "reenviar email de recuperacion"
          //this.router.navigateByUrl('/verificacion');
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
