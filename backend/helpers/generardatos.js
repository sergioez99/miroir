//const array_usuarios = ["601bf35586a6cf4e4c073c56", "60244194d9bca0360c5dac39"];
const { v4: uuidv4 } = require('uuid');
const Dato = require('../models/datos.models');
const { response } = require("express");
//para cargar las variables de entorno del configdb.js
require('dotenv').config({ path: '../.env' });
console.log(process.env.DBCONNECTION);


//conexion a la BD
const { dbConnection } = require('../database/configdb');
dbConnection();


//const array_usuarios = ["601bf35586a6cf4e4c073c56", "60244194d9bca0360c5dac39"];

const leerFichero = (fichero, res) => {

    return new Promise((resolve, reject) => {

        var fs = require('fs');

        fs.readFile(fichero, 'utf8', function(err, data) {
            if (err) {
                console.log(err);
                reject(null);
                return null;
            }
            let salida = JSON.parse(data);

            res = salida.data;
            //console.log(salida.data);
            // console.log(data);
            resolve(res);
            return salida.data;
        });


    });


}


const crearDatos = (req, res) => {

    const ruta = '../datosBaseParaGenerar/';
    /*  
        const identificadores = ["id1", "id2", "id3", "id4", "id5"];
        const final = ['@gmail.com', '@hotmail.com', '@asdf.com'];
        const nombres = ["nombre1", "nombre2", "nombre3"];
        const descripciones = ["descripcion1", "descripcion2", "descripcion3", "descripcion4", "descripcion5"];
        const tallas = ["talla1", "talla2", "talla3", "talla4", "talla5"];
        const tipos = ["usuario", "cliente"]; 
    */
    // const unic = uuidv4();

    let identificadores = ["id1", "id2", "id3", "id4", "id5"];
    let final = ['@gmail.com', '@hotmail.com', '@asdf.com'];
    let nombres = ["nombre1", "nombre2", "nombre3"];
    let descripciones = ["descripcion1", "descripcion2", "descripcion3", "descripcion4", "descripcion5"];
    let tallas = ["talla1", "talla2", "talla3", "talla4", "talla5"];
    let tipos = ["usuario", "cliente"];



    Promise.all([
        leerFichero(ruta + 'nombres.json', nombres).then((res) => {
            nombres = res;
        }),
        leerFichero(ruta + 'nombres.json', identificadores).then((res) => {
            identificadores = res;
        })

    ]).then(() => {


        console.log(nombres[0][0]);
        console.log(identificadores[1][0]);
    }).catch(error => {
        console.log(error);
    });


    let time = new Date(Date.now());
    time.setDate(time.getDate() + Math.floor((Math.random() * 90) + 1));
    let start = time;
    time.getHours(time.getHours() + Math.floor((Math.random() * 8) + 1));
    let finish = time;

    const identificador = (identificadores[Math.floor((Math.random() * (identificadores.length - 1)))]) + req + (final[Math.floor((Math.random() * (identificadores.length - 1)))]);
    const nombre = nombres[Math.floor((Math.random() * (nombres.length - 1)))];
    const descripcion = descripciones[Math.floor((Math.random() * (descripciones.length - 1)))];
    const talla = tallas[Math.floor((Math.random() * (tallas.length - 1)))];
    const tipo = tipos[Math.floor((Math.random() * (tipos.length - 1)))];

    const datos = {
        identificador: identificador,
        nombre: nombre,
        descripcion: descripcion,
        talla: talla,
        time: [{
            dia: finish,
            start: start,
            finish: finish
        }],
        tipo: tipo
    };

    const nuevoDato = new Dato(datos);

    console.log(nuevoDato);

    try {

        nuevoDato.save();
        console.log('guardado');

    } catch (error) {
        console.log(error);
    } finally {

    }
}

for (let index = 0; index < 1; index++) {
    crearDatos(index);
}

// let nombres = leerFichero('../datosBaseParaGenerar/nombres.json');

//console.log(nombres);