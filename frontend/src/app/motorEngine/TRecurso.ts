import { TRecurso, Malla } from './commons';
import { ApiService } from '../services/api.service';
import { promise } from 'protractor';

export class RMalla extends TRecurso {

    //Vertices, normales, coordenadas -> aquí los buffers
    //Valores en el json -> se abre el fichero y eso 
    //Parse, con esa estructura, guardamos las cosas en la malla de aquí abajo
    //Hacer correspondencia correcta entre arrays de maya ->  arrays de buffer
    private mallas: Malla[] = [];



    constructor() {
      super();
    }

    cargarRMalla(fichero): Promise<Malla>{
        var file;

        return new Promise( (resolve, reject) =>{

            var req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    file = req.response;
                    console.log(file);

                    file = JSON.parse(file);
                    console.log(file);
                    console.log(file["positions"]);
                    var malla = new Malla();
                    malla.setVertices(file.positions);
                    malla.setNormales(file.colors);
                    malla.setIndices(file.index);
                    console.log(malla);
                    resolve(malla);
                }
            }
            req.open('GET', "http://localhost:4200/assets/"+fichero);
            req.send();
        });
    
        //leo el fichero, creo malla, añado malla
    }

    addMalla(fichero){
        this.cargarRMalla(fichero).then( (res)=>{
            this.mallas.push(res);
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
