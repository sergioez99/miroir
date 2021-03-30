import { TRecurso } from "./commons";

export class gestorRecursos {

    private recursos: TRecurso[];

    constructor(){
        this.recursos = []
    }

    async getRecurso(nombre) {
        let miRecurso;
        let encontrado = false;

        for(let i = 0; i < this.recursos.length && !encontrado; i++)
            if(this.recursos[i].getNombre === nombre){
                miRecurso = this.recursos[i];                 
                encontrado = true;             
            }
        
        if(!encontrado) {
            miRecurso = new TRecurso();
            await miRecurso.cargarFichero(nombre).then( (res)=>{
                miRecurso=<TRecurso>res;
            })
            this.recursos.push(miRecurso);
        }

        return miRecurso;
    }
}

