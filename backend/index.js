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

// llamar a nuestra cadena de conexion
dbConnection();

app.use(cors());

// para manejar los argumentos en la peticion (body, cabeceras, url, ...)
app.use(express.json());
/* 
req.body
req.cookies
req.headers
req.params
req.query
*/

app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/clientes', require('./routes/clientes.routes'));
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/verificacion', require('./routes/verificacion.routes'));
app.use('/api/recuperar', require('./routes/password.routes'));

/*
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/grupos', require('./routes/grupos.routes'));
*/

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});