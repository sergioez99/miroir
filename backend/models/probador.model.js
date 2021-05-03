const { Schema, model } = require('mongoose');

// esquema de la base de datos
const ProbadorSchema = Schema({

    ticket: {
        type: String,
        required: true
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    prenda: {
        type: Schema.Types.ObjectId,
        ref: 'Prenda',
        required: true
    },
    talla: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    duration: {
        type: Number,
    }

}, { collection: 'Probador' });


ProbadorSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;

});

module.exports = model('Probador', ProbadorSchema);