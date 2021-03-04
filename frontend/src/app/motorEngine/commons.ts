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

    setVertices(v) {
        this.vertices = v;
    }
    getVertices() {
        return this.vertices;
    }

    setNormales(v) {
        this.normales = v;
    }
    getNormales() {
        return this.normales;
    }

    setCoordtex(v) {
        this.coordtex = v;
    }
    getCoordtex() {
        return this.coordtex;
    }

    setIndices(v) {
        this.indices = v;
    }
    getIndices() {
        return this.indices;
    }

    setTexturas(v) {
        this.texturas = v;
    }
    getTexturas() {
        return this.texturas;
    }

    draw(){

    }
}

export {
    TEntity,
    TRecurso,
    Malla
}