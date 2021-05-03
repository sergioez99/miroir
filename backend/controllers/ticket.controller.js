const { response } = require('express');

const Cliente = require('../models/clientes.model');
const Usuario = require('../models/usuarios.model');
const Prenda = require('../models/prendas.model');
const Ticket = require('../models/ticket.model');
const Probador = require('../models/probador.model');
const ModeloPrenda = require('../models/modelosPrendas.model');

const { generarClaveSecreta, generarTicket, validarTicket } = require('../helpers/ticket');
const { infoToken } = require('../helpers/infotoken');
//para el acceso al sistema de archivos
const fs = require('fs');

/*
función para devolver la clave de un cliente
    /api/ticket/clave/obtener/:id
    header -> x-token
*/
const obtenerClave = async(req, res = response) => {

    try {

        const uid = req.params.id;
        const token = req.header('x-token');

        console.log('hola?');
        console.log('id cliente: ', uid);
        console.log('id cliente: ', infoToken(token).uid);
        console.log('comparación: ', infoToken(token).uid === uid);

        // restriccion de autorización
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permiso',
            });
        }

        // buscar el cliente en la BD
        const clienteBD = await Cliente.findById(uid);

        if (!clienteBD) {
            return res.status(400).json({
                ok: false,
                msg: 'error, recuperando el cliente'
            });
        }

        const salida = clienteBD.clave;

        res.json({
            ok: true,
            msg: 'get clave de cliente',
            clave: salida
        });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'error recuperando la clave'
        });
    }
}


/*
función para generar una nueva clave para un cliente
    /api/ticket/clave/cambiar/:id
    header -> x-token
*/
const cambiarClave = async(req, res = response) => {

    try {

        const uid = req.params.id;
        const token = req.header('x-token');

        // comprobamos que el usuario tenga permisos: ADMIN o EL PROPIO CLIENTE
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permiso',
            });
        }


        // buscamos el cliente en la BD
        const clienteBD = await Cliente.findById(uid);

        if (!clienteBD) {
            return res.status(400).json({
                ok: false,
                msg: 'error, recuperando el cliente'
            });
        }


        // generar nueva clave
        let nuevaClave = generarClaveSecreta(50);
        // comprobar que dicha claves sea única de este cliente
        while (await Cliente.findOne({ clave: nuevaClave })) {
            console.log('esto es para prevenir que se repita la clave con otro usuario');
            nuevaClave = generarClaveSecreta(50);
        }

        // guardar los datos en la BD
        clienteBD.clave = nuevaClave;
        const cliente = await Cliente.findByIdAndUpdate(uid, clienteBD, { new: true });

        return res.json({
            ok: true,
            msg: 'clave de cliente nueva',
            clave: cliente.clave
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error cambiando la clave'
        });
    }
}

/*
función para crear un ticket
    api/ticket/obtener/
*/
const obtenerTicket = async(req, res = response) => {

    const usuarioEmail = req.query.email;
    const prendaID = req.query.identificador;
    const prendaTalla = req.query.talla;
    const clienteClave = req.query.clave;


    try {


        const [cliente, prenda, usuario] = await Promise.all([

            Cliente.findOne({ clave: clienteClave }),
            Prenda.findOne({ identificador: prendaID }),
            Usuario.findOne({ email: usuarioEmail }),

        ]).catch(error => {
            return res.status(400).json({
                ok: false,
                msg: 'Error buscando en la DB',
            });
        });


        // primero comprobar la clave del cliente
        // const cliente = await Cliente.findOne({ clave: clienteClave });

        if (!cliente) {
            return res.status(400).json({
                ok: false,
                msg: 'No es una clave válida',
            });
        } else if (!cliente.activo) {
            return res.status(400).json({
                ok: false,
                msg: 'No es una clave válida',
            });
        }

        // comprobar que la prenda existe
        // const prenda = await Prenda.findOne({ identificador: prendaID });

        if (!prenda) {
            return res.status(400).json({
                ok: false,
                msg: 'No es una prenda válida'
            });
        }

        // comprobar la talla de la prenda
        let existeTalla = false;
        for (let i = 0; i < prenda.talla.length; i++) {
            if (prenda.talla[i] == prendaTalla) {
                existeTalla = true;
                break;
            }
        }
        if (!existeTalla) {
            return res.status(400).json({
                ok: false,
                msg: 'No es una talla válida'
            });
        }

        //comprobar que el usuario existe
        // const usuario = await Usuario.findOne({ email: usuarioEmail });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No es un usuario válido',
            });
        } else if (!usuario.activo) {
            return res.status(400).json({
                ok: false,
                msg: 'No es un usuario válido',
            });
        }


        // comprobaciones hechas, generar el ticket, guardarlo en la base de datos y devolverlo

        const ticket = await generarTicket(cliente.email, usuarioEmail, prendaID, prendaTalla);

        // guardar ticket en la base de datos
        const ticketBD = new Ticket({ ticket: ticket, cliente: cliente.id, usuario: usuario.id, prenda: prenda.id, talla: prendaTalla });
        await ticketBD.save();

        return res.json({
            ok: true,
            msg: 'vamos a devolver un ticket',
            ticket: ticket,
        });
    } catch (err) {

        console.log(err);

        return res.status(400).json({
            ok: false,
            msg: 'Ha habido algun error',
            error: err
        });

    }

}


