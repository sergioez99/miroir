const { Schema, model } = require('mongoose');

// esquema de la base de datos
const prendasUsadasSchema = Schema({
    usos: {
        type: Number,
        required: true,
    },
    idPrenda: {
        type: Schema.Types.ObjectId,
        ref: 'Prendas'
    }

}, { collection: 'prendasUsadas' });

// introducimos una modificacion del metodo toJson() para no enviar toda la información de la BD

prendasUsadasSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('prendasUsadas', prendasUsadasSchema);