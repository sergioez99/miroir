const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Token = require('../models/validaciontoken.model');
const Usuario = require('../models/usuarios.model');
const Cliente = require('../models/clientes.model');

const { generarJWT } = require('../helpers/jwt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const fs = require('fs');
const clientesModel = require('../models/clientes.model');

const verificarEmail = async(req, res = response) => {
    try {
        console.log('token: ', req.params.token);
        //buscamos el token de verificacion
        const token = await Token.findOne({ token: req.params.token });

        if (!token) {
            return res.status(400).json({
                type: 'not-verified',
                msg: 'We were unable to find a valid token. Your token may have expired.' + req.body.token
            });
        }
        //y su usuario asociado
        const { uid, rol, ...object } = jwt.verify(token.token, process.env.JWTSECRET);
        var usuario = await Usuario.findById(uid);
        // const usuario = await Usuario.findOne({ _id: token._userId, email: req.body.email });

        if (!usuario) {
            usuario = await Cliente.findById(uid);
        }

        if (!usuario) {
            return res.status(400).json({
                msg: 'We were unable to find a user for this token.'
            });
        }
        if (usuario.validado) {
            return res.status(400).json({
                type: 'already-verified',
                msg: 'This user has already been verified.'
            });
        }
        //cambiamos el estado de validado a verdadero y lo guardamos
        usuario.validado = true;
        await usuario.save();

        res.json({
            ok: true,
            msg: 'verificado el email del usuario',
            usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error verificando el email'
        });
    }
}


const reenviarToken = async(req, res = response) => {
    try {
        //var file = new File('../assets/templates/email.html');
        var file;
        fs.readFile('assets/templates/email.html', 'utf8', function(err,data){
            if(err) console.log(err)
            file = data;
        })
        const email = req.params.email;
        let usuario = await Usuario.findOne({ email: email });

        if (!usuario) {
            usuario = await Cliente.findOne({ email: email })
        }

        if (!usuario) {
            return res.status(400).json({
                msg: 'We were unable to find a user for this email.'
            });
        }
        if (usuario.validado) {
            return res.status(400).json({
                type: 'already-verified',
                msg: 'This user has already been verified.'
            });
        }



        //volvemos a crear el token de verificacion
        const verificationToken = await generarJWT(usuario._id, usuario.rol);
        const token = new Token();
        token.token = verificationToken;

        const oauth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID, //Client ID
            process.env.SECRET_CLIENT, // Client Secret
            "https://developers.google.com/oauthplayground" // Redirect URL
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN,
        });
        const accessToken = oauth2Client.getAccessToken();

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
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.SECRET_CLIENT,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            },
            tls: {
                rejectUnauthorized: false
            }
        });


        //var link = 'https://miroir.ovh/verificado/'+verificationToken;
        var link = 'http://localhost:4200/verificado/'+verificationToken;
        var mensaje = '<h2>¡Hola,'+usuario.email+'<h2>' +
        '<h3>¿Estás preparado para todo lo que tiene preparado Miroir para tí?<h3>' +
        '<h4>Primero, necesitas completar tu registro pinchando en el botón de abajo</h4>' +
        '<p><a href="'+link+'" class="btn btn-primary">Verificarme</a></p>' +
        '<h4>Si tienes problemas para verificar la cuenta por alguna razón, por favor, copia este enlace en tu buscador:'+link+'<h4>';
        file = file.replace('KKMENSAJEPERSONALIZADOKK', mensaje);
        

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
            msg: 'email reenviado'
        });


    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error reenviando el token'
        });
    }
}



module.exports = {
    verificarEmail,
    reenviarToken
}