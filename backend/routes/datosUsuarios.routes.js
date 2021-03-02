// Ruta base: /api/datosUsuarios
const { Router } = require('express')
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

const { crearDatosUsuarios } = require('../controllers/datosUsuarios.controller');

// INICIO DE LAS RUTAS 

/*
router.get('/', [
    validarJWT,
    check('email', 'El email del dato debe ser valido').optional().isMongoId(),
    // check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,

], crearDatos);
*/
router.post('/', [
    validarJWT,
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('password', 'El password  es obligatorio').not().isEmpty(),
    check('rol', 'El rol es obligatorio').not().isEmpty(),
    check('alta', 'La fecha de alta es obligatoria').not().isEmpty(),
    check('activo', 'Ser activo es obligatorio').not().isEmpty(),
    check('validado', 'La validadción es opcional').optional().isBoolean(),
    check('peso', 'El peso es opcional').optional().isNumeric(),
    check('altura', 'La altura es opcional').optional().isNumeric(),
    check('pecho', 'El pecho es opcional').optional().isNumeric(),
    check('cadera', 'La cadera es opcional').optional().isNumeric(),
    check('cintura', 'La cintura es opcional').optional().isNumeric(),
    validarCampos,
    validarRol
], crearDatosUsuarios);
/*
router.put('/:id', [
    validarJWT,
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('password', 'El password  es obligatorio').not().isEmpty(),
    check('rol', 'El rol es obligatorio').not().isEmpty(),
    check('alta', 'La fecha de alta es obligatoria').not().isEmpty(),
    check('activo', 'Ser activo es obligatorio').not().isEmpty(),
    check('validado', 'La validadción es opcional').optional().isBoolean(),
    check('peso', 'El peso es opcional').optional().isNumeric(),
    check('altura', 'La altura es opcional').optional().isNumeric(),
    check('pecho', 'El pecho es opcional').optional().isNumeric(),
    check('cadera', 'La cadera es opcional').optional().isNumeric(),
    check('cintura', 'La cintura es opcional').optional().isNumeric(),
    validarCampos,
    validarRol
], actualizarDatos);

router.delete('/', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarDatos);
*/
module.exports = router;