import { RMalla } from "./TRecurso";

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

    async cargarArchivos(nombre) {
        await Promise.all([
          this.cargarFichero(nombre),
        ]).then(res => {
            
        })
        console.log('terminar cargarArchivos');
    }

    async cargarFichero(fichero){
        var malla;
        malla = new Malla();

        return new Promise( (resolve, reject) =>{

            fetch("http://localhost:4200/assets/"+fichero).then(response =>{
                    var splitted = response.url.split(".", 2);
                    response.json().then(file =>{ 
                        if(splitted[1] == "json"){
                            malla.setVertices(file.model.meshes[0].verts);
                            malla.setCoordtex(file.model.meshes[0].uvs);
                            malla.setNormales(file.model.meshes[0].normals);
                            malla.setIndices(file.model.meshes[0].vertIndices);
                        }
                        else if (splitted[1] == "png" || splitted[1] == "jpg" || splitted[1] == "jpeg" || splitted[1] == "bmp"){
                            var imagen = new Image();
                            imagen.src = "http://localhost:4200/assets/"+fichero;
                            malla.setTexturas(imagen);
                        }
                        console.log('terminar cargarFicheros');
                        resolve(malla);
                })
            })
        })
    };
}

class Malla {
    private vertices;
    private normales;
    private coordtex;
    private indices;
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