const { v4: uuidv4 } = require('uuid');
const Usuario = require('../models/usuarios.model');
const Cliente = require('../models/clientes.model');
const Prenda = require('../models/prendas.model');
const bcrypt = require('bcryptjs');
const { response } = require("express");
//para cargar las variables de entorno del configdb.js
require('dotenv').config({ path: '../.env' });
console.log(process.env.DBCONNECTION);

//conexion a la BD
const { dbConnection } = require('../database/configdb');
dbConnection();



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
            resolve(res);
            return salida.data;
        });
    });
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

                // generar cadena aleatoria para el cifrado
                const salt = bcrypt.genSaltSync();
                // hacer un hash de la contraseña
                const cpassword = bcrypt.hashSync(pass, salt);
                // cambiar la contraseña por la cifrada
                nuevoUsuario.password = cpassword;


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
    let descr = [" de verano", " de invierno", " de primavera", " de otoño"];
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
            const nombre = nom[Math.floor((Math.random() * (nom.length - 1)))];
            const descripcion = nombre + (descr[Math.floor((Math.random() * (descr.length - 1)))]);
            const talla = ta[Math.floor((Math.random() * (ta.length - 1)))][0];;

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


const generarClientes = async(cantidad) => {

    let e = ['id1', 'id2', 'id3'];
    let mail = ['@gmail.com', '@hotmail.com', '@asdf.com'];
    let password = ["pass1", "pass2", "pass3"];
    let miRol = ["ROL_CLIENTE"];
    let miAlta = new Date(Date.now());
    let miActivo = ["true", "false"];
    let miValidado = ["true", "false"];

    let nombres = ['nombre1', 'nombre2', 'nombre3'];
    let nombresEmpresa = ['nombre1', 'nombre2', 'nombre3'];
    let nifs = ['11111111A', '22222222B', '33333333C'];
    let telefonos = ['+34999555111', '999666333', '+35319609854'];



    const ruta = './datosBaseParaGenerar/';
    Promise.all([
        leerFichero(ruta + 'nombres.json', e).then((res) => {
            e = res;
            nombres = res;
        }),
        leerFichero(ruta + 'email.json', mail).then((res) => {
            mail = res;
        }),
        leerFichero(ruta + 'password.json', password).then((res) => {
            password = res;
        }),
        leerFichero(ruta + 'nombreEmpresa.json', nombresEmpresa).then((res) => {
            nombresEmpresa = res;
        }),
        leerFichero(ruta + 'nif.json', nifs).then((res) => {
            nifs = res;
        }),
        leerFichero(ruta + 'telefono.json', telefonos).then((res) => {
            telefonos = res;
        }),

    ]).then(() => {
        console.log('FICHERO DE E:.........................', e[0][0]);
        console.log('FICHERO DE NOMBRES:...................', nombres[10][0]);
        console.log('FICHERO DE EMAILS:....................', mail[1][0]);
        console.log('FICHERO DE PASSWORD:..................', password[2][0]);
        console.log('FICHERO DE NOMBRES DE EMPRESAS:.......', nombresEmpresa[20][0]);
        console.log('FICHERO DE NOMBRES DE NIF:............', nifs[20][0]);
        console.log('FICHERO DE NOMBRES DE TELEFONO:.......', telefonos[20][0]);

    }).catch(error => {
        console.log(error);

    }).finally(async() => {

        for (let i = 0; i < cantidad; i++) {

            const email = (e[Math.floor((Math.random() * (e.length - 1)))]) + i + (mail[Math.floor((Math.random() * (mail.length - 1)))]);
            const pass = password[Math.floor((Math.random() * (password.length - 1)))][0];
            const alta = miAlta.setDate(miAlta.getDate() + Math.floor((Math.random() * 90) - Math.floor((Math.random() * 120))));
            const activo = miActivo[Math.round((Math.random()))];
            const validado = miValidado[Math.round((Math.random()))];
            const nombre = nombres[Math.floor((Math.random() * (nombres.length - 1)))][0];
            const nombreEmpresa = nombresEmpresa[Math.floor((Math.random() * (nombresEmpresa.length - 1)))][0];
            const nif = nifs[Math.floor((Math.random() * (nifs.length - 1)))][0];
            const telefono = telefonos[Math.floor((Math.random() * (telefonos.length - 1)))][0];
            const rol = miRol[0];

            const cliente = {
                email: email,
                password: pass,
                alta: alta,
                activo: activo,
                validado: validado,
                nombre: nombre,
                nombreEmpresa: nombreEmpresa,
                nif: nif,
                telefono: telefono,
                rol: rol,
            };

            try {
                const nuevoCliente = new Cliente(cliente);

                // generar cadena aleatoria para el cifrado
                const salt = bcrypt.genSaltSync();
                // hacer un hash de la contraseña
                const cpassword = bcrypt.hashSync(pass, salt);
                // cambiar la contraseña por la cifrada
                nuevoCliente.password = cpassword;

                await nuevoCliente.save();

            } catch (error) {
                console.log(error);
            }

        }
    });


}

module.exports = { generarUsuarios, generarPrendas, generarClientes }

/* for (let index = 0; index < 1000; index++) {
    crearDatosUsuarios(index);
} */