const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');

const userGet = (req = request, res = response) => {
    
    const {q, nombre = 'no name', apikey, page = 1, limit} = req.query;

    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
}


const userPut = async(req, res = response) => {

    const id  = req.params.id;
    const { _id, password, google, correo, ...resto} = req.body;

    // TODO validar contra la bd
    if( password ){
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto)

    res.json({
        msg: 'put API - controlador',
        usuario
    });
}


const userPost = async(req, res = response) => {

    
    const {nombre, correo, password, rol}    = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol} );

    // Verificar si el correo existe
    // const existeEmail = await Usuario.findOne({correo});
    // if( existeEmail ){
    //     return res.status(400).json({
    //         msg: 'Este correo ya esta registrado'
    //     });
    // }

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    //Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}
const userDelete = (req, res = response) => {

    res.json({
        msg: 'delete API - controlador'
    });
}
const userPatch = (req, res = response) => {

    res.json({
        msg: 'patch API - controlador'
    });
}





module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete,
    userPatch
}