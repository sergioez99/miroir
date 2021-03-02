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

const crearDatos = async(req, res) => {

    const identificadores = ["id1", "id2", "id3", "id4", "id5"];
    const nombres = ["nom1", "nom2", "nom3", "nom4", "nom5"];
    const descripciones = ["descripcion1", "descripcion2", "descripcion3", "descripcion4", "descripcion5"];
    const tallas = ["talla1", "talla2", "talla3", "talla4", "talla5"];
    const tipos = ["usuario", "cliente"];

    let time = new Date(Date.now());
    time.setDate(time.getDate() + Math.floor((Math.random() * 90) + 1));
    let start = time;
    time.getHours(time.getHours() + Math.floor((Math.random() * 8) + 1));
    let finish = time;

    const identificador = identificadores[Math.floor((Math.random() * (identificadores.length - 1)))];
    const nombre = nombres[Math.floor((Math.random() * (nombres.length - 1)))];
    const descripcion = descripciones[Math.floor((Math.random() * (descripciones.length - 1)))];
    const talla = tallas[Math.floor((Math.random() * (tallas.length - 1)))];
    const tipo = tipos[Math.floor((Math.random() * (tipos.length - 1)))];

    const datos = {
        identificador: identificador,
        nombre: nombre,
        descripciones: descripcion,
        tallas: talla,
        time: [{
            dia: finish,
            start: start,
            finish: finish
        }],
        tipo: tipo
    };


    const nuevoDato = new Dato(datos);
    await nuevoDato.save();

    res.json({
        ok: true,
        msg: "El JSON de datos acaba de salir :)",
    });

    for (let index = 0; index < 3; index++) {
        crearDatos();
    }
}

const actualizarDatos = async(req, res = response) => {

    // aunque venga el password aqui no se va a cambiar
    // si cambia el email, hay que comprobar que no exista en la BD
    const { identificador, nombre, ...object } = req.body;
    const uid = req.params.id;
    try {
        // comprobar si existe o no existe el dato
        const existeDato = await Dato.findOne({ identificador: identificador });

        if (existeDato) {
            // si existe, miramos que sea el suyo (que no lo esta cambiando)
            if (existeDato._id != uid) {

                return res.status(400).json({
                    ok: false,
                    msg: "El dato ya existe"
                });
            }
        }
        // aqui ya se ha comprobado el identificador
        object.identificador = identificador;
        // new: true -> nos devuelve el dato actualizado
        const dato = await Dato.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'actualizarDato',
            dato
        });

    } catch (error) {
        console.log(error);

        res.status(400).json({
            ok: false,
            msg: 'Error actualizando el dato'
        });
    }

}

const borrarDatos = async(req, res = response) => {
    const uid = req.params.id;

    try {
        const existeDato = await Dato.findById(uid);

        if (!existeDato) {
            return res.status(400).json({
                ok: false,
                msg: 'El id del dato no existe'
            });
        }
        const resultado = await Dato.finByIdAndDelete(uid);
        res.json({
            ok: true,
            msg: 'Dato borrado',
            resultado: resultado
        });
    } catch (erro) {

    }

}

module.exports = {
    crearDatos,
    borrarDatos,
    actualizarDatos,
    crearUsuarios,
    crearClientes,
    crearPrendas,
}