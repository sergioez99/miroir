const { Schema, model } = require('mongoose');

// esquema de la base de datos
const fechaAltaSchema = Schema({

    fecha: {
        type: Date
    },
    datoUsuarios: {
        type: Number
    },
    datoClientes: {
        type: Number,
    }

}, { collection: 'fechaAlta' });


fechaAltaSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;

});

module.exports = model('fechaAlta', fechaAltaSchema);