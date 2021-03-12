const { Schema, model } = require('mongoose');

// esquema de la base de datos
const KPIgenericoSchema = Schema({

    identificador: {
        type: String,
        required: true,
        unique: true
    },
    datoNumber: {
        type: Number
    },
    datoString: {
        type: String
    },
    datoFecha: {
        type: Date
    },

}, { collection: 'KPIgenerico' });


KPIgenericoSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;

});

module.exports = model('KPIgenerico', KPIgenericoSchema);