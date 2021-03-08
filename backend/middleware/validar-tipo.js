const { resonse } = require('express');
const tiposPermitidos = ['obj', 'jpg', 'jpeg', 'png'];

const validarTipoItem = (req, res = repsonse, next) => {

    const tipo = req.body.tipo;

    if (tipo && !tiposPermitidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo del item no es inválido, permitido: obj, jpg, jpeg y png'
        });
    }
    next();
}

module.exports = { validarTipoItem }