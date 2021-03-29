const { response } = require('express');

const Usuario = require('../models/usuarios.model');
const Cliente = require('../models/clientes.model');
const Prenda = require('../models/prendas.model');
const DatoKPI = require('../models/datosGenericos.model');
const fechaAlta = require('../models/fechaAlta.model');
const horaAlta = require('../models/horaAlta.model');
const prendasUsadas = require('../models/prendasUsadas.model');
const { infoToken } = require('../helpers/infotoken');

// PARA BORRAR PORQUE DE MOMENTO NO SE USA
const sleep = (ms) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
    // ---------------------------------------


const salirSiUsuarioNoAdmin = (token) => {
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permiso',
        });
    }
}



const recalcularUsuariosTotales = async() => {

    try {

        const rol = 'ROL_USUARIO';
        const total = await Usuario.countDocuments({ rol: rol });

        console.log('TOTAL USUARIOS:........ ', total);

        // guardarlo en la colección de datos genéricos

        let salida = new DatoKPI();
        salida.identificador = 'total_usuarios';
        salida.datoNumber = total;

        await salida.save();

        return true;

    } catch (error) {

        console.log(error);
        return error;
    }

}

const recalcularClientesTotales = async() => {

    try {

        const total = await Cliente.countDocuments();
        console.log('TOTAL CLIENTES:........ ', total);

        // guardarlo en la colección de datos genéricos

        let salida = new DatoKPI();
        salida.identificador = 'total_clientes';
        salida.datoNumber = total;

        await salida.save();
        return true;

    } catch (error) {
        return error;
    }

}

const recalcularPrendasTotales = async() => {

    try {

        const total = await Prenda.countDocuments();
        console.log('TOTAL PRENDAS:........ ', total);

        // guardarlo en la colección de datos genéricos

        let salida = new DatoKPI();
        salida.identificador = 'total_prendas';
        salida.datoNumber = total;

        await salida.save();
        return true;

    } catch (error) {
        return error;
    }

}

const recalcularfechahoraAlta = async() => {
    try {
        const salida = await fechaAlta.deleteMany();
        console.log(salida);
        await horaAlta.remove();
        let docs = [];
        for (let i = 0; i < 24; i++) {
            let hora = new horaAlta();
            hora.hora = i;
            docs.push(hora);
        }
        horaAlta.insertMany(docs);

        const rolUsuario = 'ROL_USUARIO';

        const [usuarios, clientes] = await Promise.all(
            [
                Usuario.find({ rol: rolUsuario }).sort({ alta: 1 }),
                Cliente.find().sort({ alta: 1 }),
            ]
        );

        let max = usuarios.length > clientes.length ? usuarios.length : clientes.length;

        if (usuarios || clientes) {
            let alta, fecha, db;
            for (let i = 0; i < max; i++) {

                if (i < usuarios.length) {
                    alta = usuarios[i].alta || null;

                    if (alta) {
                        fecha = new Date(alta.getFullYear(), alta.getMonth() + 1, alta.getDate());
                        db = await fechaAlta.findOne({ fecha: fecha });

                        if (!db) {
                            db = new fechaAlta();
                            db.fecha = fecha;
                            db.datoUsuarios = 0;
                            db.datoClientes = 0;
                        }
                        db.datoUsuarios++;
                        await db.save();


                        hora = alta.getUTCHours();
                        console.log(alta);

                        console.log('hora usuario: ', hora);
                        db = await horaAlta.findOne({ hora: hora });

                        db.datoUsuarios++;
                        await db.save();
                    }

                }
                db = null;
                if (i < clientes.length) {
                    alta = clientes[i].alta || null;

                    if (alta) {
                        fecha = new Date(alta.getFullYear(), alta.getMonth() + 1, alta.getDate());

                        db = await fechaAlta.findOne({ fecha: fecha });

                        if (!db) {
                            db = new fechaAlta();
                            db.fecha = fecha;
                            db.datoUsuarios = 0;
                            db.datoClientes = 0;
                        }

                        db.datoClientes++;
                        await db.save();


                        hora = alta.getUTCHours();
                        console.log(alta);
                        console.log('hora cliente: ', hora);
                        db = await horaAlta.findOne({ hora: hora });

                        db.datoClientes++;
                        await db.save();
                    }
                }


            }
        }

        return true;

    } catch (error) {
        console.log(error);
        return error;
    }
}

