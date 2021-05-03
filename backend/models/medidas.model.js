const { Schema, model } = require('mongoose');

// esquema de la base de datos
const MedidasSchema = Schema({

    id: {
        type: String,
        required: true,
    },
    peso: {
        type: Number,
    },
    altura: {
        type: Number,
    },
    pecho: {
        type: Number,
    },
    cadera: {
        type: Number,
    },
    cintura: {
        type: Number,
    },

}, { collection: 'Medidas' });


MedidasSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;

});

module.exports = model('Medidas', MedidasSchema);