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
    private nombres: String[] = [];
    

    constructor() {
    }

    getNombre() {
        return this.nombre;
    }

    setNombre(nombre) {
        this.nombre = nombre;
    }

    addNombres(n: string){
        this.nombres.push(n);
    }

    getNombres(){
        return this.nombres;
    }
}

class Malla {
    private vertices;
    private normales;
    private coordtex;
    private indices;
    private texturas = []; //Textura[];
    private diffuse;
    private specular;
    private glossiness;
    private nombre;

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
        this.texturas.push(v);
    }
    getTexturas() {
        return this.texturas;
    }

    setDiffuse(v) {
        this.diffuse = v
    }
    getDiffuse() {
        return this.diffuse;
    }

    setSpecular(v) {
        this.specular = v
    }
    getSpecular() {
        return this.specular;
    }

    setGlossiness(v) {
        this.glossiness = v
    }
    getGlossiness() {
        return this.glossiness
    }


    getNombre(){
        return this.nombre;
    }
    setNombre(n){
        this.nombre = n;
    }
    

    draw(){

    }
}

export {
    TEntity,
    TRecurso,
    Malla
}