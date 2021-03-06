const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Prenda = require('../models/prendas.model');
//KPI
const { sumarPrendaKPI, restarPrendaKPI } = require('./charts.controller');
const { infoToken } = require('../helpers/infotoken');


const obtenerPrendas = async(req, res = response) => {

    const token = req.header('x-token');

    const rol = infoToken(token).rol;
    let uid = '';
    if (rol == 'ROL_CLIENTE')
        uid = infoToken(token).uid;

    //encontrar una unica prenda
    const id = req.query.id;

    const texto = req.query.texto;
    let textoBusqueda = '';

    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }

    // paginacion
    // Number: tipar como numero (por si envian cosas raras)
    let desde = Number(req.query.desde) || 0;
    if (desde < 0)
        desde = 0;
    const registropp = Number(process.env.DOCSPERPAGE);






    try {

        let prendas, total;
        // busqueda de una unica prenda
        if (id) {

            // promesa para que se ejecuten las dos llamadas a la vez, cuando las dos acaben se sale de la promesa
            [prendas, total] = await Promise.all([
                Prenda.findById(id),
                Prenda.countDocuments()
            ]);
            // busqueda de varias prendas
        } else {
            if (uid) {
                if (texto) {

                    [prendas, total] = await Promise.all([

                        Prenda.find({
                            $and: [
                                { $or: [{ nombre: textoBusqueda }, { descripcion: textoBusqueda }] },
                                { idCliente: uid }
                            ]
                        }).skip(desde).limit(registropp),
                        Prenda.countDocuments({
                            $and: [
                                { $or: [{ nombre: textoBusqueda }, { descripcion: textoBusqueda }] },
                                { idCliente: uid }
                            ]
                        })
                    ]);

                } else {
                    // promesa para que se ejecuten las dos llamadas a la vez, cuando las dos acaben se sale de la promesa
                    [prendas, total] = await Promise.all([
                        Prenda.find({ idCliente: uid }).skip(desde).limit(registropp),
                        Prenda.countDocuments({ idCliente: uid })
                    ]);
                }
            } else {
                if (texto) {

                    [prendas, total] = await Promise.all([

                        Prenda.find({ $or: [{ nombre: textoBusqueda }, { descripcion: textoBusqueda }] }).skip(desde).limit(registropp),
                        Prenda.countDocuments({ $or: [{ nombre: textoBusqueda }, { descripcion: textoBusqueda }] })
                    ]);

                } else {
                    // promesa para que se ejecuten las dos llamadas a la vez, cuando las dos acaben se sale de la promesa
                    [prendas, total] = await Promise.all([
                        Prenda.find({}).skip(desde).limit(registropp),
                        Prenda.countDocuments()
                    ]);
                }
            }



        }
        res.json({
            ok: true,
            msg: 'getPrendas',
            prendas,
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
            msg: 'error buscando la prenda'
        });
    }
}


const crearPrenda = async(req, res) => {

    const { identificador } = req.body;

    try {
        const exiteIdentificador = await Prenda.findOne({ identificador: identificador });

        if (exiteIdentificador) {
            return res.status(400).json({
                ok: false,
                msg: 'La prenda ya existe'
            });
        }

        const prenda = new Prenda(req.body);

        await prenda.save();

        //actualizar KPI
        sumarPrendaKPI();

        res.json({
            ok: true,
            msg: 'crear una prenda',
            prenda
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error creando la prenda'
        });
    }
}

const actualizarPrenda = async(req, res = response) => {

    // aunque venga el password aqui no se va a cambiar
    // si cambia el email, hay que comprobar que no exista en la BD
    const { identificador, ...object } = req.body;
    const uid = req.params.id;
    try {
        // comprobar si existe o no existe la prenda
        const existePrenda = await Prenda.findOne({ identificador: identificador });

        if (existePrenda) {
            // si existe, miramos que sea el suyo (que no lo esta cambiando)
            if (existePrenda._id != uid) {

                return res.status(400).json({
                    ok: false,
                    msg: "La prenda ya existe"
                });
            }
        }
        // aqui ya se ha comprobado el identificador
        object.identificador = identificador;
        // new: true -> nos devuelve la prenda actualizado
        const prenda = await Prenda.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'actualizarPrenda',
            prenda
        });

    } catch (error) {
        console.log(error);

        res.status(400).json({
            ok: false,
            msg: 'Error actualizando la prenda'
        });
    }

}

const borrarPrenda = async(req, res = response) => {

    const uid = req.params.id;
    try {

        // comprobamos que ela prenda existe
        const existePrenda = await Prenda.findById(uid);

        if (!existePrenda) {
            return res.status(400).json({
                ok: false,
                msg: "La prenda no existe"
            });
        }

        // lo eliminamos y devolvemos la prenda recien eliminado
        // Remove -> se convierte en Modify en la BD
        // Delete -> deber??a ser el utilizado...?
        //DeprecationWarning: Mongoose: findOneAndUpdate() and findOneAndDelete() without the useFindAndModify option set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#findandmodify 
        const resultado = await Prenda.findByIdAndDelete(uid);

        //actualizar KPI
        restarPrendaKPI();

        res.json({
            ok: true,
            msg: "Prenda eliminada",
            resultado
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: "no se ha podido eliminar la prenda"
        });
    }

}

module.exports = {
    obtenerPrendas,
    crearPrenda,
    actualizarPrenda,
    borrarPrenda
}