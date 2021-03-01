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

    getesPerspectiva(){
        return this.esPerspectiva;
    }
    setesPerspectiva(esP) {
        this.esPerspectiva = esP;
    }

    getCercano() {
        return this.cercano;
    }
    setCercano(c) {
        this.cercano = c;
    }

    getLejano() {
        return this.lejano;
    }
    setLejano(c) {
        this.lejano = c;
    }

    getDerecha() {
        return this.derecha;
    }
    setDerecha(c) {
        this.derecha = c;
    }

    getIzq() {
        return this.izquierda;
    }
    setIzq(c) {
        this.izquierda = c;
    }

    getSup() {
        return this.superior;
    }
    setSup(c) {
        this.superior = c;
    }

    getInf() {
        return this.inferior;
    }
    setInf(c) {
        this.inferior = c;
    }



  beginDraw() {

  }

  endDraw() {
  }
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



