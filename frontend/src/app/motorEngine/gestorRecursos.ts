import { TRecurso } from "./commons";

export class gestorRecursos {

    private recursos: TRecurso[];

    constructor(){

    }

    getRecurso(nombre) {
        let miRecurso;

        for(let i in this.recursos)
            if(this.recursos[i].getNombre === nombre)
                miRecurso = this.recursos[i];
        
        if(miRecurso == null) {
            miRecurso = new TRecurso();
            miRecurso.cargarFichero(nombre);
            this.recursos.push(miRecurso);
        }

        return miRecurso;
    }
}

