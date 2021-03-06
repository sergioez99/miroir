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
  public lista:string[]=["ROL_ADMIN", "ROL_USUARIO"];
  private uid: string = '';
  @Input() rol: string = '';
  @Input() activo: boolean =false;
  @Input() validado: boolean =false;
  @Input() email: string = '';
  @Input() password: string='';
  @Input() peso :number;
  @Input() altura :number;
  @Input() pecho :number;
  @Input() cintura :number;
  @Input() cadera :number;

  public noAdmin = true;
  public hide = true;



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
    else{
      this.cargarFormularioNuevo();
    }

    this.formMedidas = this.fb.group({
      uid:this.uid,
      rol:[this.rol,[Validators.required]],
      activo:[this.activo, [Validators.required]],
      validado:[this.validado, [Validators.required]],
      email:[ this.email, [Validators.required, Validators.email]],
      password:[this.password, [Validators.required]],
      peso: [this.peso, [Validators.required, Validators.min(10), Validators.max(200)]],
      altura: [this.altura, [Validators.required, Validators.min(100), Validators.max(200)]],
      pecho: [this.pecho, [Validators.required, Validators.min(10), Validators.max(200)]],
      cintura: [this.cintura, [Validators.required, Validators.min(10), Validators.max(200)]],
      cadera: [this.cadera, [Validators.required, Validators.min(10), Validators.max(200)]]
    });

    if(this.usuarioService.isAdmin()){
      this.noAdmin = false;
    }

  }
  cargarFormulario(res:any):void{
    this.formMedidas.get('rol').setValue(res['usuarios'].rol);
    this.formMedidas.get('activo').setValue(res['usuarios'].activo);
    this.formMedidas.get('validado').setValue(res['usuarios'].validado);
    this.formMedidas.get('email').setValue(res['usuarios'].email);//
    this.formMedidas.get('peso').setValue(res['usuarios'].peso);
    this.formMedidas.get('altura').setValue(res['usuarios'].altura);
    this.formMedidas.get('pecho').setValue(res['usuarios'].pecho);
    this.formMedidas.get('cintura').setValue(res['usuarios'].cintura);
    this.formMedidas.get('cadera').setValue(res['usuarios'].cadera);
  }

  cargarFormularioNuevo(){
    this.rol='';
    this.activo=true;
    this.validado=true;
    this.uid='nuevo';
    this.email='';
    this.peso=10;
    this.altura=100;
    this.pecho=10;
    this.cintura=10;
    this.cadera=10;
  }
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
          text: 'Sus datos han sido actualizados correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });

      }).catch((error) =>{

        Swal.fire({
          title: 'Faltan campos por rellenar',
          text: error.error.msg,
          icon: 'error',
          confirmButtonText: 'Volver a intentar',
        });

      });

    }
    else {
      Swal.fire({
        title: 'Medidas incorrectas',
        text: 'Hay alg??n error en las medidas introducidas, por favor rev??selo',
        icon: 'error',
        confirmButtonText: 'Volver a intentar',
      });
    }
  }



}
