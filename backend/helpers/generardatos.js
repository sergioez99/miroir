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

const crearDatos = async(req, res) => {

    const identificadores = ["id1", "id2", "id3", "id4", "id5"];
    const nombres = ["nom1", "nom2", "nom3", "nom4", "nom5"];
    const descripciones = ["descripcion1", "descripcion2", "descripcion3", "descripcion4", "descripcion5"];
    const tallas = ["talla1", "talla2", "talla3", "talla4", "talla5"];
    const tipos = ["usuario", "cliente"];
    const unic = uuidv4();



    let time = new Date(Date.now());
    time.setDate(time.getDate() + Math.floor((Math.random() * 90) + 1));
    let start = time;
    time.getHours(time.getHours() + Math.floor((Math.random() * 8) + 1));
    let finish = time;

    const identificador = identificadores[Math.floor((Math.random() * (identificadores.length - 1)))];
    const nombre = nombres[Math.floor((Math.random() * (nombres.length - 1)))];
    const descripcion = descripciones[Math.floor((Math.random() * (descripciones.length - 1)))];
    const talla = tallas[Math.floor((Math.random() * (tallas.length - 1)))];
    const tipo = tipos[Math.floor((Math.random() * (tipos.length - 1)))];

    const datos = {
        identificador: identificador,
        nombre: nombre,
        descripciones: descripcion,
        tallas: talla,
        time: [{
            dia: finish,
            start: start,
            finish: finish
        }],
        tipo: tipo
    };

    try {
        const nuevoDato = new Dato(datos);
        await nuevoDato.save();
        console.log(nuevoDato);

    } catch {
        console.log(nuevoDato);
    } finally {

    }
}
for (let index = 0; index < 3; index++) {
    crearDatos();
}