# REST Server - Categorías y Productos

Se creará 2 nuevas colecciones de __Categoría__ y __Productos__ la que se aplicarán relaciones entre las diferentes colecciones para su manejo en __Base de Datos__, elementos utilizados

* __[REST Server con Node.js y Express](https://github.com/Paserno/node-express-restserver-fst/blob/main/README1.md)__  _(Primera versión [V1.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v1.0.0))_
* __[REST Server - CRUD con MongoDB](https://github.com/Paserno/node-express-restserver-fst/blob/main/README2.md)__  _(Segunda versión [V2.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v2.0.0))_

* __[REST Server - Autentificación de usuario - JWT](https://github.com/Paserno/node-express-restserver-fst/blob/main/README3.md)__  _(Tercera versión [V3.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v3.0.0))_

* __[REST Server - Google Sign in - Frontend y Backend](https://github.com/Paserno/node-express-restserver-fst/blob/main/README4.md)__  _(Cuarta versión anterior [V4.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v4.0.0))_


#
### 1.- CRUD - Rutas de Categoría
Ahora trabajaremos con Categorías, para esto tendremos que crear los Endpoint para su manejo pero antes...
* Se crearán los archivos que manejaremos, vamos a los controladores y creamos `controllers/catego.controllers.js` aqui realizaremos el manejo de la categoría.
* Luego haremos la creacion de la ruta `routes/categorias.js`.

Una vez creado estos dos archivos iremos a `models/server.js` a declarar la nueva ruta que utilizaremos para las categorías

* Ya que en nuestro clase __Server__ utilizamos mas de 1 ruta, realizaremos un objeto literal donde almacenaremos todas las rutas.
* Creamos la nueva ruta de `categoria` para realizar las diferentes peticiones.
````
this.paths = {
            auth:      '/api/auth',
            categoria: '/api/categorias',
            usuarios:  '/api/usuarios',
        }
````
* En el metodo `routes()` insertaremos nuestra nueva ruta con su importación requerida de `routes/categorias.js`.
````
this.app.use(this.paths.categoria, require('../routes/categorias'));
````
Ahora vamos a `routes/categorias.js` para declarar los endpoint
* Agregamos las importaciones que utilizaremos.
````
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
````
* Utilizamos el metodo propio de __Express__ `Router()`.
* Agregamos un endpoint GET para obtener todas las categorías, esta sera publica.
* Otro GET para obtener una categoría por id, que tambien será publica.
* Una creación de categoría, esta será privada y solo se podra crear con un token valido.
* Un actualizar categoría por id, este es Privado y cualquiera con token valido podrá actualizarlo.
* Finalmente un borrar categoría, solo el que tenga el rol de __Admin__ podra realizar la eliminación.
````
const router = Router();

router.get('/', (req, res) =>{
    res.json('Get');
});

router.get('/:id', (req, res) =>{
    res.json('Get - Id');
});

router.post('/', (req, res) =>{
    res.json('Post');
});

router.put('/:id', (req, res) =>{
    res.json('Put');
});

router.delete('/:id', (req, res) =>{
    res.json('Delete');
});
````
#