/*
    Ruta base: /api/maya
*/

const { Router } = require('express')

const router = Router();

const {
    conversacion
} = require('../controllers/maya.controller');

router.post('/',[
], conversacion);

module.exports = router;