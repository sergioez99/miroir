import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';

// import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { VerificacionService } from '../../services/verificacion.service';


@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.css']
})
export class VerificacionComponent implements OnInit {

  token;
  email;


  constructor( private router :Router,
               private route: ActivatedRoute,
               private verificacionService :VerificacionService){

              }

  ngOnInit(): void {
    
  }

  reenviarCorreo(){
    this.email = localStorage.getItem('email');

    console.log(this.email);

    this.verificacionService.reenviarEmail(this.email).then((response) =>{



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
