const { response, request } = require('express')


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
const userPost = (req, res = response) => {

    const {nombre, edad} = req.body;

    res.status(201).json({
        msg: 'post API - controlador',
        nombre,
        edad
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