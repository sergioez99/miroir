const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarios.model');
const Cliente = require('../models/clientes.model');
const Token = require('../models/validaciontoken.model');
const { infoToken } = require('../helpers/infotoken');


const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const siUsuarioEsAdmin = (token) => {
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permiso',
        });
    }
}



const obtenerTodosUsuarios = async(req, res = response) => {

    siUsuarioEsAdmin(req.header('x-token'));

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

    siUsuarioEsAdmin(req.header('x-token'));

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
}