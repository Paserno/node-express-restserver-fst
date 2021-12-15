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


const userPut = (req, res = response) => {

    const id = req.params.id;

    res.json({
        msg: 'put API - controlador',
        id
    });
}
const userPost = async(req, res = response) => {

    const {nombre, correo, password, rol}    = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol} );

    // Verificar si el correo existe

    // Encriptar la contraseña
    // genSaltSync numeros de vuelta que le daremos a la cryptacion dificultad (default 10)
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    //Guardar en BD
    await usuario.save();

    res.status(201).json({
        msg: 'post API - controlador',
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