# REST Server - Carga de Archivo y Protección

Se trabajará con la __Carga de Archivos__ realizando un endpoint que reciba cualquier archivo, ademas con imagenes para los productos y usuarios, elementos utilizados

* __[REST Server con Node.js y Express](https://github.com/Paserno/node-express-restserver-fst/blob/main/README1.md)__  _(Primera versión [V1.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v1.0.0))_
* __[REST Server - CRUD con MongoDB](https://github.com/Paserno/node-express-restserver-fst/blob/main/README2.md)__  _(Segunda versión [V2.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v2.0.0))_

* __[REST Server - Autentificación de usuario - JWT](https://github.com/Paserno/node-express-restserver-fst/blob/main/README3.md)__  _(Tercera versión [V3.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v3.0.0))_

* __[REST Server - Google Sign in - Frontend y Backend](https://github.com/Paserno/node-express-restserver-fst/blob/main/README4.md)__  _(Cuarta versión [V4.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v4.0.0))_

* __[REST Server - Categorías y Productos](https://github.com/Paserno/node-express-restserver-fst/blob/main/README5.md)__  _(Quinta versión anterior [V5.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v5.0.0))_

#
### 1.- Preparando RestServer para Carga de Archivo
Para el inicio se tendran que crear algunos archivos, esto son los siguientes:
* Crear controlador `controllers/uploads.controllers.js`.
* Crear la ruta `roytes/uploads.js`.
* Agregar nueva ruta en la clase __Server__.

Ahora en el controlador de `uploads`
* Creamos la importación para apoyarnos en __Express__.
````
const { response } = require("express");
````
* Creamos la función para el endpoint enviando un mensaje para luego probarlo en __Postman__.
````
const cargarArchivo = (req, res = response) => {

    res.json({
        msg: 'Cargar archivo ... '
    })
}
````
* Realizamos la exportación de la función.
````
module.exports = {
    cargarArchivo
}
````
Ahora en `routes/uploads.js`
* Hacemos las importaciones de __Express__, __Express-validator__, validar campos y la función creada `cargarArchivo`.
````
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { cargarArchivo } = require('../controllers/uploads.controllers');
````
* Hacemos uso del metodo de __Express__ `Router()`.
* Generamos un __POST__ con la función importada del controlador.
* Realizamos la exportación de `router`.
````
const router = Router();

router.post( '/', cargarArchivo );

module.exports = router;
````
Ahora en `models/server.js`
* Creamos una nueva ruta en `paths`, para la __carga de archivos__.
````
this.paths = {
           ...
            uploads:    '/api/uploads'
        }
````
* En el metodo `routes()` de la clase Server, implementamos la nueva ruta en la que se trabajará.
````
this.app.use(this.paths.uploads, require('../routes/uploads'));
````
#