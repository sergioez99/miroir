const { Schema, model } = require('mongoose');

// esquema de la base de datos
const SuscripcionSchema = Schema({

    tipo: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    duracion: {
        type: Number,
        required: true,
    },
    precio: {
        type: Number,
        required: true,
    },
    activo: {
        type: Boolean,
        default: true,
    },

}, { collection: 'Suscripciones' });

// introducimos una modificacion del metodo toJson() para no enviar toda la información de la BD

SuscripcionSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;

});

module.exports = model('Suscripcion', SuscripcionSchema);