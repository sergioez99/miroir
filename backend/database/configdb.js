// importar el modulo de mongo
const mongoose = require('mongoose');

// objeto de conexion
const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DBCONEXION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            // para que las funciones que usemos no den error
            userFindAndModify: false
        });
        console.log('DB online');

    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la BD');
    }
}

module.exports = {
    dbConnection
}