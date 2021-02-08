/*
    Ruta base: /api/verificacion
*/

const { Router } = require('express')
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

const {

    reenviarToken,
    verificarEmail

} = require('../controllers/verificacion.controller');

router.get('/:token',[
], verificarEmail);

router.get('/reenviar',[
    //validarJWT,
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    validarCampos
], reenviarToken);

module.exports = router;