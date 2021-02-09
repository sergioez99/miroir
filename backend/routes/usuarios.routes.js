/*
    Ruta base: /api/usuarios
*/

const { Router } = require('express')
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

const {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario

} = require('../controllers/usuarios.controller');
router.get('/', [
    validarJWT,
    check('id', 'El id de usuario ha de ser valido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,

], obtenerUsuarios);


router.post('/', [
    validarJWT,
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    check('activo', 'El estado debe ser true/false').optional().isBoolean(),
    check('peso', 'Recomendable poner tu peso.').optional().isNumeric(),
    check('altura', 'Recomendable poner tu altura.').optional().isNumeric(),
    check('pecho', 'Recomendable poner la medida de tu pecho baby.').optional().isNumeric(),
    check('cadera', 'Recomendable poner la medida de tu cadera.').optional().isNumeric(),
    check('cintura', 'Recomendable poner la medida de tu cintura.').optional().isNumeric(),

    validarCampos,
    validarRol
], crearUsuario);
router.put('/:id', [
    validarJWT,
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('id', 'El identificador no es válido').isMongoId(),
    check('activo', 'El estado debe ser true/false').optional().isBoolean(),
    check('peso', 'Recomendable poner tu peso.').optional().isNumeric(),
    check('altura', 'Recomendable poner tu altura.').optional().isNumeric(),
    check('pecho', 'Recomendable poner la medida de tu pecho baby.').optional().isNumeric(),
    check('cadera', 'Recomendable poner la medida de tu cadera.').optional().isNumeric(),
    check('cintura', 'Recomendable poner la medida de tu cintura.').optional().isNumeric(),

    validarCampos,
    validarRol
], actualizarUsuario);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarUsuario);

module.exports = router;

/*
    Ruta base: /api/usuarios


const { Router } = require('express')
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

const {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario

} = require('../controllers/usuarios.controller');


/* INICIO DE LAS RUTAS 


router.get('/', [
    validarJWT,
    check('id', 'El id de usuario ha de ser valido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,

], obtenerUsuarios);


router.post('/', [

    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    check('activo', 'El estado debe ser true/false').optional().isBoolean(),
    validarCampos,
    validarRol
], crearUsuario);

router.put('/:id', [
    validarJWT,
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('id', 'El identificador no es válido').isMongoId(),
    check('activo', 'El estado debe ser true/false').optional().isBoolean(),
    validarCampos,
    validarRol
], actualizarUsuario);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarUsuario);

module.exports = router;

*/