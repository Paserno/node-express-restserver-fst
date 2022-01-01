const { response } = require("express");


const cargarArchivo = (req, res = response) => {


    res.json({
        msg: 'Cargar archivo ... '
    })
}

module.exports = {
    cargarArchivo
}