const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivoSubido } = require('../middlewares');
const { cargarArchivo,
        actualizarImagen,
        mostrarImagen,
        actualizarImagenCloudinary,
        mostrarImagenCloudinary } = require('../controllers/uploads.controllers');
const { coleccionesPermitidas } = require('../helpers');


const router = Router();

router.post( '/', validarArchivoSubido, cargarArchivo );

router.put('/:coleccion/:id', [
    validarArchivoSubido,
    check('id', 'El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], actualizarImagenCloudinary);
// ], actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], mostrarImagenCloudinary);
// ], mostrarImagen)

module.exports = router;