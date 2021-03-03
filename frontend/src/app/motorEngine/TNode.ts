/*import {TCamera, TLight} from './TEntity.js';
import {TEntity} from './commons.js';*/


import { mat4, vec3 } from 'gl-matrix';


export class TNode {

    private transformMatrix: mat4 = mat4.create();
    private entidad;//: Tentity;
    private padre : TNode;
    private children: TNode[];
    private traslacion: vec3 = vec3.create();
    private rotacionX: vec3 = vec3.create();
    private rotacionY: vec3 = vec3.create();
    private rotacionZ: vec3 = vec3.create();
    private escalado: vec3 = vec3.create();




    constructor(transformMatrix, padre, entidad, children, traslacion, rotacionX, rotacionY, rotacionZ, escalado) {
      this.transformMatrix = transformMatrix;
      this.entidad = entidad;
      this.padre = padre;
      this.children = [];
      if (children) {
          children.forEach((e) => {
              this.children.push(e);
          });
      }

      if(traslacion)
        this.traslacion = traslacion;
      if(rotacionX)
        this.rotacionX = rotacionX;
      if(rotacionY)
        this.rotacionY = rotacionY;
      if(rotacionZ)
        this.rotacionZ = rotacionZ;
      if(escalado)
        this.escalado = escalado;
    }

    // Funciones

    //añadir hijo
    addChild(child) {
        this.children.push(child);
    }
    
    //borrar hijo
    remChild(child) {
        this.children.splice(this.children.indexOf(child), 1);
    }

    getChildren(){
      return this.children;
    }

    setTransformMatrix(_transformMatrix) {
      this.transformMatrix = _transformMatrix;
    }
    getTransformMatrix() {
      return this.transformMatrix;
    }
    
    setentidad(entidad) {
        this.entidad = entidad;
    }

    getentidad() {
        return this.entidad;
    }
    
    setpadre(_padre) {
      this.padre = _padre;
    }
    getpadre() {
        return this.padre;
    }

    setTraslacion(_traslacion) {
      this.traslacion = _traslacion;
    }
    getTraslacion() {
      return this.traslacion;
    }

    setRotacion (rotacion) {
      this.rotacionX = rotacion;
    }
    getRotacion() {
      return this.rotacionX
    }

    setEscalado (escalado){
      this.escalado = escalado;
    }
    getEscalado() {
      return this.escalado;
    }
    
    recorrer (matrizAcum){
      console.log("Empieza método recorrer");
      //falta un if que no entiendo

      mat4.translate(matrizAcum, matrizAcum, this.traslacion);
      mat4.rotate(matrizAcum, matrizAcum, 0.5, this.rotacionX);
      mat4.scale(matrizAcum, matrizAcum, this.escalado);

      this.transformMatrix = matrizAcum;

      console.log(this.transformMatrix);
      
      this.entidad.draw(matrizAcum);

      //para cada hijo recorrer(transformMatrix) esto no se :S      
      for (var i = 0; i < this.padre.children.length; i++) {
        if(this.padre.children[i] !== null) {
          this.padre.children[i].recorrer(this.transformMatrix);

        }
      }
    }
    
    draw() {
      if (this.entidad && this.entidad != null) {
          this.entidad.beginDraw();
      }
      if (this.children && this.children.length > 0) {
          this.children.forEach((e) => {
              e.draw();
          });
      }
      if (this.entidad && this.entidad != null) {
          this.entidad.endDraw();
      }
    }
}