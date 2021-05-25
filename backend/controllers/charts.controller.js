const { response } = require('express');

const Usuario = require('../models/usuarios.model');
const Cliente = require('../models/clientes.model');
const Prenda = require('../models/prendas.model');
const DatoKPI = require('../models/datosGenericos.model');
const datoMapa = require('../models/datosMapa.model');
const fechaAlta = require('../models/fechaAlta.model');
const horaAlta = require('../models/horaAlta.model');
const prendasUsadas = require('../models/prendasUsadas.model');
const tallasUsadas = require('../models/tallasUsadas.model');
const { infoToken } = require('../helpers/infotoken');

// PARA BORRAR PORQUE DE MOMENTO NO SE USA
const sleep = (ms) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
    // ---------------------------------------


const salirSiUsuarioNoAdmin = (res, token) => {
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permiso',
        });
    }
}

const actualizarTodo = async(req, res = response) => {

    try {
        salirSiUsuarioNoAdmin(res, req.header('x-token'));

        console.log('hola, quiero actualizar cosas');

        await recalcularfechahoraAlta();
        await recalcularUsuariosTotales();
        await recalcularClientesTotales();
        await recalcularPrendasTotales();


        console.log('se supone que ha esperado todo');
        return res.json({
            ok: true,
            msg: 'BD de charts actualizadas',
        });


    } catch (error) {
        console.log('error actualizando los datos de KPI');
        return res.status(400).json({
            ok: false,
            msg: 'error actualizando datos de KPI',
            error: error
        });

    }





}



const recalcularUsuariosTotales = async() => {

    try {

        const rol = 'ROL_USUARIO';
        const total = await Usuario.countDocuments({ rol: rol });

        console.log('TOTAL USUARIOS:........ ', total);

        // guardarlo en la colección de datos genéricos
        let nombre = 'total_usuarios';
        let bd = await DatoKPI.findOne({ identificador: nombre });
        if (bd) {
            await DatoKPI.findByIdAndUpdate(bd.id, { datoNumber: total });
        } else {
            let salida = new DatoKPI();
            salida.identificador = nombre;
            salida.datoNumber = total;
            await salida.save();
        }

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
        let nombre = 'total_clientes';
        let bd = await DatoKPI.findOne({ identificador: nombre });
        if (bd) {
            await DatoKPI.findByIdAndUpdate(bd.id, { datoNumber: total });
        } else {
            let salida = new DatoKPI();
            salida.identificador = nombre;
            salida.datoNumber = total;
            await salida.save();
        }

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
        let nombre = 'total_prendas';
        let bd = await DatoKPI.findOne({ identificador: nombre });
        if (bd) {
            await DatoKPI.findByIdAndUpdate(bd.id, { datoNumber: total });
        } else {
            let salida = new DatoKPI();
            salida.identificador = nombre;
            salida.datoNumber = total;
            await salida.save();
        }

        return true;

    } catch (error) {
        return error;
    }

}

const recalcularfechahoraAlta = async() => {
    try {
        const salida = await fechaAlta.deleteMany();
        console.log(salida);
        await horaAlta.deleteMany();
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
        } else {
            db.usos++;
        }

        await db.save();

        return true;
    } catch (error) {
        return error;
    }
}



