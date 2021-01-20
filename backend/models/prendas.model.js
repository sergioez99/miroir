const { Schema, model } = require('mongoose');

// esquema de la base de datos
const PrendaSchema = Schema({

    identificador: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    talla: {
        type: String,
        required: true,
    },
    //OJOOOO !!!!!! HAY QUE revisar esta vaina !!!!
    objeto: {
        type: String,
        default: './models/prueba.obj',
    }

}, { collection: 'Prendas' });

// introducimos una modificacion del metodo toJson() para no enviar toda la información de la BD

PrendaSchema.method('toJSON', function() {

    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;

});

module.exports = model('Prendas', PrendaSchema);