/*
esta funcion valida el ticket
llega un ticket y se comprueba TODO
devuelve true en caso de que el ticket sea correcto
*/
const validacionTicket = async(req, res = response) => {

    try {
        const ticket = req.params.ticket;
        //const tipo = req.params.tipo;
        const validar = validarTicket(ticket);

        if (validar) {

            const ticketBD = await Ticket.findOne({ ticket: ticket });

            if (ticketBD) {

                const clienteID = ticketBD.cliente;
                const prendaID = ticketBD.prenda;
                const usuarioID = ticketBD.usuario;
                const talla = ticketBD.talla;

                // con el tipo devolver el modelo de la prenda o del modelo (texturas, etc...)
                // comprobar que todo existe en la BD
                const [cliente, prenda, usuario] = await Promise.all([

                    Cliente.findById(clienteID),
                    Prenda.findById(prendaID),
                    Usuario.findById(usuarioID),

                ]).catch(error => {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Error buscando en la DB',
                        error: '1',
                    });
                });

                // primero comprobar la clave del cliente

                if (!cliente) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No es una clave válida',
                        error: 'cliente',
                    });
                } else if (!cliente.activo) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No es una clave válida',
                        error: 'cliente',
                    });
                }

                // comprobar que la prenda existe

                if (!prenda) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No es una prenda válida',
                        error: 'prenda',
                    });
                }

                // comprobar la talla de la prenda
                let existeTalla = false;
                for (let i = 0; i < prenda.talla.length; i++) {
                    if (prenda.talla[i] == talla) {
                        existeTalla = true;
                        break;
                    }
                }
                if (!existeTalla) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No es una talla válida',
                        error: 'talla',
                    });
                }

                //comprobar que el usuario existe
                if (!usuario) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No es un usuario válido',
                        error: 'usuario',
                    });
                } else if (!usuario.activo) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No es un usuario válido',
                        error: 'usuario',
                    });
                }

                // guardar info del ticket en DB para estadistica
                const probador = new Probador();
                probador.cliente = clienteID;
                probador.usuario = usuarioID;
                probador.prenda = prendaID;
                probador.talla = talla;
                probador.ticket = ticketBD.ticket;

                await probador.save();

                // conseguir modelo de avatar y modelo de prenda

                // aqui el usuario es valido, recoger las medidas y con ellas escoger el tipo de avatar
                const sexo = usuario.sexo;
                const altura = usuario.altura;
                const peso = usuario.peso;
                const pecho = usuario.pecho;
                const cintura = usuario.cintura;
                const cadera = usuario.cadera;
                const imc = peso / ((altura / 100) * (altura / 100));

                let modelo = 1;
                if (altura > 170) {
                    modelo += 3;
                }
                if (altura > 180) {
                    modelo += 3;
                }
                if (imc > 20) {
                    modelo += 1;
                    if (cintura > 80) {
                        modelo += 1;
                    }
                }
                if (sexo == 'M') {
                    modelo += 10;
                }

                // aqui ya tenemos el modelo del avatar
                const avatarFichero = `${modelo}.json`;

                // ahora la prenda, con la talla averiguaremos el modelo que tenemos que devolver
                let prendaFichero = 'default.json';

                // habrá que buscar el modelo de esta prenda con esta talla

                const modelosPrenda = prenda.modelo;

                if (modelosPrenda) {
                    for (let i = 0; i < modelosPrenda.length; i++) {
                        let aux = await ModeloPrenda.findById(modelosPrenda[i]);
                        if (aux.talla == talla) {
                            prendaFichero = aux.modelo;
                            break;
                        }
                    }
                }

                return res.json({
                    ok: true,
                    msg: 'se ha validado correctamente el ticket',
                    avatar: avatarFichero,
                    prenda: prendaFichero
                });

            }
        }

        return res.status(400).json({
            ok: false,
            msg: 'El ticket no es válido',
            error: 'ticket',
        });

    } catch (error) {
        console.log(error);

        return res.status(400).json({
            ok: false,
            msg: 'Ha habido algun error',
            error: error
        });
    }

}

