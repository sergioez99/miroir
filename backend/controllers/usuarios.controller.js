const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarios.model');
const Cliente = require('../models/clientes.model');
const Token = require('../models/validaciontoken.model');
const Medidas = require('../models/medidas.model');

//KPI
const { sumarUsuarioKPI, restarUsuarioKPI, insertarfechahoraUsuarioCliente } = require('./charts.controller');

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
const { generarJWT } = require('../helpers/jwt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const fs = require('fs');
const http = require('http-server');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');

const obtenerUsuarios = async(req, res = response) => {

    const texto = req.query.texto;
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        // console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }

    //encontrar un unico usuario
    const id = req.query.id;
    await sleep(100);


    // paginacion
    // Number: tipar como numero (por si envian cosas raras)
    let desde = Number(req.query.desde) || 0;
    if (desde < 0)
        desde = 0;
    const registropp = Number(process.env.DOCSPERPAGE);

    try {


        let usuarios, total;
        // busqueda de un unico usuario
        if (id) {

            // promesa para que se ejecuten las dos llamadas a la vez, cuando las dos acaben se sale de la promesa
            [usuarios, total] = await Promise.all([
                Usuario.findById(id),
                Usuario.countDocuments()
            ]);
            // busqueda de varios usuarios
        } else {

            if (texto) {
                [usuarios, total] = await Promise.all([
                    Usuario.find({ $or: [{ email: textoBusqueda }, { rol: textoBusqueda }] }).skip(desde).limit(registropp),
                    Usuario.countDocuments({ $or: [{ email: textoBusqueda }, { rol: textoBusqueda }] })
                ]);
            } else {
                // promesa para que se ejecuten las dos llamadas a la vez, cuando las dos acaben se sale de la promesa
                [usuarios, total] = await Promise.all([
                    Usuario.find({}).skip(desde).limit(registropp),
                    Usuario.countDocuments()
                ]);
            }
        }

        res.json({
            ok: true,
            msg: 'getUsuarios',
            usuarios,
            page: {
                desde,
                registropp,
                total
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error buscando el usuario'
        });
    }
}

const crearUsuario = async(req, res) => {

    const { email, password } = req.body;

    try {
        var file;
        fs.readFile('assets/templates/email.html', 'utf8', function(err, data) {
            if (err) console.log(err)
            file = data;
        });

        let existeEmail = await Usuario.findOne({ email: email });

        if (!existeEmail) {
            existeEmail = await Cliente.findOne({ email: email });
        }

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Email ya existe'
            });
        }

        // generar cadena aleatoria para el cifrado
        const salt = bcrypt.genSaltSync();
        // hacer un hash de la contraseña
        const cpassword = bcrypt.hashSync(password, salt);


        // extraer la variable alta
        const { alta, ...object } = req.body;
        // crear objeto
        const usuario = new Usuario(object);
        usuario.password = cpassword;

        // almacenar en la BD
        await usuario.save();

        // actualizar KPI
        sumarUsuarioKPI();
        insertarfechahoraUsuarioCliente('usuario', usuario.alta);

        // creamos el token
        const verificationToken = await generarJWT(usuario._id, usuario.rol);
        const token = new Token(object);
        token.token = verificationToken;


        const oauth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID, //Client ID
            process.env.SECRET_CLIENT, // Client Secret
            "https://developers.google.com/oauthplayground" // Redirect URL
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN
        });

        const accessToken = await oauth2Client.getAccessToken();

        // guardamos el token de verificacion del email
        await token.save();
        // Enviamos el email al usuario
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: 'insight.abp@gmail.com',
                password: 'MiroirInsightABP',
                clientId: process.env.GOOGLE_CLIENT_ID, //Client ID,
                clientSecret: process.env.SECRET_CLIENT, // Client Secret
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        //var link = 'https://miroir.ovh/verificado/' + verificationToken;
        var link = 'http://localhost:4200/verificado/' + verificationToken;
        var mensaje = '<h2>¡Hola,' + usuario.email + '!<h2>' +
            '<h3>¿Estás preparado para todo lo que tiene preparado Miroir para tí?</h3>' +
            '<h4>Primero, necesitas completar tu registro pinchando en el botón de abajo</h4>' +
            '<p><a href="' + link + '" class="btn btn-primary">Verificarme</a></p>' +
            '<h4>Si tienes problemas para verificar la cuenta por alguna razón, por favor, copia este enlace en tu buscador:</h4><p>' + link + '</p>';
        file = file.replace("KKMENSAJEPERSONALIZADOKK", mensaje);

        var mailOptions = {
            from: 'insight.abp@gmail.com',
            to: email,
            subject: 'Verificación de tu cuenta en Miroir',
            html: file
        };
        transporter.sendMail(mailOptions, (error, response) => {
            error ? console.log(error) : console.log(response);
            transporter.close();
        });

        res.json({
            ok: true,
            msg: 'crear un usuario',
            usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error creando el usuario'
        });
    }
}

const actualizarUsuario = async(req, res = response) => {

    // aunque venga el password aqui no se va a cambiar
    // si cambia el email, hay que comprobar que no exista en la BD
    const { password, alta, email, ...object } = req.body;
    const uid = req.params.id;

    try {
        // comprobar si existe o no existe el usuario
        const existeEmail = await Usuario.findOne({ email: email });

        if (existeEmail) {
            // si existe, miramos que sea el suyo (que no lo esta cambiando)
            if (existeEmail._id != uid) {

                return res.status(400).json({
                    ok: false,
                    msg: "Email ya existe"
                });
            }
        }
        // aqui ya se ha comprobado el email
        object.email = email;

        // new: true -> nos devuelve el usuario actualizado
        const usuario = await Usuario.findByIdAndUpdate(uid, object, { new: true });

        // REGISTRAMOS LAS MEDIDAS EN LA COLECCION (NM)

        let nuevaMedida = new Medidas();
        nuevaMedida.id = object.id;
        nuevaMedida.peso = object.peso;
        nuevaMedida.altura = object.altura;
        nuevaMedida.pecho = object.pecho;
        nuevaMedida.cadera = object.cadera;
        nuevaMedida.cintura = object.cintura;

        await nuevaMedida.save();

        console.log('Medidas registradas en los KPI');

        res.json({
            ok: true,
            msg: 'actualizarUsuario',
            usuario
        });

    } catch (error) {
        console.log(error);

        res.status(400).json({
            ok: false,
            msg: 'Error actualizando usuario'
        });
    }

}

const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {

        // comprobamos que el usuario existe
        const existeUsuario = await Usuario.findById(uid);

        if (!existeUsuario) {
            return res.status(400).json({
                ok: false,
                msg: "El usuario no existe"
            });
        }

        // lo eliminamos y devolvemos el usuario recien eliminado
        // Remove -> se convierte en Modify en la BD
        // Delete -> debería ser el utilizado...?
        //DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#findandmodify 
        const resultado = await Usuario.findByIdAndDelete(uid);

        // actualizar KPI
        restarUsuarioKPI();

        res.json({
            ok: true,
            msg: "Usuario eliminado",
            resultado
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: "no se ha podido eliminar el usuario"
        });
    }

}

module.exports = {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}