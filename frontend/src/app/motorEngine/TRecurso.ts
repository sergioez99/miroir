
import { TRecurso, Malla } from './commons';

export class RMalla extends TRecurso {

    //Vertices, normales, coordenadas -> aquí los buffers
    //Valores en el json -> se abre el fichero y eso 
    //Parse, con esa estructura, guardamos las cosas en la malla de aquí abajo
    //Hacer correspondencia correcta entre arrays de maya ->  arrays de buffer
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