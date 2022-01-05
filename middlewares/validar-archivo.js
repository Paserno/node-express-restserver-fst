const { response } = require('express');


const validarArchivoSubido = (req, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({ 
            msg: 'No hay archivos subido - validarArchivoSubido'
        });
        
    }
    next();
}


module.exports = {
    validarArchivoSubido
}