const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivoSubido } = require('../middlewares');
const { cargarArchivo, actualizarImagen, mostrarImagen } = require('../controllers/uploads.controllers');
const { coleccionesPermitidas } = require('../helpers');


const router = Router();

router.post( '/', validarArchivoSubido, cargarArchivo );

router.put('/:coleccion/:id', [
    validarArchivoSubido,
    check('id', 'El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], mostrarImagen)

module.exports = router;