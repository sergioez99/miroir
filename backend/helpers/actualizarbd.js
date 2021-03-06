const Usuario = require('../models/usuarios.model');
const Cliente = require('../models/clientes.model');

//Para acceder al sistema de archivos
const fs = require('fs');




const actualizarBD = async(tipo, path, nombreArchivo, id) => {

    switch (tipo) {
        case 'fotoperfil':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                return false;
            }

            const fotovieja = usuario.imagen;
            const pathFotoVieja = `${path}/${fotovieja}`;


            if (fotovieja && fs.existsSync(pathFotoVieja)) {
                fs.unlinkSync(pathFotoVieja);
            }
            usuario.imagen = nombreArchivo;
            await usuario.save();

            return true;

            break;

        case 'prenda':

            return false;
            break;

        default:

            return false;
            break;
    }

    console.log(tipo, path, nombreArchivo, id);
}

module.exports = { actualizarBD }