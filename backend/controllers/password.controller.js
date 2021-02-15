const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Token = require('../models/validaciontoken.model');
const Usuario = require('../models/usuarios.model');

const { generarJWT } = require('../helpers/jwt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const fs = require('fs');

const recuperarPassword = async(req, res = response) => {

    try{
        //Plantilla del email de recuperación -> esperamos a coger la plantilla para que el replace no sea undefined
        var file;
        fs.readFile('assets/templates/email.html', 'utf8', function(err,data){
            if(err) console.log(err)
            file = data;
        })
        
        const email = req.params.email;
        const usuario = await Usuario.findOne( {email: req.params.email });

        if (!usuario) {
            return res.status(400).json({
                msg: 'We were unable to find a user for this email.'
            });
        }

        //PATATA pero no se como hacer q espere al buscar plantilla email damn jeez
        const usuario2 = await Usuario.findOne( {email: req.params.email });

        //Autorización OAuth2 para mandar gmail
        const oauth2Client = new OAuth2(
            "149404174892-4nt0dds6tcv01v77gilcj7lk50o34vo0.apps.googleusercontent.com", //Client ID
            "FoXUeWIK-Gm5yGqUtmKx-BVZ", // Client Secret
            "https://developers.google.com/oauthplayground" // Redirect URL
        );

        oauth2Client.setCredentials({
            refresh_token: "1//046UstTrqdKn-CgYIARAAGAQSNwF-L9IrcHglOO-_afasKEltUJYVEikfPp0LhoigrXTIRXN7_fD4uRtm_Ff1wUbXQ7iNy5QRYj0"
        });
        const accessToken = oauth2Client.getAccessToken()

        //Enviar email - creamos transporte
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

        //Mensaje personalizado + links
        //var link = 'https://miroir.ovh/recuperar/cambiarpassword';
        var link = 'localhost:4200/cambiarpassword';
        var mensaje = '<h2>¡Hola,'+usuario.email+'<h2>' +
        '<h3>¿Has olvidado tu contraseña?<h3>' +
        '<h4>Si es así, por favor, pulsa en el siguiente botón para obtener una contraseña nueva</h4>' +
        '<p><a href="'+link+'" class="btn btn-primary">Cambiar contraseña</a></p>' +
        '<h4>Si no has solicitado un cambio de contraseña, ignore este mensaje.</h4>' +
        '<h4>Si tienes problemas para cambiar tu contraseña por alguna razón, por favor, copia este enlace en tu buscador:'+link+'<h4>';
        file = file.replace('KKMENSAJEPERSONALIZADOKK', mensaje);
        
        //Opciones del email
        var mailOptions = {
            from: 'insight.abp@gmail.com',
            to: email,
            subject: 'Recuperación de contraseña',
            html: file
        };
        //Se envia el email
        transporter.sendMail(mailOptions, (error, response) => {
            error ? console.log(error) : console.log(response);
            transporter.close();
        });


    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error recuperando la contraseña'
        });
    }
}

const cambiarPassword = async(req, res = response) => {

    try{
        const email = req.body.email;
        const password = req.body.password;
        const usuario = await Usuario.findOne( {email : email} );

        if (!usuario) {
            return res.status(400).json({
                msg: 'We were unable to find a user for this email.'
            });
        }

        // generar cadena aleatoria para el cifrado
        const salt = bcrypt.genSaltSync();
        // hacer un hash de la contraseña
        const cpassword = bcrypt.hashSync(password, salt);
        usuario.password = cpassword;
        await usuario.save();


    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error cambiando la contraseña'
        });
    }
}

module.exports = {
    recuperarPassword,
    cambiarPassword
}