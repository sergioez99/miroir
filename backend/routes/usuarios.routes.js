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
    /*
    validarJWT,
    // campos opcionales, si vienen, los validamos
    check('id', 'El id de usuario ha de ser valido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,
*/
], obtenerUsuarios);


router.post('/', [
    /*
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('apellidos', 'El argumento apellidos es obligatorio').not().isEmpty().trim(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    check('activo', 'El estado debe ser true/false').optional().isBoolean(),
    validarCampos,
    validarRol
    */
], crearUsuario);

router.put('/:id', [
    /*  
     validarJWT,
     check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
     check('apellidos', 'El argumento apellidos es obligatorio').not().isEmpty().trim(),
     check('email', 'El argumento email es obligatorio').not().isEmpty(),
     check('email', 'El argumento email debe ser un email').isEmail(),
     // el pasword no se puede actualizar en el PUT
     //normalmente para la actualizacion del pasword se hace un procedimiento específico
     //check('password', 'El argumento password es obligatorio').not().isEmpty(),
     check('id', 'El identificador no es válido').isMongoId(),
     check('activo', 'El estado debe ser true/false').optional().isBoolean(),
     validarCampos,
     validarRol */
], actualizarUsuario);

router.delete('/:id', [
    /*  validarJWT,
     check('id', 'El identificador no es válido').isMongoId(),
     validarCampos */
], borrarUsuario);

module.exports = router;