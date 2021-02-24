
import {TCamera, TLight, TTransform} from './TEntity';
import {TEntity, getEntity, setEntity} from './commons.js';

const mat4 = require('gl-mat4');

class TNode {
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

      this.traslacion = glMatrix.vec3.create();
      if(traslacion)
        this.traslacion = traslacion;
      this.rotacion = glMatrix.vec3.create();
      if(rotacion)
        this.rotacion = rotacion;
      this.escalado = scaglMatrix.vec3.create(); 
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
        let entidad = getentidad();
        this.children.splice(this.children.indexOf(child), 1);

        // Se elimina de luz y camara tambien
        if (this.entidad instanceof TLight) {
            entidad.Lights.splice(entidad.Lights.indexOf(child), 1);
        }
        if (this.entidad instanceof TCamera) {
            entidad.Views.splice(entidad.Views.indexOf(child), 1);
        }
        setentidad(entidad);
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

    setentidad(_entidad) {
        let entidad = getentidad();
        this.entidad = _entidad;
        
        // Se añade a luz y camara tambien
        if (this.entidad instanceof TLight) {
            entidad.Lights.push(this);
        }
        if (this.entidad instanceof TCamera) {
            entidad.Views.push(this);
        }
        setentidad(entidad);
        return this.entidad;
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

    setRotacion (_rotacion) {
      this.rotacion = this.rotacion;
    }
    getRotacion() {
      this.rotacion = this.rotacion;
    }

    setEscalado (escalado){
      this.escalado = this.escalado;
    }
    getEscalado() {
      return this.escalado;
    }

    recorrer (matrizAcum){
      console.log("Empieza método recorrer");
      //falta un if que no entiendo

      this.transformMatrix = matrizAcum * mat4.translate(this.traslacion) * mat4.rotate(this.rotacion) * mat4.scale(this.escalado);

      console.log(this.transformMatrix);
      
      this.entidad.draw(transformMatrix);

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

export {
    TNode,
}
