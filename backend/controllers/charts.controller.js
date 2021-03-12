const { response } = require('express');

const Usuario = require('../models/usuarios.model');
const Cliente = require('../models/clientes.model');
const Prenda = require('../models/prendas.model');
const DatoKPI = require('../models/datosGenericos.model');
const AltaUsuarios = require('../models/altaUsuarios.model');
const { infoToken } = require('../helpers/infotoken');
const mongoose = require('mongoose');


const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const salirSiUsuarioNoAdmin = (token) => {
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permiso',
        });
    }
}

const recalcularUsuariosTotales = async() => {

    try {

        const rol = 'ROL_USUARIO';
        const total = await Usuario.countDocuments({ rol: rol });

        console.log('TOTAL USUARIOS:........ ', total);

        // guardarlo en la colección de datos genéricos

        let salida = new DatoKPI();
        salida.identificador = 'total_usuarios';
        salida.datoNumber = total;

        await salida.save();

        return true;

    } catch (error) {

        console.log(error);
        return error;
    }

}

const recalcularClientesTotales = async() => {

    try {

        const total = await Cliente.countDocuments();
        console.log('TOTAL CLIENTES:........ ', total);

        // guardarlo en la colección de datos genéricos

        let salida = new DatoKPI();
        salida.identificador = 'total_clientes';
        salida.datoNumber = total;

        await salida.save();
        return true;

    } catch (error) {
        return error;
    }

}

const recalcularPrendasTotales = async() => {

    try {

        const total = await Prenda.countDocuments();
        console.log('TOTAL PRENDAS:........ ', total);

        // guardarlo en la colección de datos genéricos

        let salida = new DatoKPI();
        salida.identificador = 'total_prendas';
        salida.datoNumber = total;

        await salida.save();
        return true;

    } catch (error) {
        return error;
    }

}

const recalcularAltaUsuarios = async() => {
    try {

        //mongoose.AltaUsuarios.drop();

        const rolUsuario = 'ROL_USUARIO';

        const [usuarios, clientes] = await Promise.all(
            [
                Usuario.find({ rol: rolUsuario }),
                Cliente.find(),
            ]
        );

        if (usuarios) {
            let alta;
            for (let i = 0; i < usuarios.length; i++) {
                alta = usuarios[i].alta;

                console.log(alta);

                /* let db = await AltaUsuarios.findOne({ fecha: fecha });

                if (!db) {
                    db = new AltaUsuarios();
                } */

            }

        }




/* 

        console.log('USUARIOS:........ ', usuarios);
        console.log('CLIENTES:........ ', clientes); */

        // guardarlo en la colección de datos genéricos

        return true;

    } catch (error) {
        return error;
    }
}

const obtenerUsuariosFecha = (req, res = response) => {

    salirSiUsuarioNoAdmin(req.header('x-token'));

    // como no lo tengo, calcular la tabla de datos
    recalcularAltaUsuarios();

}

const obtenerTodosUsuarios = async(req, res = response) => {

    salirSiUsuarioNoAdmin(req.header('x-token'));

    const texto = req.query.texto;
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
    }

    await sleep(100);

    try {


        let usuarios, total;
        // busqueda de un unico usuario


        if (texto) {
            [usuarios, total] = await Promise.all([
                Usuario.find({ rol: textoBusqueda }).sort('alta', 1),
                Usuario.countDocuments({ rol: textoBusqueda })
            ]);
        } else {
            // promesa para que se ejecuten las dos llamadas a la vez, cuando las dos acaben se sale de la promesa
            [usuarios, total] = await Promise.all([
                Usuario.find({}),
                Usuario.countDocuments()
            ]);
        }

        return res.json({
            ok: true,
            msg: 'getUsuarios',
            usuarios,
            total
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error buscando el usuario'
        });
    }
}


const obtenerTodosClientes = async(req, res = response) => {

    salirSiUsuarioNoAdmin(req.header('x-token'));

    const texto = req.query.texto;
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
    }

    await sleep(100);

    try {


        let usuarios, total;
        // busqueda de un unico usuario

        // pruebas que no funcionan
        //$and: [{ rol: textoBusqueda }, created_at: { $gte: "Mon May 30 18:47:00 +0000 2015", $lt: "Sun May 30 20:40:36 +0000 2010" }]
        if (texto) {
            [usuarios, total] = await Promise.all([
                Cliente.find({ rol: textoBusqueda }).sort('alta', 1),
                Cliente.countDocuments({ rol: textoBusqueda })
            ]);
        } else {
            // promesa para que se ejecuten las dos llamadas a la vez, cuando las dos acaben se sale de la promesa
            [usuarios, total] = await Promise.all([
                Cliente.find({}),
                Cliente.countDocuments()
            ]);
        }

        return res.json({
            ok: true,
            msg: 'getUsuarios',
            clientes: usuarios,
            total
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error buscando el usuario'
        });
    }
}



module.exports = {
    obtenerTodosUsuarios,
    obtenerTodosClientes,
    obtenerUsuariosFecha,
}