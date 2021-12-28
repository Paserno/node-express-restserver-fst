const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const { crearProducto,
        obtenerProductos,
        obtenerProducto } = require('../controllers/productos.controllers');

const { existeProductoPorId } = require('../helpers/db-validators');

const router = Router();


// Obtener todas las producto - Publico
router.get('/', obtenerProductos);

// Obtener una producto por id - Publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto);

// Crear producto - Privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es Obligatorio').not().isEmpty(),
    validarCampos
],crearProducto);

// Actualizar producto por id - Privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('nombre','El nombre es Obligatorio').not().isEmpty(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], );

// Borrar una producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], );




module.exports = router;