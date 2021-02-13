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
    rol: {
        type: String,
        required: true,
        default: 'ROL_USUARIO'
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
    validado: {
        type: Boolean,
        default: false,
    },
    peso: {
        type: Number,
        default: 70,
    },
    altura: {
        type: Number,
        default: 170,
    },
    pecho: {
        type: Number,
        default: 90,
    },
    cadera: {
        type: Number,
        default: 60,
    },
    cintura: {
        type: Number,
        default: 50,
    },
    validado: {
        type: Boolean,
        default: false,
    }


}, { collection: 'Usuarios' });

// introducimos una modificacion del metodo toJson() para no enviar toda la información de la BD

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;

});

module.exports = model('Usuario', UsuarioSchema);


/* const { Schema, model } = require('mongoose');

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
    rol: {
        type: String,
        required: true,
        default: 'ROL_USUARIO'
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

module.exports = model('Usuario', UsuarioSchema); */