const insertarfechahoraUsuarioCliente = async(tipo, alta) => {

    try {
        switch (tipo) {
            case 'usuario':

                fecha = new Date(alta.getFullYear(), alta.getMonth() + 1, alta.getDate());
                db = await fechaAlta.findOne({ fecha: fecha });

                if (!db) {
                    db = new fechaAlta();
                    db.fecha = fecha;
                    db.datoUsuarios = 0;
                    db.datoClientes = 0;
                }
                db.datoUsuarios++;
                await db.save();

                hora = alta.getUTCHours();
                db = await horaAlta.findOne({ hora: hora });
                db.datoUsuarios++;
                await db.save();
                break;

            case 'cliente':
                fecha = new Date(alta.getFullYear(), alta.getMonth() + 1, alta.getDate());

                db = await fechaAlta.findOne({ fecha: fecha });

                if (!db) {
                    db = new fechaAlta();
                    db.fecha = fecha;
                    db.datoUsuarios = 0;
                    db.datoClientes = 0;
                }
                db.datoClientes++;
                await db.save();


                hora = alta.getUTCHours();
                db = await horaAlta.findOne({ hora: hora });
                db.datoClientes++;
                await db.save();
                break;

            case 'default':
                return false;
                break;
        }

        return true;

    } catch (error) {

        return error;
    }
}


const sumarUsuarioKPI = async() => {
    try {
        total = await DatoKPI.findOne({ identificador: 'total_usuarios' });
        total.datoNumber++;

        await total.save();
        return true;

    } catch (error) {
        return error;
    }
}
const restarUsuarioKPI = async() => {
    try {
        total = await DatoKPI.findOne({ identificador: 'total_usuarios' });
        total.datoNumber--;

        await total.save();
        return true;

    } catch (error) {
        return error;
    }
}
const sumarClienteKPI = async() => {
    try {
        total = await DatoKPI.findOne({ identificador: 'total_clientes' });
        total.datoNumber++;

        await total.save();
        return true;

    } catch (error) {
        return error;
    }
}
const restarClienteKPI = async() => {
    try {
        total = await DatoKPI.findOne({ identificador: 'total_clientes' });
        total.datoNumber--;

        await total.save();
        return true;

    } catch (error) {
        return error;
    }
}
const sumarPrendaKPI = async() => {
    try {
        total = await DatoKPI.findOne({ identificador: 'total_prendas' });
        total.datoNumber++;

        await total.save();
        return true;

    } catch (error) {
        return error;
    }
}
const restarPrendaKPI = async() => {
    try {
        total = await DatoKPI.findOne({ identificador: 'total_prendas' });
        total.datoNumber--;

        await total.save();
        return true;

    } catch (error) {
        return error;
    }
}
const sumarUsoPrenda = async(id) => {

    try {
                db = await prendasUsadas.findOne({ idPrenda: id });
                if (!db) {
                    db = new prendasUsadas();
                    db.idPrenda = id;
                    db.usos = 1;
                } else{
                    db.usos++;
                }

                await db.save();

                return true;
        }
    catch (error) {
        return error;
    }
}



