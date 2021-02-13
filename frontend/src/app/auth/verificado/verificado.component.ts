import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';

// import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { VerificacionService } from '../../services/verificacion.service';

@Component({
  selector: 'app-verificado',
  templateUrl: './verificado.component.html',
  styleUrls: ['./verificado.component.css']
})
export class VerificadoComponent implements OnInit {

  token;

  constructor(private router :Router,
    private route: ActivatedRoute,
    private verificacionService :VerificacionService) { }

  ngOnInit(): void {
    this.verificarToken();
  }

  //Esto va en la otra web
  verificarToken() {
    this.token = this.route.snapshot.params['token'];

    this.verificacionService.verificarEmail(this.token).then((response) => {

      this.router.navigateByUrl('/login');

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
