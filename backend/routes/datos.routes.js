// Ruta base: /api/datos

const { Router } = require('express')
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

const { crearDatos, borrarDatos } = require('../controllers/datos.controller');


// INICIO DE LAS RUTAS 


router.get('/', [
    validarJWT,
    check('id', 'El id del dato debe ser valido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,

], crearDatos);


router.post('/', [
    validarJWT,
    check('identificador', 'El identificador es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre de la prenda es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripcion de la prenda es obligatorio').not().isEmpty(),
    check('talla', 'La talla de la prenda es obligatorio').not().isEmpty(),
    // check('objeto', 'El objeto es obligatorio.').not().isEmpty(),

    validarCampos,
    validarRol
], crearDatos);


router.put('/:id', [
    //validarJWT,
    check('identificador', 'El identificador es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre de la prenda es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripcion de la prenda es obligatorio').not().isEmpty(),
    check('talla', 'La talla de la prenda es obligatorio').not().isEmpty(),
    check('objeto', 'El objeto es obligatorio.').not().isEmpty(),
    validarCampos,
    validarRol
], borrarDatos);


router.delete('/', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarDatos);

module.exports = router;