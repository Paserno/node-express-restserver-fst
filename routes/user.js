const { Router } = require('express');
const { check } = require('express-validator');

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
    check('correo', 'El correo no es válido').isEmail(),
], userPost); // si son dos argumentos es el path y controlador | si son 3 hay un middlware
router.delete('/', userDelete);
router.patch('/', userPatch);






module.exports = router;