/*
esta funcion devuelve uno a uno los archivos necesarios para el probador
llega un ticket, se comprueba que es válido y se recupera la info de la BD
llega el tipo que define el archivo que se va a devolver
*/
const modeloTicket = async(req, res = response) => {

    try {
        const ticket = req.params.ticket;
        const tipo = req.params.tipo;
        const validar = validarTicket(ticket);

        if (validar) {

            const ticketBD = await Ticket.findOne({ ticket: ticket });

            if (ticketBD) {

                const prendaID = ticketBD.prenda;
                const usuarioID = ticketBD.usuario;
                const talla = ticketBD.talla;

                // averiguar el tipo y buscar el archivo que necesitamos

                let path = null;

                switch (tipo) {
                    case 'avatar':
                        // devolver avatar

                        console.log('devolver un avatar');

                        const usuario = await Usuario.findById(usuarioID);

                        //comprobar que el usuario existe
                        if (!usuario) {
                            return res.status(400).json({
                                ok: false,
                                msg: 'No es un usuario válido',
                                error: 'usuario',
                            });
                        } else if (!usuario.activo) {
                            return res.status(400).json({
                                ok: false,
                                msg: 'No es un usuario válido',
                                error: 'usuario',
                            });
                        }

                        // aqui el usuario es valido, recoger las medidas y con ellas escoger el tipo de avatar
                        const sexo = usuario.sexo;
                        const altura = usuario.altura;
                        const peso = usuario.peso;
                        const pecho = usuario.pecho;
                        const cintura = usuario.cintura;
                        const cadera = usuario.cadera;

                        const imc = peso / ((altura / 100) * (altura / 100));

                        console.log('IMC calculado: ...', imc);

                        // aqui habra que definir las condiciones que diferencian un modelo de otro

                        let modelo = 1;
                        if (altura > 170) {
                            modelo += 3;
                        }
                        if (altura > 180) {
                            modelo += 3;
                        }
                        if (imc > 20) {
                            modelo += 1;
                            if (cintura > 80) {
                                modelo += 1;
                            }
                        }
                        if (sexo && sexo == 'M') {
                            modelo += 10;
                        }


                        path = `${process.env.PATHUPLOAD}/modelo/avatar/${modelo}.json`;
                        // console.log(path);

                        //comprobar si existe el archivo
                        if (!fs.existsSync(path)) {
                            // res.status(404);
                            path = `${process.env.PATHUPLOAD}/modelo/avatar/default.json`;
                        }
                        //si todo bien lo enviamos
                        return res.sendFile(path);
                        break;

                    case 'prenda':

                        console.log('devolver una prenda');
                        // devolver prenda
                        const prenda = await Prenda.findById(prendaID);

                        // comprobar que la prenda existe

                        if (!prenda) {
                            return res.status(400).json({
                                ok: false,
                                msg: 'No es una prenda válida',
                                error: 'prenda',
                            });
                        }

                        // comprobar la talla de la prenda
                        let existeTalla = false;
                        for (let i = 0; i < prenda.talla.length; i++) {
                            if (prenda.talla[i] == talla) {
                                existeTalla = true;
                                break;
                            }
                        }
                        if (!existeTalla) {
                            return res.status(400).json({
                                ok: false,
                                msg: 'No es una talla válida',
                                error: 'talla',
                            });
                        }

                        // habrá que buscar el modelo de esta prenda con esta talla

                        const modelosPrenda = prenda.modelo;

                        if (modelosPrenda) {
                            for (let i = 0; i < modelosPrenda.length; i++) {
                                let aux = await ModeloPrenda.findById(modelosPrenda[i]);
                                if (aux.talla == talla) {
                                    path = `${process.env.PATHUPLOAD}/modelo/prenda/${prendaID}/${aux.modelo}`;
                                    break;
                                }
                            }
                        }

                        //comprobar si existe el archivo
                        if (!fs.existsSync(path)) {
                            // res.status(404);
                            path = `${process.env.PATHUPLOAD}/modelo/prenda/pantalon.json`;
                        }
                        //si todo bien lo enviamos
                        return res.sendFile(path);
                        
                    default:
                        return res.status(400).json({
                            ok: false,
                            msg: 'petición no es válida',
                            error: 'tipo',
                        });
                }

            }
        }

        return res.status(400).json({
            ok: false,
            msg: 'El ticket no es válido',
            error: 'ticket',
        });

    } catch (error) {
        console.log(error);

        return res.status(400).json({
            ok: false,
            msg: 'Ha habido algun error',
            error: error
        });
    }

}


const texturaTicket = async(req, res = response) => {
    try {
        const ticket = req.params.ticket;
        const nombre = req.params.nombre;
        const validar = validarTicket(ticket);

        if (validar) {

            // ticket valido, buscar el archivo de textura y devolverlo

            path = `${process.env.PATHUPLOAD}/modelo/textura/${nombre}`;

            // console.log('devolver textura: ', path);

            //comprobar si existe el archivo
            if (!fs.existsSync(path)) {
                path = `${process.env.PATHUPLOAD}/modelo/textura/default.jpg`;
            }
            // console.log('devolver textura: ', path);

            //si todo bien lo enviamos
            return res.sendFile(path);

        }

        return res.status(400).json({
            ok: false,
            msg: 'El ticket no es válido',
            error: 'ticket',
        });

    } catch (error) {
        console.log(error);

        return res.status(400).json({
            ok: false,
            msg: 'Ha habido algun error',
            error: error
        });
    }
}


module.exports = {
    obtenerClave,
    cambiarClave,
    obtenerTicket,

    validacionTicket,
    modeloTicket,
    texturaTicket,

}