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

router.get('/reenviar/:email',[
], reenviarToken);

router.get('/verificar/:token',[
], verificarEmail);

module.exports = router;