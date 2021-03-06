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
        ]).then(res => {
            /*//Posicion 0 -> primer archivo cargado
            var malla = new Malla();
            malla.setVertices(res[0].positions);
            malla.setNormales(res[0].colors);
            malla.setIndices(res[0].index);
            */
            this.mallas.push(res[0]);
        })
    
        console.log('terminar cargarArchivos');
    }

    cargarRMalla(fichero): Promise<Malla>{
        var file;

        return new Promise( (resolve, reject) =>{

            var req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    file = req.response;

                    file = JSON.parse(file);
                    var malla = new Malla();
                    malla.setVertices(file.positions);
                    malla.setNormales(file.colors);
                    malla.setIndices(file.index);
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

    async getMallas(){
        await this.cargarArchivos();
        return this.mallas;
    }
}
