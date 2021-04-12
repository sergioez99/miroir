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


    draw() {
        for(let i in this.mallas)
            this.mallas[i].draw();
    }
    
    addMallas(malla){
        this.mallas.push(malla);
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

    setImagen(imagen){
        this.imagenTextura = imagen;
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

    getVShader(){
        return this.vShader;
    }
    getFShader(){
        return this.fShader;
    }
}
