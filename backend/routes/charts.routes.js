/*
    Ruta base: /api/chart
*/

const { Router } = require('express')
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();


const { obtenerTodosUsuarios, obtenerTodosClientes } = require('../controllers/charts.controller');

router.get('/usuarios', [
    validarJWT,

], obtenerTodosUsuarios);

router.get('/clientes', [
    validarJWT,

], obtenerTodosClientes);

module.exports = router;