const obtenerUsuariosClientesFecha = async(req, res = response) => {

    salirSiUsuarioNoAdmin(req.header('x-token'));

    try {

        let fecha_inicio = new Date(req.params.fecha_inicio);
        let fecha_fin = new Date(req.params.fecha_fin);
        let resta = fecha_fin.getTime() - fecha_inicio.getTime();
        resta = Math.round(resta / (1000 * 60 * 60 * 24));

        let periodo = [];
        let usuarios = [];
        let clientes = [];
        let aux = new Date(fecha_inicio);
        for (let i = 0; i <= resta; i++) {
            periodo.push(new Date(aux));
            aux.setDate(aux.getDate() + 1);

            usuarios.push(0);
            clientes.push(0);
        }

        const busqueda = await fechaAlta.find({ fecha: { $gte: fecha_inicio, $lt: fecha_fin } }).sort({ fecha: 1 });

        busqueda.forEach(elemento => {
            for (let i = 0; i <= resta; i++) {
                if (periodo[i].getTime() == elemento.fecha.getTime()) {
                    usuarios[i] = elemento.datoUsuarios;
                    clientes[i] = elemento.datoClientes;
                }
            }
        });

        return res.json({
            ok: true,
            msg: 'total usuarios',
            rango: periodo,
            usuarios: usuarios,
            clientes: clientes,

        });


    } catch (error) {
        console.log('error recuperando la información de KPI de las fechas de alta');
        return res.status(400).json({
            ok: false,
            msg: 'error recuperando la información',
            error: error
        });
    }

}


const obtenerUsuariosClientesHora = async(req, res = response) => {

    salirSiUsuarioNoAdmin(req.header('x-token'));

    try {

        const busqueda = await horaAlta.find();

        let rango = [];
        let usuarios = [];
        let clientes = [];

        for (let i = 0; i < busqueda.length; i++) {
            rango[i] = busqueda[i].hora;
            usuarios[i] = busqueda[i].datoUsuarios;
            clientes[i] = busqueda[i].datoClientes;
        }

        return res.json({
            ok: true,
            msg: 'total usuarios',
            rango: rango,
            usuarios: usuarios,
            clientes: clientes,

        });


    } catch (error) {
        console.log('error recuperando la información de KPI de las fechas de alta');
        return res.status(400).json({
            ok: false,
            msg: 'error recuperando la información',
            error: error
        });
    }

}

const obtenerUsosPrendas = async(req, res = response) => {
    console.log("hola????")
    //salirSiUsuarioNoAdmin(req.header('x-token'));


    try {
        const busqueda = await prendasUsadas.find();

        let prendas = [], veces = [];
        let nPrenda = [], nomPrenda = [];
        for (let i = 0; i < busqueda.length; i++) {
            prendas[i] = busqueda[i].idPrenda;
            veces[i] = busqueda[i].usos;
            
            nPrenda.push(await Prenda.findById(busqueda[i].idPrenda));
            nomPrenda.push(nPrenda[i].nombre);
        }

        return res.json({
            ok: true,
            msg: 'prendas usadas',
            prenda: prendas,
            usos: veces,
            nombres: nomPrenda
            

        });

    } catch (error) {
        console.log('error recuperando la info de los usos de las prendas');
        return res.status(400).json({
            ok: false,
            msg: 'error recuperando la información',
            error: error
        });
    }
}

const obtenerUsosPrendasCliente = async(req, res = response) => {
    
    let id = req.header('id');

    try {
        const busqueda = await prendasUsadas.find();
        const prendasClientes = await Prenda.find(); //aqui 

        console.log(prendasClientes);
        
        let prendas = [], veces = [];
        let nPrenda = [], nomPrenda = [];

        for (let x = 0; x < prendasClientes.length; x++) {
            if(prendasClientes[x].idCliente == id) {
                prendas[x] = busqueda[x].idPrenda
                veces[x] = busqueda[x].usos;

                nPrenda.push(await Prenda.findById(busqueda[x].idPrenda));
                nomPrenda.push(nPrenda[x].nombre);
            }

        }

        return res.json({
            ok: true,
            msg: 'prendas usadas',
            prenda: prendas,
            usos: veces,
            nombres: nomPrenda
            

        });

    } catch (error) {
        console.log('error recuperando la info de los usos de las prendas');
        return res.status(400).json({
            ok: false,
            msg: 'error recuperando la información',
            error: error
        });
    }
}










