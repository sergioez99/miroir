 console.log("Probando nodo");

import { TNode } from './TNode.js';
//import {TCamera, TLight, TModel} from './TEntity.js';

import * as glMatrix from "./dependencies/gl-matrix";


let traslacion = glMatrix.vec3.create();
traslacion = [1, 1, 1];

let rotacion = glMatrix.vec3.create();
traslacion = [1, 1, 1];

let escalado = glMatrix.vec3.create();
traslacion = [1, 1, 1];


//creo al primer hijo
let nodo2 = new TNode([1, 2, 3], null, null, null, null, null, null);

//creo al padre del arbol
let nodo1 = new TNode([1, 2, 3], null, null, [nodo2], traslacion, rotacion, escalado);

//nodo1 es padre de nodo2
nodo2.setpadre(nodo1);

//creo el segundo hijo y lo añado 
let node3 = new TNode([1, 2, 3], nodo1, null, null, null, null, null);
nodo1.addChild(node3);

//añado al cuarto hijo y lo borro
let nodo4 = new TNode([1, 2, 3], nodo1, null, null, null, null, null);
nodo1.addChild(nodo4);
nodo1.remChild(nodo4);

let matrizAcum = (1.0, 0.0, 0.0, 0.0,  
                  0.0, 1.0, 0.0, 0.0,  
                  0.0, 0.0, 1.0, 0.0,  
                 0.0, 0.0, 0.0, 1.0);

nodo1.recorrer(matrizAcum);

console.log(nodo1);