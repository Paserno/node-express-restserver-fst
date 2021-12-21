const { response } = require("express")


// Validar si el rol es ADMIN
const esAdminRole = ( req, res = response, next) => {

    if( !req.usuario ){
        return res.status(500).json({
            msg: 'Se quiere verificar el role, sin validar el token Primero'
        })
    }
    const { rol, nombre } = req.usuario;
    
    if( rol !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: `${ nombre } no es administrador - No puede hacer esto`
        });
    }

    next();
}
//! operador rest "resto de operadores"
const tieneRole = ( ...roles ) => {

    return (req, res = response, next) => {
        
        if( !req.usuario ){
            return res.status(500).json({
                msg: 'Se quiere verificar el role, sin validar el token Primero'
            });
        }

        if( !roles.includes( req.usuario.rol )){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            });
        }

        next();
    }
}


module.exports = {
    esAdminRole,
    tieneRole
}