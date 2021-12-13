const { response } = require('express')


const userGet = (req, res = response) => {
    
    res.json({
        msg: 'get API - controlador'
    });
}


const userPut = (req, res = response) => {

    res.status(500).json({
        msg: 'put API - controlador'
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