/*
    Ruta base: /api/clientes
*/

const { Router } = require('express')
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

const {
    obtenerClientes,
    crearCliente,
    actualizarCliente,
    borrarCliente

} = require('../controllers/clientes.controller');


/* INICIO DE LAS RUTAS */


router.get('/', [
    validarJWT,
    check('id', 'El id de usuario ha de ser valido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,

], obtenerClientes);


router.post('/', [

    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    //password 2 ?
    check('id', 'El identificador no es válido').isMongoId(),
    check('activo', 'El estado debe ser true/false').optional().isBoolean(),
    check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
    check('nombreEmpresa', 'El nombre de la empresa es obligatorio.').not().isEmpty(),
    check('cif', 'El CIF es obligatorio.').not().isEmpty(),
    check('telefono', 'El teléfono es obligatorio.').not().isEmpty(),
    validarCampos,
    validarRol
], crearCliente);

router.put('/:id', [
    validarJWT,
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('id', 'El identificador no es válido').isMongoId(),
    check('activo', 'El estado debe ser true/false').optional().isBoolean(),
    check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
    check('nombreEmpresa', 'El nombre de la empresa es obligatorio.').not().isEmpty(),
    check('cif', 'El CIF es obligatorio.').not().isEmpty(),
    check('telefono', 'El teléfono es obligatorio.').not().isEmpty(),
    validarCampos,
    validarRol
], actualizarCliente);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarCliente);

module.exports = router;