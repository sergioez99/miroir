const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Cliente = require('../models/clientes.model');
const Usuario = require('../models/usuarios.model');
const Token = require('../models/validaciontoken.model');

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

//KPI
const { sumarClienteKPI, restarClienteKPI, insertarfechahoraUsuarioCliente } = require('./charts.controller');


const obtenerClientes = async(req, res = response) => {

    //encontrar un unico Cliente
    const id = req.query.id;

    const texto = req.query.texto;
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        //console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }
    await sleep(100);
    // paginacion
    // Number: tipar como numero (por si envian cosas raras)
    let desde = Number(req.query.desde) || 0;
    if (desde < 0)
        desde = 0;
    const registropp = Number(process.env.DOCSPERPAGE);



    try {

        let clientes, total;
        // busqueda de un unico Cliente
        if (id) {

            // promesa para que se ejecuten las dos llamadas a la vez, cuando las dos acaben se sale de la promesa
            [clientes, total] = await Promise.all([
                Cliente.findById(id),
                Cliente.countDocuments()
            ]);
            // busqueda de varios Clientes
        } else {

            if (texto) {
                [clientes, total] = await Promise.all([
                    Cliente.find({ $or: [{ email: textoBusqueda }, { nombre: textoBusqueda }, { nombreEmpresa: textoBusqueda }] }).skip(desde).limit(registropp),
                    Cliente.countDocuments({ $or: [{ email: textoBusqueda }, { nombre: textoBusqueda }, { nombreEmpresa: textoBusqueda }] })
                ]);
            } else {
                // promesa para que se ejecuten las dos llamadas a la vez, cuando las dos acaben se sale de la promesa
                [clientes, total] = await Promise.all([
                    Cliente.find({}).skip(desde).limit(registropp),
                    Cliente.countDocuments()

                ]);
            }
        }

        res.json({
            ok: true,
            msg: 'getClientes',
            clientes,
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
            msg: 'error buscando el cliente'
        });
    }
}

const crearCliente = async(req, res) => {

    console.log('llegamos a la funcion?');

    const { email, password } = req.body;

    try {

        var file;
        fs.readFile('assets/templates/email.html', 'utf8', function(err, data) {
            if (err) console.log(err)
            file = data;
        });


        // comprobar que email es unico
        let existeEmail = await Cliente.findOne({ email: email });

        if (!existeEmail) {
            existeEmail = await Usuario.findOne({ email: email });
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
        const cliente = new Cliente(object);
        cliente.password = cpassword;

        // almacenar en la BD
        await cliente.save();

        // actualizar KPI
        sumarClienteKPI();
        insertarfechahoraUsuarioCliente('cliente', cliente.alta);

        // creamos el token
        const verificationToken = await generarJWT(cliente._id, cliente.rol);
        const token = new Token(object);
        token.token = verificationToken;

        const oauth2Client = new OAuth2(
            "149404174892-4nt0dds6tcv01v77gilcj7lk50o34vo0.apps.googleusercontent.com", //Client ID
            "FoXUeWIK-Gm5yGqUtmKx-BVZ", // Client Secret
            "https://developers.google.com/oauthplayground" // Redirect URL
        );

        oauth2Client.setCredentials({
            refresh_token: "1//046UstTrqdKn-CgYIARAAGAQSNwF-L9IrcHglOO-_afasKEltUJYVEikfPp0LhoigrXTIRXN7_fD4uRtm_Ff1wUbXQ7iNy5QRYj0"
        });
        const accessToken = oauth2Client.getAccessToken()

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
                clientId: "149404174892-4nt0dds6tcv01v77gilcj7lk50o34vo0.apps.googleusercontent.com",
                clientSecret: "FoXUeWIK-Gm5yGqUtmKx-BVZ",
                refreshToken: "1//046UstTrqdKn-CgYIARAAGAQSNwF-L9IrcHglOO-_afasKEltUJYVEikfPp0LhoigrXTIRXN7_fD4uRtm_Ff1wUbXQ7iNy5QRYj0",
                accessToken: accessToken
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        var link = 'https://miroir.ovh/verificado/' + verificationToken;
        var mensaje = '<h2>¡Hola,' + cliente.email + '!<h2>' +
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
            msg: 'crear un Cliente',
            cliente
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error creando el cliente'
        });
    }
}

const actualizarCliente = async(req, res = response) => {

    // aunque venga el password aqui no se va a cambiar
    // si cambia el email, hay que comprobar que no exista en la BD
    const { password, alta, email, nif, ...object } = req.body;
    const uid = req.params.id;
    console.log('hola estoy en el back',req.body);
    try {
        // comprobar si existe o no existe el Cliente
        const existeEmail = await Cliente.findOne({ email: email });

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

        // comprobar si se quiere modificar el CIF  de Cliente
        const existeCif = await Cliente.findOne({ nif: nif });
        /*
        if (existeCif) {
            // si existe, miramos que sea el suyo (que no lo esta cambiando)
            if (existeCif._id != uid) {

                return res.status(400).json({
                    ok: false,
                    msg: "CIF ya existe"
                });
            }
        }*/
        // aqui ya se ha comprobado el email
        object.nif = nif;



        // new: true -> nos devuelve el Cliente actualizado
        const cliente = await Cliente.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'actualizarCliente',
            cliente
        });

    } catch (error) {
        console.log(error);

        res.status(400).json({
            ok: false,
            msg: 'Error actualizando cliente'
        });
    }

}

const borrarCliente = async(req, res = response) => {

    const uid = req.params.id;

    try {

        // comprobamos que el Cliente existe
        const existeCliente = await Cliente.findById(uid);

        if (!existeCliente) {
            return res.status(400).json({
                ok: false,
                msg: "El Cliente no existe"
            });
        }

        // lo eliminamos y devolvemos el Cliente recien eliminado 
        const resultado = await Cliente.findByIdAndDelete(uid);

        //actualizar KPI
        restarClienteKPI();

        res.json({
            ok: true,
            msg: "Cliente eliminado",
            resultado
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: "no se ha podido eliminar el Cliente"
        });
    }

}

module.exports = {
    obtenerClientes,
    crearCliente,
    actualizarCliente,
    borrarCliente
}