/*
    Ruta base: /api/recuperar
*/

const { Router } = require('express')
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

const {

    recuperarPassword,
    cambiarPassword

} = require('../controllers/password.controller');

router.get('/:email',[
], recuperarPassword);

router.post('/cambiarpassword',[
], cambiarPassword);

module.exports = router;