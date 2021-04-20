const { Schema, model } = require('mongoose');

// esquema de la base de datos
const ModeloPrendaSchema = Schema({

    talla: {
        type: String,
        required: true,
    },
    modelo: {
        type: String,
    },
    idPrenda: {
        type: Schema.Types.ObjectId,
        ref: 'Prenda'
    }

}, { collection: 'ModeloPrenda' });

// introducimos una modificacion del metodo toJson() para no enviar toda la información de la BD

ModeloPrendaSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('ModeloPrendas', ModeloPrendaSchema);