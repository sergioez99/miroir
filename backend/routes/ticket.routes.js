/*
    Ruta base: /api/ticket
*/

const { Router } = require('express')
const { check } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

const {

    obtenerClave,
    cambiarClave,
    obtenerTicket,

    validacionTicket,
    modeloTicket,
    texturaTicket,

    //canjearTicket,

} = require('../controllers/ticket.controller');



router.get('/clave/obtener/:id', [
    validarJWT,
], obtenerClave);

router.get('/clave/cambiar/:id', [
    validarJWT,
], cambiarClave);

router.get('/obtener/', [
    check('email', 'Se necesita un email de usuario').notEmpty(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('identificador', 'Se necesita un identificador de prenda').notEmpty(),
    check('talla', 'Se necesita una talla de prenda').notEmpty(),
    check('clave', 'Se necesita una clave de cliente').notEmpty(),
], obtenerTicket);

router.get('/validar/:ticket', [], validacionTicket);
router.get('/modelo/:tipo/:ticket', [], modeloTicket);
router.get('/textura/:nombre/:ticket', [], texturaTicket);

module.exports = router;