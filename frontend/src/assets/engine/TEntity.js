import { TEntity } from './commons';

class TLight extends TEntity {
  constructor(tipo, intensidad, apertura, atenAngular, atenCte, atenLineal, atenCuadrat) {
      super();
      this.tipo = tipo;
      this.intensidad = glMatrix.vec4.create();
      if (intensidad) {
          this.intensidad = (intensidad.length === 4)
              ? glMatrix.vec4.fromValues(...intensidad)
              : glMatrix.vec4.fromValues(...intensidad, 1.0);
      }
      this.apertura = apertura;
      this.atenAngular = atenAngular;
      this.atenCte = atenCte;
      this.atenLineal = atenLineal;
      this.atenCuadrat = atenCuadrat;
  }
  setIntensidad(intensidad) {
      this.intensidad = intensidad;
  }

  getIntensidad() {
      return this.intensidad;
  }

  setApertura(apertura) {
      this.apertura = apertura;
  }

  getApertura() {
      return this.apertura;
  }

  setAtenAngular(atenAngular) {
      this.atenAngular = atenAngular;
  }

  getAtenAngular() {
      return this.atenAngular;
  }

  setAtenCte(atenCte) {
      this.atenCte = atenCte;
  }

  getAtenCte() {
      return this.atenCte;
  }

  setAtenLineal(s) {
      this.atenLineal = atenLineal;
  }

  getAtenLineal() {
      return this.atenLineal;
  }

  setAtenCuadrat(atenCuadrat) {
    this.atenCuadrat = atenCuadrat;
  }
  
  getAtenCuadrat() {
    return atenCuadrat;
  }

  getTipo() {
      return this.tipo;
  }

  beginDraw() {
    
  }

  endDraw() {
  }
}

class TCamera extends TEntity {

  constructor(esPerspectiva, cercano, lejano, derecha, izquierda, superior, inferior, projection) {
      super();
      this.esPerspectiva = esPerspectiva;
      this.cercano = cercano;
      this.lejano = lejano;
      this.derecha = derecha;
      this.izquierda = izquierda;
      this.superior = superior;
      this.inferior = inferior;
      this.projection = projection;
  }

  setPerspective(fovy, aspect, near, far) {
      // fovy: Vertical field of view in radians;
      // aspect: Aspect ratio. typically viewport width/height;
      glMatrix.mat4.perspective(this.projection, fovy, aspect, this.cercano, this.lejano);
      this.isPerspective = true;
  }

  setParallel(izquierda, derecha, inferior, superior, cercano, lejano) {
      glMatrix.mat4.ortho(this.projection, izquierda, derecha, inferior, superior, cercano, lejano);
      this.esPerspectiva = false;
  }

  beginDraw() {

  }

  endDraw() {
  }
}

class TModel extends TEntity {

  constructor(malla) {
      super();
      this.malla = malla;
      
  }

  cargarModelo (fichero) {

  }

  beginDraw() {

  }

  endDraw() {
  }
}

export {
    TCamera,
    TLight,
    TModel,
    TEntity,
    
}





