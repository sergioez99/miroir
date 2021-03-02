const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios.model');


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

const crearDatosUsuarios = (req, res) => {

    const ruta = '../datosBaseParaGenerar/';

    let password = ["pass1", "pass2", "pass3", "pass4", "pass5", "pass6"];
    let miRol = ["ROL_USUARIO"];
    let miAlta = ["alta1", "alta2", "alta3", "alta4", "alta5", "alta6", "alta7", "alta8", "alta9"];
    let miActivo = ["true", "false"];
    let miValidado = ["true", "false"];
    let miPeso = [60, 65, 70, 75, 80, 85, 90, 95, 100];
    let miAltura = [160, 165, 170, 175, 180, 185, 190, 195, 200];
    let miPecho = [70, 75, 80, 85, 90, 95, 100];
    let miCadera = [45, 50, 55, 60];
    let miCintura = [48, 53, 58, 63];

    let time = new Date(Date.now());
    time.setDate(time.getDate() + Math.floor((Math.random() * 90) + 1));
    let start = time;
    time.getHours(time.getHours() + Math.floor((Math.random() * 8) + 1));
    let finish = time;

    Promise.all([
        leerFichero(ruta + 'email.json', email).then((res) => {
            email = res;
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

    const mail = (email[Math.floor((Math.random() * (email.length - 1)))]) + req + (email[Math.floor((Math.random() * (email.length - 1)))]);
    const pass = password[Math.floor((Math.random() * (password.length - 1)))];
    const rol = miRol;
    const alta = miAlta[Math.floor((Math.random() * (miAlta.length - 1)))];
    const activo = miActivo[Math.floor((Math.random() * (miActivo.length - 1)))];
    const validado = miValidado[Math.floor((Math.random() * (miValidado.length - 1)))];
    const peso = miPeso[Math.floor((Math.random() * (miPeso.length - 1)))];
    const altura = miAltura[Math.floor((Math.random() * (miAltura.length - 1)))];
    const pecho = miPecho[Math.floor((Math.random() * (miPecho.length - 1)))];
    const cadera = miCadera[Math.floor((Math.random() * (miCadera.length - 1)))];
    const cintura = miCintura[Math.floor((Math.random() * (miCintura.length - 1)))];

    const usuarios = {
        email: mail,
        password: pass,
        rol: rol,
        alta: alta,
        activo: activo,
        validado: validado,
        peso: peso,
        altura: altura,
        pecho: pecho,
        cadera: cadera,
        cintura: cintura,
        time: [{
            dia: finish,
            start: start,
            finish: finish
        }],
    };

    var nuevoUsuario = new Usuario(usuarios);
    console.log(nuevoUsuario);
    try {

        nuevoUsuario.save();
        console.log('guardado');

    } catch (error) {
        console.log(error);
    } finally {}
}

module.exports = {
    crearDatosUsuarios
}