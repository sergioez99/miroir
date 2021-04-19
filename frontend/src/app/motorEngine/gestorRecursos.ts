import { TRecurso, Malla } from "./commons";
import { RMalla, RTextura, RShader } from "./TRecurso";

export class gestorRecursos {

    private recursos: TRecurso[];
    private tipoRecurso;
    private recursoMalla: RMalla;
    private recursoTextura: RTextura;

    constructor(){
        this.recursos = [];
        this.recursoMalla = new RMalla();
        this.recursoTextura = new RTextura();
    }

    async getRecurso(nombre) {
        let miRecurso;
        let encontrado = false;

        for(let i = 0; i < this.recursos.length && !encontrado; i++)
            if(this.recursos[i].getNombre() === nombre){
                miRecurso = this.recursos[i];                 
                encontrado = true;             
            }
        
        if(!encontrado) {
            miRecurso = await this.cargarFichero(nombre);
            if(this.tipoRecurso == 1){
                this.recursoMalla.addMallas(miRecurso);
                this.recursoMalla.setNombre(nombre);
                this.recursos.push(this.recursoMalla);
            }   
            else{
                this.recursoTextura.setImagen(miRecurso);
                this.recursoTextura.setNombre(nombre);
                this.recursos.push(this.recursoTextura);
            }
        }

        return miRecurso;
    }

    async leerArchivoRed(url:string) {
        // Cargar las cabecera, token o lo que sea
        return fetch(url);
    }

    // Devuelve la promesa de leer datos de una url
    async contenidoBase64(file:any) {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onerror = reject;
            fr.onload = function() {
                resolve(fr.result);
            }
            fr.readAsDataURL(file);
        });
    }
    async cargarFichero(fichero:string){
        //let url = env.base_url + +fichero;
        let partes = fichero.split("."); // ["pepe","json"]  ["textura",".jpeg"]
        let archivo = await this.leerArchivoRed("http://localhost:4200/assets/"+fichero);
        switch (partes[1]) {
            case 'json':
                this.tipoRecurso = 1;
                let file = await archivo.json();
                let malla = new Malla();
                                                        
                malla.setCoordtex(file.model.meshes[0].uvs[0]);
                malla.setNormales(file.model.meshes[0].normals);

                var indices = [];

                for(let i = 0; i < file.model.meshes[0].vertIndices.length; i++){
                    var pos = file.model.meshes[0].vertIndices[i]*3;
                    indices.push(file.model.meshes[0].verts[pos]);
                    indices.push(file.model.meshes[0].verts[pos+1]);
                    indices.push(file.model.meshes[0].verts[pos+2]);
                }


                malla.setIndices(file.model.meshes[0].face.vertElementIndices);
                malla.setVertices(indices);
                console.log(file.model.meshes[0].face.vertElementIndices);

                malla.setTexturas(file.materials[0].maps[0].file)

                malla.setDiffuse(file.materials[0].diffuse);
                malla.setSpecular(file.materials[0].specular);
                malla.setGlossiness(file.materials[0].glossiness)

                return malla;
        
            default:
                // sera una imagen jpg, png...
                this.tipoRecurso = 2;

                let miblob = await archivo.blob();
                let contenidoBase64 = await this.contenidoBase64(miblob);
                var imagen = new Image();
                imagen.src = String(contenidoBase64);
                return imagen;
                
                
                /*let array = await archivo.arrayBuffer();
                console.log(array);
                return array*/
        }
    };

    dibujarMallas(){
        this.recursoMalla.draw();
    }
}

