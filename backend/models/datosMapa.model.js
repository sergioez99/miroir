const { Schema, model } = require('mongoose');

// esquema de la base de datos
const datoMapaSchema = Schema({

    ciudad: {
        type: String
    },
    prenda: {
        type: String
    },
    contador: {
        type: Number
    },

}, { collection: 'DatosMapa' });


datoMapaSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;

});

module.exports = model('datoMapa', datoMapaSchema);