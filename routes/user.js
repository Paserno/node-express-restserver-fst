const { Router } = require('express');
const { check } = require('express-validator');
const Role = require('../models/role');

const { validarCampos } = require('../middlewares/validar-campos');

const { 
    userGet,
    userDelete,
    userPatch,
    userPost,
    userPut 
    } = require('../controllers/user.controllers');

const router = Router();

router.get('/', userGet);
router.put('/:id', userPut);
router.post('/', [ // check de express-validator revisa el elemento que le enviamos
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe ser mas de 6 letras').isLength({ min:6 }),
    check('correo', 'El correo no es válido').isEmail(),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( async(rol = '') => {
        const existeRol = await Role.findOne({ rol });
        if( !existeRol ){
            throw new Error(`El rol (${ rol }) no está registrado en la BD`)
        }
    }),
    validarCampos
], userPost); // si son dos argumentos es el path y controlador | si son 3 hay un middlware
router.delete('/', userDelete);
router.patch('/', userPatch);






module.exports = router;