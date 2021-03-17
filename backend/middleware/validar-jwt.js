const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {

    const token = req.header('x-token') || req.query.token;

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'Falta token de autorizacion'
        });
    }

    try {

        // verify no consigue la informacion tanto si el token no es válido, como si está caducado
        const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);

        req.uid = uid;
        req.rol = rol;

        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });

    }
}

module.exports = { validarJWT };