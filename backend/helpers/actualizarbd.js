const Usuario = require('../models/usuarios.model');
const Prenda = require('../models/prendas.model');
const ModelosPrenda = require('../models/modelosPrendas.model');

//Para acceder al sistema de archivos
const fs = require('fs');


const actualizarBD = async(tipo, path, nombreArchivo, id, talla) => {

    switch (tipo) {
        case 'fotoperfil':
            //comprobamos si el usuario existe
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                return false;
            }
            //si el usuario ya tiene una foto
            let fotovieja = usuario.imagen;
            //creamos el path
            const pathFotoVieja = `${path}/${fotovieja}`;

            //si tenemos imagen y si existe, accedemos al sistema de archivos y eliminamos la fotovieja
            if (fotovieja && fs.existsSync(pathFotoVieja)) {
                fs.unlinkSync(pathFotoVieja);
            }
            usuario.imagen = nombreArchivo;
            await usuario.save();

            return true;

            break;

        case 'prenda':

            //comprobamos si la prenda existe
            const prenda = await Prenda.findById(id);

            if (!prenda) {
                return false;
            }

            const modelos = await ModelosPrenda.find({ idPrenda: id, talla: talla });

            console.log('modelos de la prenda: ', prenda.modelo);
            console.log('resultado de la busqueda: ', modelos);

            let modelo;

            if (modelos.length > 0) {

                console.log('la prenda tiene un modelo de esa talla');
                modelo = modelos[0];
                let fotoviejaDos = modelo.modelo;
                const pathFotoViejaDos = `${path}/modelo/prenda/${fotoviejaDos}`;

                if (fotoviejaDos && fs.existsSync(pathFotoViejaDos)) {
                    fs.unlinkSync(pathFotoViejaDos);

                }
            } else {
                console.log('la prenda no tiene modelo de esa talla');
                modelo = new ModelosPrenda();
                modelo.idPrenda = id;
                modelo.talla = talla;
            }

            modelo.modelo = nombreArchivo;

            let modelosPrenda = prenda.modelo;
            modelosPrenda.push(modelo);
            prenda.modelo = modelosPrenda;

            await modelo.save();

            await prenda.save();
            console.log(prenda);


            return true;

            break;
        default:

            return false;
            break;
    }

    console.log(tipo, path, nombreArchivo, id);
}

module.exports = { actualizarBD }