const obtenerUsuariosClientesFecha = async(req, res = response) => {

    salirSiUsuarioNoAdmin(res, req.header('x-token'));

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

    salirSiUsuarioNoAdmin(res, req.header('x-token'));

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

    //salirSiUsuarioNoAdmin(req.header('x-token'));


    try {
        const busqueda = await prendasUsadas.find();
        let prendas = [],
            veces = [];
        let nPrenda = [],
            nomPrenda = [];
        for (let i = 0; i < busqueda.length; i++) {
            prendas.push(busqueda[i].idPrenda);
            veces.push(busqueda[i].usos);
            let buscada = await Prenda.findById(busqueda[i].idPrenda);
            nPrenda.push(buscada);
            nomPrenda.push(buscada.nombre);
        }
        console.log(veces, nomPrenda)

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

        let prendas = [],
            veces = [],
            nomPrenda = [];

        for (let x = 0; x < prendasClientes.length && x < busqueda.length; x++) {
            if (prendasClientes[x].idCliente == id) {
                prendas.push(busqueda[x].idPrenda);
                veces.push(busqueda[x].usos);
                let buscada = await Prenda.findById(busqueda[x].idPrenda);
                nomPrenda.push(buscada.nombre);

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

const obtenerTallasPrendasCliente = async(req, res = response) => {

    let id = req.header('id');

    try {
        const busqueda = await tallasUsadas.find(); //id, talla, usos
        const prendasClientes = await Prenda.find(); //aqui 

        let existe = false;

        let prendas = [],
            veces = [],
            tallas = [];
        let nPrenda = [],
            nomPrenda = [];

        for (let x = 0; x < prendasClientes.length && x < busqueda.length; x++) {

            if (prendasClientes[x].idCliente == id) { //si el id de la prenda corresponde con el del cliente
                prendas.push(busqueda[x].idPrenda) //añado el id de la prenda a prendas

                for (let i = 0; i < tallas.length && !existe; i++) {
                    if (tallas[i] == busqueda[x].talla) {
                        existe = true;
                        veces[i] = veces[i] + busqueda[x].usos;
                    }
                }
                if (!existe) {
                    tallas.push(busqueda[x].talla);
                    veces.push(busqueda[x].usos);
                } else
                    existe = false;

                //nPrenda.push(await Prenda.findById(busqueda[x].idPrenda));
                nomPrenda.push(prendasClientes[x].nombre);
                console.log(nomPrenda)
            }

        }

        return res.json({
            ok: true,
            msg: 'tallas usadas',
            talla: tallas,
            usos: veces,
            nombres: nomPrenda


        });

    } catch (error) {
        console.log('error recuperando la info de las tallas de las prendas');
        return res.status(400).json({
            ok: false,
            msg: 'error recuperando la información',
            error: error
        });
    }
}





const obtenerTotalUsuarios = async(req, res = response) => {

    salirSiUsuarioNoAdmin(res, req.header('x-token'));

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

    salirSiUsuarioNoAdmin(res, req.header('x-token'));

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

    salirSiUsuarioNoAdmin(res, req.header('x-token'));

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

    salirSiUsuarioNoAdmin(res, req.header('x-token'));

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

    salirSiUsuarioNoAdmin(res, req.header('x-token'));

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

const agregarDatoMapa = async(req, res) => {

    try {

        const suma = await datoMapa.findOne({ ciudad: req.body.ciudad, prenda: req.body.prenda });

        if (suma != null) {

            //LA PRENDA EXISTE, SUMAMOS UNO

            suma.contador++;

            await suma.save();

            return true;

        } else {

            //LA PRENDA NO EXISTE, CREAMOS LA ENTRADA

            let nuevodato = new datoMapa();
            nuevodato.ciudad = req.body.ciudad;
            nuevodato.prenda = req.body.prenda;
            nuevodato.contador = 1;

            await nuevodato.save();

            return true;

        }

    } catch (err) {

        console.log('Error registrando la entrada de la ciudad');

        return res.status(400).json({

            ok: false,
            msg: 'esto no va bro',
            error: err

        });

    }
}

const obtenerDatosRegiones = async(req, res = response) => {

    salirSiUsuarioNoAdmin(res, req.header('x-token'));

    try {

        //Buscamos el dato de cada región

        let datos = [];

        datos.push(['Comunidad', 'Prenda', 'Núm. de pruebas']);

        //Este filtro devuelve la coincidencia con mayor valor en el contador: la prenda más probada de la región, y la añade al array tridimensional que usa charts
        //Si no hay entradas de esa región no se añade nada al array y el mapa se representará con la región en blanco

        const AN = await datoMapa.find({ ciudad: 'AN' }).sort({ "contador": -1 }).limit(1);
        if (AN.length != 0) { datos.push(['ES-AN', AN[0].prenda, AN[0].contador]) }
        const AR = await datoMapa.find({ ciudad: 'AR' }).sort({ "contador": -1 }).limit(1);
        if (AR.length != 0) { datos.push(['ES-AR', AR[0].prenda, AR[0].contador]) }
        const AS = await datoMapa.find({ ciudad: 'AS' }).sort({ "contador": -1 }).limit(1);
        if (AS.length != 0) { datos.push(['ES-AS', AS[0].prenda, AS[0].contador]) }
        const CN = await datoMapa.find({ ciudad: 'CN' }).sort({ "contador": -1 }).limit(1);
        if (CN.length != 0) { datos.push(['ES-CN', CN[0].prenda, CN[0].contador]) }
        const CB = await datoMapa.find({ ciudad: 'CB' }).sort({ "contador": -1 }).limit(1);
        if (CB.length != 0) { datos.push(['ES-CB', CB[0].prenda, CB[0].contador]) }
        const CM = await datoMapa.find({ ciudad: 'CM' }).sort({ "contador": -1 }).limit(1);
        if (CM.length != 0) { datos.push(['ES-CM', CM[0].prenda, CM[0].contador]) }
        const CL = await datoMapa.find({ ciudad: 'CL' }).sort({ "contador": -1 }).limit(1);
        if (CL.length != 0) { datos.push(['ES-CL', CL[0].prenda, CL[0].contador]) }
        const CT = await datoMapa.find({ ciudad: 'CT' }).sort({ "contador": -1 }).limit(1);
        if (CT.length != 0) { datos.push(['ES-CT', CT[0].prenda, CT[0].contador]) }
        const EX = await datoMapa.find({ ciudad: 'EX' }).sort({ "contador": -1 }).limit(1);
        if (EX.length != 0) { datos.push(['ES-EX', EX[0].prenda, EX[0].contador]) }
        const GA = await datoMapa.find({ ciudad: 'GA' }).sort({ "contador": -1 }).limit(1);
        if (GA.length != 0) { datos.push(['ES-GA', GA[0].prenda, GA[0].contador]) }
        const IB = await datoMapa.find({ ciudad: 'IB' }).sort({ "contador": -1 }).limit(1);
        if (IB.length != 0) { datos.push(['ES-IB', IB[0].prenda, IB[0].contador]) }
        const RI = await datoMapa.find({ ciudad: 'RI' }).sort({ "contador": -1 }).limit(1);
        if (RI.length != 0) { datos.push(['ES-RI', RI[0].prenda, RI[0].contador]) }
        const MD = await datoMapa.find({ ciudad: 'MD' }).sort({ "contador": -1 }).limit(1);
        if (MD.length != 0) { datos.push(['ES-MD', MD[0].prenda, MD[0].contador]) }
        const MC = await datoMapa.find({ ciudad: 'MC' }).sort({ "contador": -1 }).limit(1);
        if (MC.length != 0) { datos.push(['ES-MC', MC[0].prenda, MC[0].contador]) }
        const NC = await datoMapa.find({ ciudad: 'NC' }).sort({ "contador": -1 }).limit(1);
        if (NC.length != 0) { datos.push(['ES-NC', NC[0].prenda, NC[0].contador]) }
        const PV = await datoMapa.find({ ciudad: 'PV' }).sort({ "contador": -1 }).limit(1);
        if (PV.length != 0) { datos.push(['ES-PV', PV[0].prenda, PV[0].contador]) }
        const VC = await datoMapa.find({ ciudad: 'VC' }).sort({ "contador": -1 }).limit(1);
        if (VC.length != 0) { datos.push(['ES-VC', VC[0].prenda, VC[0].contador]) }

        console.log("ESTAMOS AQUI");

        //Devolvemos el array al componente con todos los datos de la BD ya formateados

        console.log(datos);

        return res.json(datos);

    } catch (err) {

        console.log('Error buscando los datos');

        return res.status(400).json({

            ok: false,
            msg: 'todo mal bro',
            error: err

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
    obtenerTallasPrendasCliente,
    obtenerDatosRegiones,

    // funciones para modificar datos KPI en el backend
    insertarfechahoraUsuarioCliente,
    sumarUsuarioKPI,
    restarUsuarioKPI,
    sumarClienteKPI,
    restarClienteKPI,
    sumarPrendaKPI,
    restarPrendaKPI,
    sumarUsoPrenda,
    agregarDatoMapa,
    actualizarTodo,
}