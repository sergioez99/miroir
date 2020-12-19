const { Schema, model } = require('mongoose');

// esquema de la base de datos
const UsuarioSchema = Schema({

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


}, { collection: 'Usuarios' });

// introducimos una modificacion del metodo toJson() para no enviar toda la información de la BD

UsuarioSchema.method('toJSON', function() {

    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;

});

module.exports = model('Usuario', UsuarioSchema);