// Ruta base: /api/datos

const { Router } = require('express')
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-rol');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

const { crearUsuarios, crearPrendas, crearClientes } = require('../controllers/datos.controller');


// INICIO DE LAS RUTAS 


router.post('/usuarios', [
    validarJWT,
    check('cantidad', 'Especifique una cantidad').not().isEmpty(),
    check('cantidad', 'Especifique una cantidad').isNumeric(),
    validarCampos
], crearUsuarios);

router.post('/prendas', [
    validarJWT,
    check('cantidad', 'Especifique una cantidad').not().isEmpty(),
    check('cantidad', 'Especifique una cantidad').isNumeric(),
    validarCampos
], crearPrendas);

router.post('/clientes', [
    validarJWT,
    check('cantidad', 'Especifique una cantidad').not().isEmpty(),
    check('cantidad', 'Especifique una cantidad').isNumeric(),
    validarCampos
], crearClientes);



module.exports = router;