const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarios.model');


const obtenerUsuarios = async(req, res = response) => {

    //encontrar un unico usuario
    const id = req.query.id;


    // paginacion
    // Number: tipar como numero (por si envian cosas raras)
    let desde = Number(req.query.desde) || 0;
    if (desde < 0)
        desde = 0;
    const registropp = process.env.DOCSPERPAGES;



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
            // promesa para que se ejecuten las dos llamadas a la vez, cuando las dos acaben se sale de la promesa
            [usuarios, total] = await Promise.all([
                Usuario.find({}).skip(desde).limit(registropp),
                Usuario.countDocuments()
            ]);
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
        const exiteEmail = await Usuario.findOne({ email: email });

        if (exiteEmail) {
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