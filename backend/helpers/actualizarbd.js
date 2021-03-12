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
            const fotovieja = usuario.imagen;
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

            //comprobamos si el cliente existe
            const cliente = await Cliente.findById(id);
            if (!cliente) {
                return false;
            }

            const fotovieja = cliente.imagen;
            const pathFotoVieja = `${path}/${fotovieja}`;


            if (fotovieja && fs.existsSync(pathFotoVieja)) {
                fs.unlinkSync(pathFotoVieja);
            }
            cliente.imagen = nombreArchivo;
            await cliente.save();

            return true;

            break;
        default:

            return false;
            break;
    }

    console.log(tipo, path, nombreArchivo, id);
}

module.exports = { actualizarBD }