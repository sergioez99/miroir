import { Component, OnInit,Input } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../../models/usuario.model';

import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  //public listaUsuarios: Usuario[] = [];
  public formMedidas: FormGroup | null = null;
  public isNew: boolean=false;
  private uid: string = '';
  @Input() email: string = '';
  @Input() password: string='';
  @Input() peso :number;
  @Input() altura :number;
  @Input() pecho :number;
  @Input() cintura :number;
  @Input() cadera :number;



  constructor( private fb: FormBuilder,
    private route: ActivatedRoute,
    private usuarioService :UsuarioService,
    private router: Router) { }

  ngOnInit(): void {
    this.uid=this.route.snapshot.params['uid'];
    this.esNuevo();
    console.log(this.uid);

    if(this.uid!=='nuevo'){
      this.usuarioService.cargarUsu(this.uid)
        .subscribe( res => {
          console.log(res['usuarios']);
          this.cargarFormulario(res);
        }, (err) => {
        });
    }
    /*else{
      this.cargarFormularioNuevo();
    }*/

    this.formMedidas = this.fb.group({
      uid:this.uid,//
      email: this.email,//
      password:this.password,
      peso: [this.peso, [Validators.required, Validators.min(10), Validators.max(200)]],
      altura: [this.altura, [Validators.required, Validators.min(100), Validators.max(200)]],
      pecho: [this.pecho, [Validators.required, Validators.min(10), Validators.max(200)]],
      cintura: [this.cintura, [Validators.required, Validators.min(10), Validators.max(200)]],
      cadera: [this.cadera, [Validators.required, Validators.min(10), Validators.max(200)]]
    });
 
  }
  cargarFormulario(res:any):void{
    this.formMedidas.get('email').setValue(res['usuarios'].email);//
    this.formMedidas.get('peso').setValue(res['usuarios'].peso);
    this.formMedidas.get('altura').setValue(res['usuarios'].altura);
    this.formMedidas.get('pecho').setValue(res['usuarios'].pecho);
    this.formMedidas.get('cintura').setValue(res['usuarios'].cintura);
    this.formMedidas.get('cadera').setValue(res['usuarios'].cadera);
  }
  
 /* cargarFormularioNuevo():void{
    this.formMedidas.reset();
    this.formMedidas.get('uid').setValue('nuevo');
    this.formMedidas.get('email').setValue('ejemplo2@gmail.com');
    this.formMedidas.get('peso').setValue('10');
    this.formMedidas.get('altura').setValue('10');
    this.formMedidas.get('pecho').setValue('10');
    this.formMedidas.get('cintura').setValue('10');
    this.formMedidas.get('cadera').setValue('10');
    //this.router.navigateByUrl('/admin/usuarios/usuario/nuevo');

  }*/
  esNuevo(){
    if(this.uid==='nuevo'){
      this.isNew = true;
    }
    else{
      this.isNew = false;
    } 
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



}