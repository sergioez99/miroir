/*import {TCamera, TLight} from './TEntity.js';
import {TEntity} from './commons.js';*/


import { mat4, vec3 } from 'gl-matrix';


export class TNode {

    private transformMatrix: mat4 = mat4.create();
    private entidad;//: Tentity;
    private padre : TNode;
    private children: TNode[];
    private traslacion: vec3 = vec3.create();
    /*private rotacionX;
    private rotacionY;
    private rotacionZ;*/
    private rotacion;
    private escalado: vec3 = vec3.create();
    private actualizarMatriz: boolean = false;




    constructor(transformMatrix, padre, entidad, children, traslacion, rotacion, escalado) {
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
      if(rotacion)
        this.rotacion = rotacion;
      /*if(rotAnguloX)
        this.rotacionX = rotAnguloX;
      if(rotAnguloY)
        this.rotacionY = rotAnguloY;
      if(rotAnguloZ)
        this.rotacionZ = rotAnguloZ;*/
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

    /*setRotacionX (rotacion) {
      this.rotacionX = rotacion;
    }
    getRotacionX() {
      return this.rotacionX
    }
    setRotacionY (rotacion) {
      this.rotacionY = rotacion;
    }
    getRotacionY() {
      return this.rotacionY
    }
    setRotacionZ (rotacion) {
      this.rotacionZ = rotacion;
    }
    getRotacionZ() {
      return this.rotacionZ
    }*/

    getRotacion() {
      return this.rotacion;
    }
    setRotacion(rot) {
      this.rotacion = rot;
    }

    setEscalado (escalado){
      this.escalado = escalado;
    }
    getEscalado() {
      return this.escalado;
    }

    changeActuMatriz() {
      if(this.actualizarMatriz == true)
        this.actualizarMatriz = false;
      else
        this.actualizarMatriz = true;
    }
    getActuMatriz() {
      return this.actualizarMatriz;
    }
    
    recorrer (matrizAcum){
      console.log("Empieza método recorrer");
      //falta un if que no entiendo
      if(this.actualizarMatriz) {
        mat4.translate(matrizAcum, matrizAcum, this.traslacion);
        mat4.rotateX(matrizAcum, matrizAcum, this.rotacion);
        /*mat4.rotateX(matrizAcum, matrizAcum, this.rotacionX);
        mat4.rotateY(matrizAcum, matrizAcum, this.rotacionY);
        mat4.rotateZ(matrizAcum, matrizAcum, this.rotacionZ);*/
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