const { Router } = require('express');

const { 
    userGet,
    userDelete,
    userPatch,
    userPost,
    userPut 
    } = require('../controllers/user.controllers');

const router = Router();

router.get('/', userGet);
router.put('/', userPut);
router.post('/', userPost);
router.delete('/', userDelete);
router.patch('/', userPatch);






module.exports = router;