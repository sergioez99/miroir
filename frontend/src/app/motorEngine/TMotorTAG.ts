import { TNode } from "./TNode";
import { gestorRecursos } from "./gestorRecursos";
import * as matrix from 'gl-matrix';
import { ECamera, ELight, EModel } from "./TEntity";
import { TEntity } from "./commons";

export class TMotorTAG {

    private raiz: TNode;
    private gestorRecursos: gestorRecursos;

    private registroCamaras: TNode[];
    private registroLuces: TNode[];
    private registroViewports: TNode[];
    private camaraActiva: number;
    private viewportActivo: number;
    private lucesActivas: boolean[];



    constructor(){
        this.raiz = new TNode(null, null, null, null, null, null, null);
        this.gestorRecursos = new gestorRecursos();
    }

    crearNodo(padre:TNode, trasl:matrix.vec3, rot:matrix.vec3, esc:matrix.vec3) {
        if(padre == null)
            padre = this.raiz;

        var nuevo = new TNode(null, padre, null, null, trasl, rot, esc);
        nuevo.changeActuMatriz();
        padre.addChild(nuevo);

        return nuevo;
    }
    crearCamara(padre:TNode, trasl:matrix.vec3, rot:matrix.vec3, esc:matrix.vec3, esPerspectiva, cercano, lejano, derecha, izquierda, superior, inferior) {
        if(padre == null)
            padre = this.raiz;
        var nuevo = new TNode(null, padre, null, null, trasl, rot, esc);
        nuevo.changeActuMatriz();
        padre.addChild(nuevo);

        var entidad = new ECamera(esPerspectiva, cercano, lejano, derecha, izquierda, superior, inferior);

        nuevo.setentidad(entidad);

        return nuevo;
    }
    crearLuz(padre:TNode, trasl:matrix.vec3, rot:matrix.vec3, esc:matrix.vec3, tipo, intensidad, apertura, atenAngular, atenCte, atenLineal, atenCuadrat) {
        if(padre == null)
            padre = this.raiz;
        var nuevo = new TNode(null, padre, null, null, trasl, rot, esc);
        nuevo.changeActuMatriz();
        padre.addChild(nuevo);

        var entidad = new ELight(tipo, intensidad, apertura, atenAngular, atenCte, atenLineal, atenCuadrat);

        nuevo.setentidad(entidad);

        return nuevo;

    }
    async crearModelo(padre:TNode, trasl:matrix.vec3, rot:matrix.vec3, esc:matrix.vec3, fichero, textura) {
        if(padre == null)
            padre = this.raiz;
        var nuevo = new TNode(null, padre, null, null, trasl, rot, esc);
        nuevo.changeActuMatriz();
        padre.addChild(nuevo);

        var malla = await this.gestorRecursos.getRecurso(fichero);

        //hay que ver si me pasan un fichero y creo aqui la malla o me pasan una malla directamente
        var entidad = new EModel();
        entidad.setMalla(malla);
        

        nuevo.setentidad(entidad);

        return nuevo;
    }

    dibujarEscena(){
        var matrizId = matrix.mat4.create();

        for (var i = 0; i < this.registroLuces.length; i++) {
            if(this.lucesActivas[i] == true){
                var matrizLuz = this.registroLuces[i].getTransformMatrix();
                //Decirle a gl que use las luces (buscar)
            }  
        }
        var cameraMatrix = this.registroCamaras[this.camaraActiva].getTransformMatrix();
        var viewMatrix = matrix.mat4.create();
        matrix.mat4.invert(viewMatrix, cameraMatrix);
        //Pasarle la matriz a gl (set el uniform de la matriz aquí)
        //Dudassss de como hacer el viewport
    }

    registrarCamara(cam:TNode){
        this.registroCamaras.push(cam);
    }
    setCamaraActiva(nCamara:number){
        this.camaraActiva = nCamara;
    }

    registrarLuz(luz:TNode){
        this.registroLuces.push(luz);
    }
    setLuzActiva(nLuz:number, activa:boolean) {
        this.lucesActivas[nLuz] = activa;
    }

    registrarViewport(x:number, y:number, alto:number, ancho:number){
        //esto no lo entiendo
    }
    setViewportActivo(nViewport:number){
        this.viewportActivo = nViewport;
    }
}
