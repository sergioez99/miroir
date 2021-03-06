const { response } = require('express');
const bcrypt = require('bcryptjs');
require('dotenv').config();
//const validator = require('validator');
//const Prenda = require('../models/prendas.model');

const { v4: uuidv4 } = require('uuid');
const { actualizarBD } = require('../helpers/actualizarbd');
const fs = require('fs');


const subirArchivo = async(req, res = response) => {
    //comprobamos si ha llegado algo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha enviado el archivo',
        });
    }
    //comprobamos si el archivo no se ha saltado la condicion de 
    //la propiedad abortOnLimit del index.js (superar el tamanyo max,
    //de momento lo tenemos como variable global con valor=5)

    if (req.files.archivo.truncated) {
        return res.status(400).json({
            ok: false,
            msg: `El archivo es demasiado grande: Límite hasta ${process.env.MAXSIZEUPLOAD}MB `,
        });
    }

    const tipo = req.params.tipo; //fotoperfil o prendas
    const id = req.params.id;
    //extensiones que permitimos
    const archivosValidos = {
        fotoperfil: ['jpg', 'jpeg', 'png'],
        prenda: ['obj', 'jpg', 'jpeg', 'png']
    }

    //comprobamos el nombre del archivo y nos fijamos en su extension
    const archivo = req.files.archivo;
    //devuelve un array con cada una de estas partes
    const nombrePartido = archivo.name.split('.');
    //cogemos el ultimo
    const extension = nombrePartido[nombrePartido.length - 1];

    switch (tipo) {
        case 'fotoperfil':
            //si la extension no esta dentro del array
            if (!archivosValidos.fotoperfil.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    msg: `El tipo de archivo'${extension}' no está permitido. Los archivos permitidos son: (${archivosValidos.fotoperfil})`
                });
            }
            break;

        case 'prenda':
            //si la extension no esta dentro del array
            if (!archivosValidos.prenda.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    msg: `El tipo de archivo'${extension}' no está permitido. Los archivos permitidos son: (${archivosValidos.prenda})`
                });
            }
            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: `El tipo de operación no está permitida`,
                tipoOperacion: tipo
            });
            break;
    }

    const path = `${process.env.PATHUPLOAD}/${tipo}`;
    const nombreArchivo = `${uuidv4()}.${extension}`
        // path con su ruta base/carpeta para cada tipo/nombre dea archivo unico/extension
    const patharchivo = `${path}/${nombreArchivo}`;

    //almacenamos el archivo en la base de datos
    //console.log('mmmm hola ???' + patharchivo);
    archivo.mv(patharchivo, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: `No se ha podido cargar el archivo`,
                tipoOperacion: tipo
            });
        }
    });

    //una vez cargado el archivo en nuestro sistema, 
    //actualizamos la base de datos
    actualizarBD(tipo, path, nombreArchivo, id)
        .then(valor => {
            //controlar valor
            if (!valor) {
                //si hay error primero antes de salir eliminamos la imagen
                fs.unlinkSync(patharchivo);

                return res.status(400).json({
                    ok: false,
                    msg: `No se ha podido actualizar la BD`,
                });
            } else {
                res.json({
                    ok: true,
                    msg: 'subirArchivo',
                    nombreArchivo
                });
            }
        }).catch(error => {

            fs.unlinkSync(patharchivo);
            return res.status(400).json({
                ok: false,
                msg: `Error al cargar el archivo`,
            });
        });
}

const enviarArchivo = async(req, res = response) => {

    const tipo = req.params.tipo; //fotoperfil o prendas
    const nombreArchivo = req.params.nombreArchivo;

    const path = `${process.env.PATHUPLOAD}/${tipo}`;

    // path con su ruta base/carpeta para cada tipo/nombre dea archivo unico/extension
    patharchivo = `${path}/${nombreArchivo}`;

    //comprobar si existe el archivo
    if (!fs.existsSync(patharchivo)) {
        if (tipo !== 'fotoperfil') {
            return res.status(400).json({
                ok: false,
                msg: 'El archivo no existe',
            });
        }
        patharchivo = `${process.env.PATHUPLOAD}/sinImagen.png`;
    }
    //si todo bien lo enviamos
    res.sendFile(patharchivo);
}

module.exports = { subirArchivo, enviarArchivo }