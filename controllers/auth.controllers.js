const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require('../models/usuario');

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son validos - correo'
            })
        }

        // Si el usuario está activo
        if( !usuario.estado ){
            return res.status(400).json({
                msg: 'Usuario / Password no son validos - estado: false'
            })
        }

        // Verificar la contraseña
        const contraseñaValida = bcryptjs.compareSync( password, usuario.password );
        if( !contraseñaValida){
            return res.status(400).json({
                msg: 'Usuario / Password no son validos - Password'
            })
        }
        
        //Generar el JWT


        res.json({
            msg: 'Login ok'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}



module.exports = {
    login
}