//const array_usuarios = ["601bf35586a6cf4e4c073c56", "60244194d9bca0360c5dac39"];
const { v4: uuidv4 } = require('uuid');
const Dato = require('../models/datos.models');
const Usuario = require('../models/usuarios.model');
const Prenda = require('../models/prendas.model');
const { response } = require("express");
//para cargar las variables de entorno del configdb.js
require('dotenv').config({ path: '../.env' });
console.log(process.env.DBCONNECTION);

//conexion a la BD
const { dbConnection } = require('../database/configdb');
//const { crearDatosUsuarios } = require('../controllers/datosUsuarios.controller');
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

    const ruta = './datosBaseParaGenerar/';

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
    // const nuevoDato = new Dato(datos);
    console.log(nuevoDato);
    try {
        nuevoDato.save();
        console.log('guardado');
    } catch (error) {
        console.log(error);
    } finally {}
}

const generarUsuarios = async(cantidad) => {

    console.log('vamos a crear un usuario: ', cantidad);

    let e = ['id1', 'id2', 'id3'];
    let mail = ['@gmail.com', '@hotmail.com', '@asdf.com'];
    let password = ["pass1", "pass2", "pass3"];
    let miRol = ["ROL_USUARIO"];
    let miAlta = new Date(Date.now());
    let miActivo = ["true", "false"];
    let miValidado = ["true", "false"];

    let miPeso = [20, 200];
    let miAltura = [20, 200];
    let miPecho = [20, 200];
    let miCadera = [20, 200];
    let miCintura = [20, 200];

    const ruta = './datosBaseParaGenerar/';
    Promise.all([
        leerFichero(ruta + 'nombres.json', e).then((res) => {
            e = res;
        }),
        leerFichero(ruta + 'email.json', mail).then((res) => {
            mail = res;
        }),
        leerFichero(ruta + 'password.json', password).then((res) => {
            password = res;
        }),

    ]).then(() => {
        console.log('FICHERO DE NOMBRES:...................', e[0][0]);
        console.log('FICHERO DE EMAILS:....................', mail[1][0]);
        console.log('FICHERO DE PASSWORD:..................', password[2][0]);

    }).catch(error => {
        console.log(error);

    }).finally(async() => {

        for (let i = 0; i < cantidad; i++) {

            const email = (e[Math.floor((Math.random() * (e.length - 1)))]) + i + (mail[Math.floor((Math.random() * (mail.length - 1)))]);
            const pass = password[Math.floor((Math.random() * (password.length - 1)))][0];
            const rol = miRol[0];
            const alta = miAlta.setDate(miAlta.getDate() + Math.floor((Math.random() * 90) + Math.floor((Math.random() * 180))));
            const activo = miActivo[Math.round((Math.random()))];
            const validado = miValidado[Math.round((Math.random()))];

            const peso = Math.floor(Math.random() * (miPeso[1] - miPeso[0])) + miPeso[0];
            const altura = Math.floor(Math.random() * (miAltura[1] - miAltura[0])) + miAltura[0];
            const pecho = Math.floor(Math.random() * (miPecho[1] - miPecho[0])) + miPecho[0];
            const cadera = Math.floor(Math.random() * (miCadera[1] - miCadera[0])) + miCadera[0];
            const cintura = Math.floor(Math.random() * (miCintura[1] - miCintura[0])) + miCintura[0];

            const usuarios = {
                email: email,
                password: pass,
                rol: rol,
                alta: alta,
                activo: activo,
                validado: validado,
                peso: peso,
                altura: altura,
                pecho: pecho,
                cadera: cadera,
                cintura: cintura
            };

            try {
                const nuevoUsuario = new Usuario(usuarios);
                await nuevoUsuario.save();
                console.log('Usuario almacenado en la BD');

            } catch (error) {
                console.log(error);
            }

        }
    });


}

const generarPrendas = async(cantidad) => {

    console.log('vamos a crear una prenda: ', cantidad);

    let id = ['id1', 'id2', 'id3'];
    let nom = ['camiseta', 'camisa', 'sudadera', 'pantalon'];
    let descr = ["camisa de verano", "camisa de invierno", "camisa de primavera", "camisa de otoño", "camiseta de verano", "camiseta de invierno", "camiseta de primavera", "camiseta de otoño", "sudadera de verano", "sudadera de invierno", "sudadera de primavera", "sudadera de otoño", "pantalon de verano", "pantalon de invierno", "pantalon de primavera", "pantalon de otoño"];
    let ta = ["XS", "S", "M", "L", "XL"];

    const ruta = './datosBaseParaGenerar/';

    Promise.all([
        leerFichero(ruta + 'identificador.json', id).then((res) => {
            id = res;
        }),
        leerFichero(ruta + 'nombres.json', nom).then((res) => {
            nombres = res;
        }),

    ]).then(() => {
        console.log('FICHERO DE IDs:...................', id[0][0]);
        console.log('FICHERO DE NOMBRES:....................', nombres[1][0]);

    }).catch(error => {
        console.log(error);

    }).finally(async() => {

        for (let i = 0; i < cantidad; i++) {

            const identificador = (id[Math.floor((Math.random() * (id.length - 1)))]) + i;
            const nombre = nom[Math.floor((Math.random() * (nom.length - 1)))][0];
            const descripcion = descr[Math.round((Math.random()))];
            const talla = ta[Math.round((Math.random()))];

            const prendas = {
                identificador: identificador,
                nombre: nombre,
                descripcion: descripcion,
                talla: talla
            };

            try {
                const nuevaPrenda = new Prenda(prendas);
                await nuevaPrenda.save();
                console.log('Prenda almacenada en la BD');

            } catch (error) {
                console.log(error);
            }
        }
    });
}

module.exports = { generarUsuarios, generarPrendas }

/* for (let index = 0; index < 1000; index++) {
    crearDatosUsuarios(index);
} */


// let nombres = leerFichero('../datosBaseParaGenerar/nombres.json');

//console.log(nombres);