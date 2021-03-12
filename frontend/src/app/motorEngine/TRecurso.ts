import { TRecurso, Malla } from './commons';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { promise } from 'protractor';
import { ApiService } from '../services/api.service';

export class RMalla extends TRecurso {

    //Vertices, normales, coordenadas -> aquí los buffers
    //Valores en el json -> se abre el fichero y eso 
    //Parse, con esa estructura, guardamos las cosas en la malla de aquí abajo
    //Hacer correspondencia correcta entre arrays de maya ->  arrays de buffer
    private mallas: Malla[] = [];
    //private http: HttpClient = new HttpClient();


    constructor() {
      super();
    }

    async cargar(nombre:string) {
        let datos;
        datos = await this.cargarRMalla(nombre);
        console.log(nombre,':',datos);
        return datos;
    }

    async cargarArchivos() {
        await Promise.all([
          this.cargar('cubo.json'),
          this.cargar('cubetexture.png')
        ]).then(res => {
            
            this.mallas.push(res[0]);
            this.mallas.push(res[1]);
        })
        console.log(this.mallas);
        console.log('terminar cargarArchivos');
    }

    cargarRMalla(fichero): Promise<Malla>{
        var file, malla;
        malla = new Malla();

        return new Promise( (resolve, reject) =>{

            var req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    file = req.response;

                    var splitted = fichero.split(".", 2);
                    
                    if(splitted[1] == "json"){
                        file = JSON.parse(file);
                        malla.setVertices(file.positions);
                        malla.setCoordtex(file.textureCoordinates);
                        malla.setNormales(file.vertexNormals);
                        malla.setIndices(file.index);
                    }
                    else if (splitted[1] == "png" || splitted[1] == "jpg" || splitted[1] == "jpeg" || splitted[1] == "bmp"){
                        var imagen = new Image();
                        imagen.src = "http://localhost:4200/assets/"+fichero;
                        malla.setTexturas(imagen);
                    }
                    resolve(malla);
                }
            }
            req.open('GET', "http://localhost:4200/assets/"+fichero);
            req.send();
        });
    
        //leo el fichero, creo malla, añado malla
    }

    addMalla(fichero){
        this.cargarFichero(fichero).then( (res)=>{
            this.mallas.push(<Malla>res);
            console.log(this.mallas);
        })
    }
    

    draw() {
        for(let i in this.mallas)
            this.mallas[i].draw();
    }

    getMallas(){
        return this.mallas;
    }
}

export class RTextura extends TRecurso {

    private imagenTextura;

    constructor() {
      super();
    }

    async cargar(nombre:string) {
        let datos;
        datos = await this.cargarRTextura(nombre);
        console.log(nombre,':',datos);
        return datos;
    }

    async cargarArchivos() {
        await Promise.all([
          this.cargar('cubetexture.png')
        ]).then(res => {
            this.imagenTextura = res[0];
        })
        console.log(this.imagenTextura);
        console.log('terminar cargarArchivos');
    }

    cargarRTextura(fichero): Promise<RTextura>{
        var file, textura;
        textura = new RTextura();

        return new Promise( (resolve, reject) =>{

            var req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    file = req.response;

                    var splitted = fichero.split(".", 2);
                    
                    if (splitted[1] == "png" || splitted[1] == "jpg" || splitted[1] == "jpeg" || splitted[1] == "bmp"){
                        var imagen = new Image();
                        imagen.src = "http://localhost:4200/assets/"+fichero;
                        textura.setImagen(imagen);
                    }
                    resolve(textura);
                }
            }
            req.open('GET', "http://localhost:4200/assets/"+fichero);
            req.send();
        });
    
    }

    getImagen(){
        return this.imagenTextura;
    }
}

export class RShader extends TRecurso {

    private vShader: String;
    private fShader: String;

    constructor() {
      super();
    }

    /*async cargar(nombre:string) {
        let datos;
        datos = await this.cargarRTextura(nombre);
        console.log(nombre,':',datos);
        return datos;
    }

    async cargarArchivos() {
        await Promise.all([
          this.cargar('cubetexture.png')
        ]).then(res => {
            this.imagenTextura = res[0];
        })
        console.log(this.imagenTextura);
        console.log('terminar cargarArchivos');
    }

    cargarRTextura(fichero): Promise<RTextura>{
        var file, shader;

        return new Promise( (resolve, reject) =>{

            var req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    file = req.response;

                    var splitted = fichero.split(".", 2);
                    
                    if (splitted[1] == "glsl"){
                        var imagen = new Image();
                        imagen.src = "http://localhost:4200/assets/"+fichero;
                        textura.setImagen(imagen);
                    }
                    resolve(textura);
                }
            }
            req.open('GET', "http://localhost:4200/assets/"+fichero);
            req.send();
        });
    
    }*/

    getVShader(){
        return this.vShader;
    }
    getFShader(){
        return this.fShader;
    }
}
