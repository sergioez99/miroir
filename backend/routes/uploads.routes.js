/*
    Ruta base: /api/upload
*/

const { Router } = require('express');
const { validarJWT } = require('../middleware/validar-jwt');
//2 rutas para los archivos
const { subirArchivo, enviarArchivo } = require('../controllers/uploads.controller');

const router = Router();

/* INICIO DE LAS RUTAS */

router.get('/:tipo/:id', validarJWT, enviarArchivo);
router.post('/:tipo/:id', validarJWT, subirArchivo);


module.exports = router;