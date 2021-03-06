const { response } = require("express");

const { generarUsuarios, generarClientes, generarPrendas } = require('../helpers/generardatos');
const { infoToken } = require('../helpers/infotoken');
// const array_usuarios = ["601bf35586a6cf4e4c073c56", "60244194d9bca0360c5dac39"];

const crearUsuarios = async(req, res) => {


    // llamar x veces a la función del helper de crear usuarios aleatorios

    const { cantidad } = req.body;

    // restriccion de autorización
    const token = req.header('x-token');
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permiso',
        });
    }

    generarUsuarios(cantidad);

    return res.json({
        ok: true,
        msg: 'Hemos creado los datos sintéticos de usuario'
    });

}

const crearPrendas = async(req, res) => {


    // llamar x veces a la función del helper de crear usuarios aleatorios

    const { cantidad } = req.body;

    // restriccion de autorización
    const token = req.header('x-token');
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permiso',
        });
    }

    generarPrendas(cantidad);

    return res.json({
        ok: true,
        msg: 'Hemos creado los datos sintéticos de usuario'
    });

}

const crearClientes = async(req, res) => {


    // llamar x veces a la función del helper de crear usuarios aleatorios

    const { cantidad } = req.body;

    // restriccion de autorización
    const token = req.header('x-token');
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permiso',
        });
    }

    generarClientes(cantidad);

    return res.json({
        ok: true,
        msg: 'Hemos creado los datos sintéticos de usuario'
    });

}

module.exports = {
    crearUsuarios,
    crearClientes,
    crearPrendas,
}