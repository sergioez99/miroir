import { TEntity } from './commons';
import { vec4 } from 'gl-matrix';

class ELight extends TEntity {

    private intensidad: vec4 = vec4.create();
    private tipo;
    private apertura: number; //no hay float en ts, solo numbers
    private atenAngular: number;
    private atenCte: number;
    private atenLineal: number;
    private atenCuadrat: number;



    constructor(tipo, intensidad, apertura, atenAngular, atenCte, atenLineal, atenCuadrat) {
      super();
      this.tipo = tipo;
      if (intensidad) {
          this.intensidad = intensidad;
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
      this.atenLineal = s;
  }

  getAtenLineal() {
      return this.atenLineal;
  }

  setAtenCuadrat(atenCuadrat) {
    this.atenCuadrat = atenCuadrat;
  }
  
  getAtenCuadrat() {
    return this.atenCuadrat;
  }

  setTipo(tipo) {
    this.tipo = tipo;
    }

  getTipo() {
      return this.tipo;
  }

  beginDraw() {
    
  }

  endDraw() {
  }
}

class ECamera extends TEntity {

    private esPerspectiva: boolean;
    private izquierda: number;
    private derecha: number;
    private inferior: number;
    private superior: number;
    private cercano: number;
    private lejano: number;

  constructor(esPerspectiva, cercano, lejano, derecha, izquierda, superior, inferior) {
      super();
      this.esPerspectiva = esPerspectiva;
      this.cercano = cercano;
      this.lejano = lejano;
      this.derecha = derecha;
      this.izquierda = izquierda;
      this.superior = superior;
      this.inferior = inferior;
  }

  /*setPerspective(fovy, aspect, near, far) {
      
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
  }*/
}

/*class EModel extends TEntity {



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
}*/



export {
    ECamera,
    ELight,
    //TModel,
    TEntity,
    
}



