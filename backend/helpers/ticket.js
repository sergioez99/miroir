const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const generarTicket = (cliente, usuario, prenda, talla) => {


    return new Promise((resolve, reject) => {

        const payload = {
            cliente,
            usuario,
            prenda,
            talla,
            clave: uuidv4()
        }

        // firmar el payload con nuestra clave secreta
        jwt.sign(payload, process.env.JWTSECRET, {
            expiresIn: '2m'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
        });
    });
}

const validarTicket = (ticket) => {

    const token = ticket;

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'Falta token de autorizacion'
        });
    }

    try {

        // verify no consigue la informacion tanto si el token no es válido, como si está caducado
        const { cliente, usuario, prenda, talla, ...object } = jwt.verify(token, process.env.JWTSECRET);

        const salida = {
            cliente_email: cliente,
            usuario_email: usuario,
            prendaID: prenda,
            talla: talla
        };
        return salida;


    } catch (error) {
        return null;

    }
}

const generarClaveSecreta = (long) => {

    const posible = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZñÑ,.-´ç`+¡;:_¨Ç^*?¿ª!"·$%&/()=?¿|@#~€~¬][{}';
    // no todos los caracteres están permitidos en la url (si se envia en en un GET tiene que ser esta lista)
    const posibleURL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~';

    const longitud = long;
    const lista = posibleURL;

    let salida = '';

    for (let i = longitud; i > 0; i--) {
        salida += lista[Math.floor(Math.random() * lista.length)];
    }

    return salida;

}

module.exports = { generarClaveSecreta, generarTicket, validarTicket }