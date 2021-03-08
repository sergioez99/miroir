/*
Importación de módulos
*/
const express = require('express');
// intercambio de recursos de origen cruzado
const cors = require('cors');
//Para subir los archivos
const fileUpload = require('express-fileupload');
// para guardar variables de entorno en un archivo de variables
require('dotenv').config();

const { dbConnection } = require('./database/configdb');

// Crear una aplicación de express
const app = express();

// llamar a nuestra cadena de conexion
dbConnection();

app.use(cors());
// para manejar los argumentos en la peticion (body, cabeceras, url, ...)
app.use(express.json());
//para la transferencia de archivos
app.use(fileUpload({
    //vamos a limitar el tamanyo (establecido como variable global en .env)
    limits: { fileSize: process.env.MAXSIZEUPLOAD * 1024 * 1024 },
    createParentPath: true, //crea la carpeta si no existe
    //si llega al tamanyo maximo automaticamente aborta la subida
    //abortOnLimit: false,   
}));

//RUTAS DE LA API

app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/clientes', require('./routes/clientes.routes'));
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/verificacion', require('./routes/verificacion.routes'));
app.use('/api/recuperar', require('./routes/password.routes'));
app.use('/api/prendas', require('./routes/prendas.routes'));

//para subir archivos
app.use('/api/upload', require('./routes/uploads.routes'));
//para generar datos 
app.use('/api/datos', require('./routes/datos.routes'));
app.use('/api/chart', require('./routes/charts.routes'));

/*
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/grupos', require('./routes/grupos.routes'));
*/

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});