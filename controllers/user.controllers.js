const { response, request } = require('express')

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

    const body    = req.body;
    const usuario = new Usuario( body );

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