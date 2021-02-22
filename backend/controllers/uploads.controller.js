const { response } = require('express');
const bcrypt = require('bcryptjs');
require('dotenv').config();
//const validator = require('validator');
//const Prenda = require('../models/prendas.model');

const { v4: uuidv4 } = require('uuid');


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

    // path con su ruta base/carpeta para cada tipo/nombre dea archivo unico/extension
    const patharchivo = `${process.env.PATHUPLOAD}/${tipo}/${uuidv4()}.${extension}`;
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
    res.json({
        ok: true,
        msg: 'subirArchivo'
    });
}

const enviarArchivo = async(req, res = response) => {

    res.json({
        ok: true,
        msg: 'enviarArchivo',

    });
}

module.exports = { subirArchivo, enviarArchivo }