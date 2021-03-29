/*
    Ruta base: /api/chart
*/

const { Router } = require('express')
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

const {
    obtenerTotalUsuarios,
    obtenerTotalClientes,
    obtenerTotalPrendas,
    obtenerUsuariosClientesFecha,
    obtenerUsuariosClientesHora,
    obtenerUsosPrendas,
    obtenerUsosPrendasCliente

} = require('../controllers/charts.controller');


router.get('/usuarios/total', [
    validarJWT,
], obtenerTotalUsuarios);

router.get('/clientes/total', [
    validarJWT,
], obtenerTotalClientes);

router.get('/prendas/total', [
    validarJWT,
], obtenerTotalPrendas);


router.get('/usuarios/:fecha_inicio/:fecha_fin', [
    validarJWT,

], obtenerUsuariosClientesFecha);

router.get('/usuarios/horas', [
    validarJWT,

], obtenerUsuariosClientesHora);

router.get('/usos', [
    validarJWT,

], obtenerUsosPrendas);

router.get('/usosCliente', [
], obtenerUsosPrendasCliente);


module.exports = router;