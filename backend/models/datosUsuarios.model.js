const { Schema, model } = require('mongoose');
//const mongoose = require('mongoose');

// esquema de la base de datos
const DatosUsuarioSchema = Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    rol: {
        type: String,
        required: true,
    },
    alta: {
        type: String,
        required: true,
    },
    activo: {
        type: Boolean,
        required: true,
    },
    validado: {
        type: Boolean,
        required: true,
    },
    peso: {
        type: Number,
        required: true,
    },
    altura: {
        type: Number,
        required: true,
    },
    pecho: {
        type: Number,
        required: true,
    },
    cadera: {
        type: Number,
        required: true,
    },
    cintura: {
        type: Number,
        required: true,
    },
    validado: {
        type: Boolean,
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
}, { collection: 'DatosUsuarios' });

// introducimos una modificacion del metodo toJson() para no enviar toda la información de la BD

DatosSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('DatosUsuarios', DatosUsuarioSchema);