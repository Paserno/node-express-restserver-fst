const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');

const userGet = async(req = request, res = response) => {
    
    const { limite = 5, desde = 0 } = req.query;
    const eliLogica = {estado: true};

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(eliLogica),
        Usuario.find(eliLogica)
            .skip( Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
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

    res.json(usuario);
}


const userPost = async(req, res = response) => {

    
    const {nombre, correo, password, rol}    = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol} );

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    //Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}
const userDelete = async(req, res = response) => {

    const {id, ...resto} = req.params;

    const uid = req.uid;
    // Borrar Fisicamente 
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json({usuario, uid});
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