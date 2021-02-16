import { Component, OnInit,Input } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../../models/usuario.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  public listaUsuarios: Usuario[] = [];
  public formMedidas: FormGroup | null = null;

  @Input() peso :number;
  @Input() altura :number;
  @Input() pecho :number;
  @Input() cintura :number;
  @Input() cadera :number;



  constructor( private fb: FormBuilder,
               private usuarioService :UsuarioService) { }

  ngOnInit(): void {

    // this.sexo = this.usuarioService.getSexo();
    this.peso = this.usuarioService.getPeso();
    this.altura = this.usuarioService.getAltura();
    this.pecho = this.usuarioService.getPecho();
    this.cintura = this.usuarioService.getCintura();
    this.cadera = this.usuarioService.getCadera();

    this.formMedidas = this.fb.group({
      peso: [this.peso, [Validators.required, Validators.min(10), Validators.max(200)]],
      altura: [this.altura, [Validators.required, Validators.min(100), Validators.max(200)]],
      pecho: [this.pecho, [Validators.required, Validators.min(10), Validators.max(200)]],
      cintura: [this.cintura, [Validators.required, Validators.min(10), Validators.max(200)]],
      cadera: [this.cadera, [Validators.required, Validators.min(10), Validators.max(200)]]
    });
    this.cargarUsuarios();
  }

  actualizarUsuario(){
    if (this.formMedidas.valid) {

      
      this.usuarioService.actualizarMedidasUsuario(this.formMedidas.value).then((response) => {

        // medidas introducidas correctamente

        Swal.fire({
          title: 'Felicidades',
          text: 'Sus medidas han sido actualizadas correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
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
    else {
      Swal.fire({
        title: 'Medidas incorrectas',
        text: 'Hay algún error en las medidas introducidas, por favor revíselo',
        icon: 'error',
        confirmButtonText: 'Volver a intentar',
      });
    }
  }

  cargarUsuarios() {
    
    this.usuarioService.cargarUsuarios(0,'' )
      .subscribe( res => {
          this.listaUsuarios = res['usuarios'];
      }, (err) => {
      });
    
  }

  cargaUsu(id){
    this.listaUsuarios
    this.listaUsuarios.forEach(usu => {
      if(usu.uid==id){
        
      }
    });
  }

}