const { Schema, model } = require('mongoose');

// esquema de la base de datos
const horaAltaSchema = Schema({

    hora: {
        type: Number
    },
    datoUsuarios: {
        type: Number,
        default: 0
    },
    datoClientes: {
        type: Number,
        default: 0
    }

}, { collection: 'horaAlta' });


horaAltaSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;

});

module.exports = model('horaAlta', horaAltaSchema);