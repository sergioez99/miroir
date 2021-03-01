class TEntity {

    getEntity() {
        return this;
    }
    beginDraw() {
    }

    endDraw() {
    }
}

class TRecurso {

    private nombre: string;
    
    constructor() {
    }

    getNombre() {
        return this.nombre;
    }

    setNombre(nombre) {
        this.nombre = nombre;
    } 
}

class Malla {
    private vertices: number[];
    private normales: number[];
    private coordtex: number[];
    private indices: number[];
    private texturas; //Textura[];

    constructor(){

    }

    draw(){

    }
}

export {
    TEntity,
    TRecurso,
    Malla
}