const obtenerTotalUsuarios = async(req, res = response) => {

    salirSiUsuarioNoAdmin(req.header('x-token'));

    try {

        const total = await DatoKPI.findOne({ identificador: 'total_usuarios' });

        return res.json({
            ok: true,
            msg: 'total usuarios',
            valor: total.datoNumber
        });

    } catch (error) {
        console.log('error recuperando la información de KPI del total de usuarios');
        return res.status(400).json({
            ok: false,
            msg: 'error recuperando la información',
            error: error
        });
    }
}

const obtenerTotalClientes = async(req, res = response) => {

    salirSiUsuarioNoAdmin(req.header('x-token'));

    try {
        const total = await DatoKPI.findOne({ identificador: 'total_clientes' });

        return res.json({
            ok: true,
            msg: 'total clientes',
            valor: total.datoNumber
        });

    } catch (error) {
        console.log('error recuperando la información de KPI del total de clientes');
        return res.status(400).json({
            ok: false,
            msg: 'error recuperando la información',
            error: error
        });
    }
}

const obtenerTotalPrendas = async(req, res = response) => {

    salirSiUsuarioNoAdmin(req.header('x-token'));

    try {
        const total = await DatoKPI.findOne({ identificador: 'total_prendas' });

        return res.json({
            ok: true,
            msg: 'total clientes',
            valor: total.datoNumber
        });

    } catch (error) {
        console.log('error recuperando la información de KPI del total de prendas');
        return res.status(400).json({
            ok: false,
            msg: 'error recuperando la información',
            error: error
        });
    }
}






const obtenerTodosUsuarios = async(req, res = response) => {

    salirSiUsuarioNoAdmin(req.header('x-token'));

    const texto = req.query.texto;
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
    }

    await sleep(100);

    try {


        let usuarios, total;
        // busqueda de un unico usuario


        if (texto) {
            [usuarios, total] = await Promise.all([
                Usuario.find({ rol: textoBusqueda }).sort('alta', 1),
                Usuario.countDocuments({ rol: textoBusqueda })
            ]);
        } else {
            // promesa para que se ejecuten las dos llamadas a la vez, cuando las dos acaben se sale de la promesa
            [usuarios, total] = await Promise.all([
                Usuario.find({}),
                Usuario.countDocuments()
            ]);
        }

        return res.json({
            ok: true,
            msg: 'getUsuarios',
            usuarios,
            total
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error buscando el usuario'
        });
    }
}


const obtenerTodosClientes = async(req, res = response) => {

    salirSiUsuarioNoAdmin(req.header('x-token'));

    const texto = req.query.texto;
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
    }

    await sleep(100);

    try {


        let usuarios, total;
        // busqueda de un unico usuario

        // pruebas que no funcionan
        //$and: [{ rol: textoBusqueda }, created_at: { $gte: "Mon May 30 18:47:00 +0000 2015", $lt: "Sun May 30 20:40:36 +0000 2010" }]
        if (texto) {
            [usuarios, total] = await Promise.all([
                Cliente.find({ rol: textoBusqueda }).sort('alta', 1),
                Cliente.countDocuments({ rol: textoBusqueda })
            ]);
        } else {
            // promesa para que se ejecuten las dos llamadas a la vez, cuando las dos acaben se sale de la promesa
            [usuarios, total] = await Promise.all([
                Cliente.find({}),
                Cliente.countDocuments()
            ]);
        }

        return res.json({
            ok: true,
            msg: 'getUsuarios',
            clientes: usuarios,
            total
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error buscando el usuario'
        });
    }
}



module.exports = {
    // devolver datos al frontend perfectamente formateados 
    obtenerTotalUsuarios,
    obtenerTotalPrendas,
    obtenerTotalClientes,
    obtenerUsuariosClientesFecha,
    obtenerUsuariosClientesHora,
    obtenerUsosPrendas,
    obtenerUsosPrendasCliente,

    // funciones para modificar datos KPI en el backend
    insertarfechahoraUsuarioCliente,
    sumarUsuarioKPI,
    restarUsuarioKPI,
    sumarClienteKPI,
    restarClienteKPI,
    sumarPrendaKPI,
    restarPrendaKPI,
    sumarUsoPrenda,
}