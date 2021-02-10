const { Schema, model } = require('mongoose');

// esquema de la base de datos
const ClienteSchema = Schema({


    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    alta: {
        type: Date,
        required: true,
        default: Date.now
    },
    activo: {
        type: Boolean,
        default: true,
    },

    nombre: {
        type: String,
        required: true,
    },
    nombreEmpresa: {
        type: String,
        required: true,
    },
    nif: {
        type: String,
        required: true,
    },
    telefono: {
        type: Number,
        required: true,
    },
    rol: {
        type: String,
        required: true,
        default: 'ROL_CLIENTE'
    },




}, { collection: 'Clientes' });

// introducimos una modificacion del metodo toJson() para no enviar toda la información de la BD

ClienteSchema.method('toJSON', function() {

    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;

});

module.exports = model('Cliente', ClienteSchema);