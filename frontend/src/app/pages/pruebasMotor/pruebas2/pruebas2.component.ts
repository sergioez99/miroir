import { Component, OnInit } from '@angular/core';
import { min } from 'rxjs/operators';
import { TEntity, Malla, TRecurso } from 'src/app/motorEngine/commons';
import { ECamera, ELight } from 'src/app/motorEngine/TEntity';
import { TNode } from 'src/app/motorEngine/TNode';
import { mat4, vec3, vec4 } from 'gl-matrix';
import { TMotorTAG } from 'src/app/motorEngine/TMotorTAG';
import { htmlAstToRender3Ast } from '@angular/compiler/src/render3/r3_template_transform';



@Component({
  selector: 'app-pruebas2',
  templateUrl: './pruebas2.component.html',
  styleUrls: ['./pruebas2.component.css']
})
export class Pruebas2Component implements OnInit {

  private motor;
  private cam;
  private luz;
  private personaje;
  private cuerpo;
  private sombrero;

  constructor() { }

  ngOnInit(): void {
    //hay que crear antes la luz y la cámara que el personaje, no se podría dibujar el personaje si no se hace así
    /*this.motor = new TMotorTAG();

    this.cam = this.motor.crearCamara(null, [0,0,25], [0,7*Math.PI/4,0], [1,1,1], 0.1, 100, 0, 0, 0, 0, 0);
    this.luz = this.motor.crearLuz(null, [0,25,0], [3*Math.PI/2,0,0], [1,1,1], [1,1,1], "puntual", 1, 1, 1, 1, 1);

    this.personaje = this.motor.crearNodo(null, [10, 0, 10], [0,0,0],[1,1,1], null, null, null);

    this.cuerpo = this.motor.crearModelo(this.personaje, [0,0,0], [0,0,0], [1,1,1], "body.blend");
    this.sombrero = this.motor.crearModelo(this.personaje, [0,10,0], [0,0,Math.PI/8], [1,1,1], "hat.blend");*/
    
/*var json=obj2json(`v 1.000000 -1.000000 -1.000000
v 1.000000 -1.000000 1.000000
v -1.000000 -1.000000 1.000000
v -1.000000 -1.000000 -1.000000
v 1.000000 1.000000 -0.999999
v 0.999999 1.000000 1.000001
v -1.000000 1.000000 1.000000
v -1.000000 1.000000 -1.000000
vn 0.0000 -1.0000 0.0000
vn 0.0000 1.0000 0.0000
vn 1.0000 -0.0000 0.0000
vn 0.0000 -0.0000 1.0000
vn -1.0000 -0.0000 -0.0000
vn 0.0000 0.0000 -1.0000
s off
f 2//1 4//1 1//1
f 8//2 6//2 5//2
f 5//3 2//3 1//3
f 6//4 3//4 2//4
f 3//5 8//5 4//5
f 1//6 8//6 5//6
f 2//1 3//1 4//1
f 8//2 7//2 6//2
f 5//3 6//3 2//3
f 6//4 7//4 3//4
f 3//5 7//5 8//5
f 1//6 4//6 8//6`);

console.log(json);
var a = JSON.stringify(json);
console.log(a);*/

  }
}