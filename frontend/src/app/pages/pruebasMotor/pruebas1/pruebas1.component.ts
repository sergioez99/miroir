import { Component, OnInit } from '@angular/core';
import { min } from 'rxjs/operators';
import { TEntity, Malla, TRecurso } from 'src/app/motorEngine/commons';
import { ECamera, ELight } from 'src/app/motorEngine/TEntity';
import { TNode } from 'src/app/motorEngine/TNode';
import { mat4, vec3, vec4 } from 'gl-matrix';

@Component({
  selector: 'app-pruebas1',
  templateUrl: './pruebas1.component.html',
  styleUrls: ['./pruebas1.component.css']
})
export class Pruebas1Component implements OnInit {

  //Para probar nodos
  private miNodo: TNode;

  private miNodo1: TNode;
  private miNodo2: TNode;
  private miNodo3: TNode;
  private miNodo4: TNode;

  private hijos: TNode[];

  private matriz: mat4;
  private matriz2: mat4;
  private matriz3: mat4;
  private matriz4: mat4;

  private traslacion: vec3 = vec3.fromValues(1,1,1);
  private rotacion: vec3 = vec3.fromValues(2,2,2);
  private escalado: vec3 = vec3.fromValues(3,3,3);

  //Para probar luces
  private miLight: ELight;

  private intensidad: vec4 = vec4.fromValues(1,1,1,1);

  //Para probar camaras
  private miCamera: ECamera;

  //Para probar malla
  private miMalla: Malla;
  private arrays: number[];

  //Para probar recuro
  private miRecurso: TRecurso;

  constructor() { }

  ngOnInit(): void {
    this.miNodo = new TNode(null,null,null,null,null,null,null);
    this.miLight = new ELight(null,null,null,null,null,null, null);
    this.miCamera = new ECamera(null,null,null,null,null,null,null);

    console.log(this.miNodo);
    console.log(this.miLight);
    console.log(this.miCamera);

    this.miNodo1 = new TNode(null,this.miNodo1,null,null,null,null,null);
    this.miNodo2 = new TNode(null,this.miNodo1,null,null,null,null,null);
    this.miNodo3 = new TNode(null,this.miNodo1,null,null,null,null,null);
    this.miNodo4 = new TNode(null,this.miNodo1,null,null,null,null,null);
    this.hijos = [this.miNodo1, this.miNodo2, this.miNodo3, this.miNodo4];

    this.miNodo.addChild(this.miNodo4);
    console.log(this.miNodo);
    this.miNodo.remChild(this.miNodo4);
    console.log(this.miNodo);

    this.miNodo.addChild(this.miNodo1);
    this.miNodo.addChild(this.miNodo2);
    this.miNodo.addChild(this.miNodo3);
    this.miNodo.addChild(this.miNodo4);

    console.log(this.miNodo.getChildren());

    this.matriz = mat4.fromValues(1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1);
    this.matriz2 = mat4.fromValues(2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2);
    this.matriz3 = mat4.fromValues(3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3);
    this.matriz4 = mat4.fromValues(4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4);

    this.miNodo.setTransformMatrix(this.matriz);
    console.log("Matriz de transformacion de nodo: " + this.miNodo.getTransformMatrix());

    this.miNodo2.setTransformMatrix(this.matriz2);

    this.miNodo4.setpadre(this.miNodo2);
    console.log(this.miNodo4.getpadre());

    this.miNodo.setEscalado(this.escalado);
    this.miNodo.setRotacion(this.rotacion);
    this.miNodo.setTraslacion(this.traslacion);
    console.log(this.miNodo.getEscalado());
    console.log(this.miNodo.getRotacion());
    console.log(this.miNodo.getTraslacion());

    //Probando una luz
    this.miLight.setIntensidad(this.intensidad);
    this.miLight.setApertura(1.0);
    this.miLight.setAtenAngular(2.0);
    this.miLight.setAtenCte(3.4);
    this.miLight.setAtenCuadrat(4.6);
    this.miLight.setAtenLineal(5.3);
    this.miLight.setTipo("angular");

    console.log(this.miLight.getIntensidad());
    console.log(this.miLight.getApertura());
    console.log(this.miLight.getAtenAngular());
    console.log(this.miLight.getAtenCte());
    console.log(this.miLight.getAtenCuadrat());
    console.log(this.miLight.getAtenLineal());
    console.log(this.miLight.getTipo());

    console.log(this.miLight);

    //Malla
    this.arrays = [1,2,3];
    this.miMalla.setCoordtex(this.arrays);
    this.miMalla.setIndices(this.arrays);
    this.miMalla.setNormales(this.arrays);
    this.miMalla.setTexturas(this.arrays);
    this.miMalla.setTexturas(this.arrays);

    console.log(this.miMalla);

    //Recurso
    this.miRecurso.setNombre("Hola");
    console.log(this.miRecurso);

  }

}
