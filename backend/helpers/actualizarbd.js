const Usuario = require('../models/usuarios.model');
const Cliente = require('../models/clientes.model');

//Para acceder al sistema de archivos
const fs = require('fs');


const actualizarBD = async(tipo, path, nombreArchivo, id) => {

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

            let fotoviejaDos = prenda.imagen;
            const pathFotoViejaDos = `${path}/${fotoviejaDos}`;


            if (fotoviejaDos && fs.existsSync(pathFotoViejaDos)) {
                fs.unlinkSync(pathFotoViejaDos);
            }
            prenda.imagen = nombreArchivo;
            await prenda.save();

            return true;

            break;
        default:

            return false;
            break;
    }

    console.log(tipo, path, nombreArchivo, id);
}

module.exports = { actualizarBD }