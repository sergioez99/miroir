/*
Importación de módulos
*/
const express = require('express');
// intercambio de recursos de origen cruzado
const cors = require('cors');
const { dbConnection } = require('./database/configdb');
// para guardar variables de entorno en un archivo de variables
require('dotenv').config();
// Crear una aplicación de express
const app = express();
//Para subir los archivos
const fileUpload = require('express-fileupload');



// llamar a nuestra cadena de conexion
dbConnection();

app.use(cors());

// para manejar los argumentos en la peticion (body, cabeceras, url, ...)
app.use(express.json());

//para la transferencia de archivos
app.use(fileUpload({
    //vamos a limitar el tamanyo (establecido como variable global en .env)
    limits: { fileSize: process.env.MAXSIZEUPLOAD * 1024 * 1024 },
    createParentPath: true,
    //si llega al tamanyo maximo automaticamente aborta la subida
    //abortOnLimit: false,
    //cuando almacenamos el archivo en una carpeta, si dicha carpeta no existe
    //la crea directamente.
}));

app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/clientes', require('./routes/clientes.routes'));
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/verificacion', require('./routes/verificacion.routes'));
app.use('/api/recuperar', require('./routes/password.routes'));
app.use('/api/prendas', require('./routes/prendas.routes'));

//para subir archivos
app.use('/api/upload', require('./routes/uploads.routes'));

/*
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/grupos', require('./routes/grupos.routes'));
*/

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});