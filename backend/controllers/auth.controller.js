const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarios.model');
const Cliente = require('../models/clientes.model');

const { generarJWT } = require('../helpers/jwt');
const jwt = require('jsonwebtoken');


const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // comprobar que existe el usuario
        let usuarioDB = await Usuario.findOne({ email });

        // probar en la base de datos de clientes
        if (!usuarioDB) {
            usuarioDB = await Cliente.findOne({ email });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }

        // comprobar la contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }
        // usuario y contraseña correctos

        const { _id, rol } = usuarioDB;
        // creamos el token
        const token = await generarJWT(usuarioDB._id, usuarioDB.rol);

        res.json({
            ok: true,
            msg: 'login',
            id: _id,
            rol: rol,
            token: token,
            usuario: usuarioDB
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en login',
            token: ''
        });
    }
}


const token = async(req, res = response) => {

    const token = req.headers['x-token'];

    try {
        // verify no consigue la informacion tanto si el token no es válido, como si está caducado
        const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);

        let usuarioDB;

        if (rol == 'ROL_CLIENTE') {
            usuarioDB = await Cliente.findById(uid);
        } else if (rol == "ROL_USUARIO" || rol == 'ROL_ADMIN') {
            usuarioDB = await Usuario.findById(uid);
        }


        // comprobacion de existencia de usuario
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Token no valido',
                token: ''
            });
        }

        // generamos un nuevo token para aumentar la duracion
        const nuevotoken = await generarJWT(uid, rol);

        res.json({
            ok: true,
            msg: 'Token',
            token: nuevotoken,
            usuario: usuarioDB
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error, token no valido',
            token: ''
        });
    }
}

module.exports = { login, token }