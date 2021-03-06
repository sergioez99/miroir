const { Schema, model } = require('mongoose');
//const mongoose = require('mongoose');



// esquema de la base de datos
const DatosSchema = Schema({

    identificador: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    talla: {
        type: { talla: String },
        required: true,
    },
    time: [{
        dia: {
            type: Date,
            required: true
        },
        start: {
            type: Date,
            required: true
        },
        finish: {
            type: Date,
            required: true
        }

    }]
}, { collection: 'Datos' });

// introducimos una modificacion del metodo toJson() para no enviar toda la información de la BD

DatosSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;

});

module.exports = model('Datos', DatosSchema);