# REST Server - Autentificación de usuario - JWT

Esto es posterior a __[REST Server - CRUD con MongoDB](https://github.com/Paserno/node-express-restserver-fst/blob/main/README2.md)__, Este REST Server tendra autentificación con Token (JWT). Se utilizaron los siguientes elementos:
* __[REST Server con Node.js y Express](https://github.com/Paserno/node-express-restserver-fst/blob/main/README1.md)__  _(Primera versión [V1.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v1.0.0))_
* __[REST Server - CRUD con MongoDB](https://github.com/Paserno/node-express-restserver-fst/blob/main/README2.md)__  _(Segunda versión anterior [V2.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v2.0.0))_

#
> Releases [Descargables](https://github.com/Paserno/node-express-restserver-fst/releases)
#
### 1.- Ruta Auth - Login
En nuestro 📂`models/server.js`
* Creamos la ruta que usaremos en el __constructor__ de nuestra clase __Server__.
````
this.authPath = '/api/auth';
````
* En el metodo `routes()` agregamos la ruta nueva `this.authPath`, y le agregamos el `require` mandandole la ruta del archivo que crearemos.
````
 routes() {
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuariosPath, require('../routes/user'));
    }
````
Creamos el archivo en 📂`controllers/auth.controllers.js`
* Hacemos la referencia a __Express__.
* Creamos la función login, con una respuesta que emitiremos.
* Hacemos la exportación de nuestra función `login()`.
````
const { response } = require("express");

const login = ( req, res = response) => {
    res.json({
        msg: 'Login ok'
    })
}

module.exports = {
    login
}
````
Creamos el archivo en 📂`routes/user.js`
* Realizamos las referencia a __Express__ y __Express-validator__.
* Referenciamos el `validadorCampos` que creamos en la sección anterior.
* Referenciamos al controlador anteriormente creado.
````
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { login } = require('../controllers/auth.controllers');
````
* Hacemor la instancia del `Router()`.
* En `router.post` le agregamos el path `/login` y insertamos los __Midlewares__ para validar el correo y la contraseña.
* Realizamos la exportación del `router`.
````
const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'El contraseña es obligatorio').not().isEmpty(),
    validarCampos
],login);

module.exports = router;
````
#