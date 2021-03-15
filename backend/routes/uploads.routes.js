/*
    Ruta base: /api/upload
*/
const { Router } = require('express');
//2 rutas para los archivos
const { subirArchivo, enviarArchivo } = require('../controllers/uploads.controller');
//para validar con el json web token
const { validarJWT } = require('../middleware/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');


const router = Router();

/* INICIO DE LAS RUTAS */

router.get('/:tipo/:nombreArchivo', [
    validarJWT,
    check('tipo', 'El tipo debe ser valido').notEmpty(),
    check('nombreArchivo', 'El nombreArchivo debe ser un nombre de archivo válido').trim(),
    validarCampos
], enviarArchivo);
router.post('/:tipo/:id', [
    // validarJWT,
    check('tipo', 'El tipo debe ser valido').notEmpty(),
    check('id', 'El id del archivo debe ser valido').isMongoId(),
    validarCampos
], subirArchivo);


module.exports = router;