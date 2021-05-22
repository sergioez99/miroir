import { TRecurso, Malla } from "./commons";
import { RMalla, RTextura, RShader } from "./TRecurso";
import { environment } from '../../environments/environment';

export class gestorRecursos {

    private recursos: TRecurso[];
    private tipoRecurso;
    private recursoMalla: RMalla;
    private recursoTextura: RTextura;
    private totalMallas: RMalla;

    constructor(){
        this.recursos = [];
        this.totalMallas = new RMalla();
    }

    async getRecurso(nombre, ticket, tipo) {
        this.recursoMalla = new RMalla();
        this.recursoTextura = new RTextura();
        let miRecurso;
        let mallas;
        let imagen;
        let encontrado = false;

        for(let i = 0; i < this.recursos.length && !encontrado; i++){
           if(this.recursos[i].getNombres()[0].localeCompare(nombre) == 0){
               let tipo = nombre.split(".");
               switch (tipo[1]) {
                   case 'json':
                       mallas = this.recursos[i];
                       miRecurso = mallas.getMallas()[0];
                       break;
                   default:
                       imagen = this.recursos[i];
                       miRecurso = imagen.getImagen();
                       break;
               }
               encontrado = true;
           }
        }
        if(!encontrado) {
            miRecurso = await this.cargarFichero(nombre, ticket, tipo);
            if(this.tipoRecurso == 1){
                this.recursoMalla.addMallas(miRecurso);
                this.recursoMalla.addNombres(nombre);
                this.recursos.push(this.recursoMalla);
                this.totalMallas.addMallas(miRecurso);
            }
            else{
                this.recursoTextura.setImagen(miRecurso);
                this.recursoTextura.addNombres(nombre);
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
    async cargarFichero(fichero:string, ticket, tipo){
        //let url = env.base_url + +fichero;
        let partes = fichero.split("."); // ["pepe","json"]  ["textura",".jpeg"]
        let archivo;
        switch (partes[1]) {
            case 'json':

                archivo = await this.leerArchivoRed(environment.base_url + '/ticket/modelo/' + tipo + '/' + ticket);


                this.tipoRecurso = 1;
                let file = await archivo.json();
                let malla = new Malla();

                malla.setNombre(fichero);
                malla.setDibujado(true);

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

                for(let i in file.materials[0].maps){
                    malla.setTexturas(file.materials[0].maps[i].file)
                }
                   
                

                malla.setDiffuse(file.materials[0].diffuse);
                malla.setSpecular(file.materials[0].specular);
                malla.setGlossiness(file.materials[0].glossiness)

                return malla;

            default:
                archivo = await this.leerArchivoRed(environment.base_url + '/ticket/textura/' + fichero + '/' + ticket);

                // sera una imagen jpg, png...
                this.tipoRecurso = 2;

                let miblob = await archivo.blob();
                let contenidoBase64 = await this.contenidoBase64(miblob);
                let imagen = await new Promise((resolve, reject) => {
                    let imagen = new Image();
                    imagen.onload = ()=> {
                        resolve(imagen);
                    }
                    imagen.src = String(contenidoBase64);
                })
                return imagen;


                /*let array = await archivo.arrayBuffer();
                console.log(array);
                return array*/
        }
    };

    async ficherosAssets(fichero){
        //let url = env.base_url + +fichero;
        let partes = fichero.split("."); // ["pepe","json"]  ["textura",".jpeg"]
        let archivo;
        switch (partes[1]) {
            case 'json':

                archivo = await this.leerArchivoRed('http://localhost:4200/assets/animacion_alberto/' + fichero);

                this.tipoRecurso = 1;
                let file = await archivo.json();
                let malla = new Malla();

                malla.setDibujado(false);


                malla.setCoordtex(file.model.meshes[0].uvs[0]);
                malla.setNormales(file.model.meshes[0].normals);

                var indices = [];

                for(let i = 0; i < file.model.meshes[0].vertIndices.length; i++){
                    let pos = file.model.meshes[0].vertIndices[i]*3;
                    indices.push(file.model.meshes[0].verts[pos]);
                    indices.push(file.model.meshes[0].verts[pos+1]);
                    indices.push(file.model.meshes[0].verts[pos+2]);
                }

                

                malla.setIndices(file.model.meshes[0].face.vertElementIndices);
                malla.setVertices(indices);

                malla.setTexturas(file.materials[0].maps[0].file)

                malla.setDiffuse(file.materials[0].diffuse);
                malla.setSpecular(file.materials[0].specular);
                malla.setGlossiness(file.materials[0].glossiness)

                return malla;

            default:
                archivo = await this.leerArchivoRed('http://localhost:4200/assets/' + fichero);

                // sera una imagen jpg, png...
                this.tipoRecurso = 2;

                let miblob = await archivo.blob();
                let contenidoBase64 = await this.contenidoBase64(miblob);
                let imagen = await new Promise((resolve, reject) => {
                    let imagen = new Image();
                    imagen.onload = ()=> {
                        resolve(imagen);
                    }
                    imagen.src = String(contenidoBase64);
                })
                return imagen;


                /*let array = await archivo.arrayBuffer();
                console.log(array);
                return array*/
        }
    }

    dibujarMallas(){
        return this.totalMallas;
    }
}

