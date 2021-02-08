const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Cliente = require('../models/clientes.model');


const obtenerClientes = async(req, res = response) => {

    //encontrar un unico Cliente
    const id = req.query.id;


    // paginacion
    // Number: tipar como numero (por si envian cosas raras)
    let desde = Number(req.query.desde) || 0;
    if (desde < 0)
        desde = 0;
    const registropp = process.env.DOCSPERPAGES;



    try {

        let clientes, total;
        // busqueda de un unico Cliente
        if (id) {

            // promesa para que se ejecuten las dos llamadas a la vez, cuando las dos acaben se sale de la promesa
            [clientes, total] = await Promise.all([
                cliente.findById(id),
                cliente.countDocuments()
            ]);
            // busqueda de varios Clientes
        } else {
            // promesa para que se ejecuten las dos llamadas a la vez, cuando las dos acaben se sale de la promesa
            [clientes, total] = await Promise.all([
                cliente.find({}).skip(desde).limit(registropp),
                cliente.countDocuments()
            ]);
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
        // comprobar que email es unico
        const exiteEmail = await Cliente.findOne({ email: email });

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
        const cliente = new Cliente(object);
        cliente.password = cpassword;

        // almacenar en la BD
        await cliente.save();

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
    const { password, alta, email, cif, ...object } = req.body;
    const uid = req.params.id;

    try {
        // comprobar si existe o no existe el Cliente
        const existeEmail = await cliente.findOne({ email: email });

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
        const existeCif = await cliente.findOne({ cif: cif });

        if (existeCif) {
            // si existe, miramos que sea el suyo (que no lo esta cambiando)
            if (existeCif._id != uid) {

                return res.status(400).json({
                    ok: false,
                    msg: "CIF ya existe"
                });
            }
        }
        // aqui ya se ha comprobado el email
        object.cif = cif;



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
        const existeCliente = await cliente.findById(uid);

        if (!existeCliente) {
            return res.status(400).json({
                ok: false,
                msg: "El Cliente no existe"
            });
        }

        // lo eliminamos y devolvemos el Cliente recien eliminado 
        const resultado = await cliente.findByIdAndDelete(uid);

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