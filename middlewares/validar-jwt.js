const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => {
    try {

        const token= req.header('x-token');

        if(!token){
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la peticion'
            });
        }
        const {uid} = jwt.verify(token, process.env.JWT_KEY);

        // Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if( !usuario){
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en DB'
            })
        }


        
        // Verificar si el uid tiene estado en true
        if( !usuario.estado){
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado false'
            })
        }

        req.usuario = usuario
        next();
        
    } catch (e) {
        return res.status(401).json({
            ok:false,
            msg: ' Token no es valido'
        });
    }
}



module.exports = {
    validarJWT
}