const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos } = require('../middlewares');

const { crearCategoria } = require('../controllers/catego.controllers');

const router = Router();



// Obtener todas las categorias - Publico
router.get('/', (req, res) =>{
    res.json('Get');
});

// Obtener una categoria por id - Publico
router.get('/:id', (req, res) =>{
    res.json('Get - Id');
});

// Crear categoria - Privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es Obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria);

// Actualizar categoria por id - Privado - cualquiera con token valido
router.put('/:id', (req, res) =>{
    res.json('Put');
});

// Borrar una categoria - Admin
router.delete('/:id', (req, res) =>{
    res.json('Delete');
});

module.exports = router;