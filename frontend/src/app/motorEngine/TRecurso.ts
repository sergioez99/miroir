import { TRecurso, Malla } from './commons';

class RMalla extends TRecurso {

    private mallas: Malla[];



    constructor() {
      super();
    }

    cargarRMalla(fichero){
        let archivo;

        archivo.leerFichero(fichero);

        //leo el fichero, creo malla, añado malla
    }

    draw() {
        for(let i in this.mallas)
            this.mallas[i].draw();
    }
}