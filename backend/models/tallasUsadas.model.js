const { Schema, model } = require('mongoose');

// esquema de la base de datos
const tallasUsadasSchema = Schema({
    talla: {
        type: String,
        required: true,
    },
    idPrenda: {
        type: Schema.Types.ObjectId,
        ref: 'Prendas'
    },
    usos: {
        type: Number,
    },

}, { collection: 'tallasUsadas' });

// introducimos una modificacion del metodo toJson() para no enviar toda la información de la BD

tallasUsadasSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('tallasUsadas', tallasUsadasSchema);