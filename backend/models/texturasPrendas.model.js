const { Schema, model } = require('mongoose');

// esquema de la base de datos
const TexturaPrendaSchema = Schema({

    idPrenda: {
        type: Schema.Types.ObjectId,
        ref: 'Prenda'
    },
    texturaAlbedo: {
        type: String,
    },
    texturaNormal: {
        type: String,
    },
    texturaHeight: {
        type: String,
    },
    texturaRoughness: {
        type: String,
    },
    texturaAmbientOcclusion: {
        type: String,
    },


}, { collection: 'TexturaPrenda' });

// introducimos una modificacion del metodo toJson() para no enviar toda la información de la BD

TexturaPrendaSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('TexturaPrendas', TexturaPrendaSchema);