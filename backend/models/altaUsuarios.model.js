const { Schema, model } = require('mongoose');

// esquema de la base de datos
const AltaUsuariosSchema = Schema({

    fecha: {
        type: Date
    },
    valorUsuarios: {
        type: Number
    },
    valorClientes: {
        type: Number,
    }

}, { collection: 'AltaUsuarios' });


AltaUsuariosSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;

});

module.exports = model('AltaUsuarios', AltaUsuariosSchema);