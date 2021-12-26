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
### 2.- Modelo Categoría
Creamos nuestro nuevo modelo `models/categoria.js`
* Realizamos la importación de __Mongoose__.
````
const { Schema, model } = require('mongoose');
````
* Asignamos las diferentes propiedades del modelo (nombre, estado y usuario), el usuario es especial ya que necesitaremos la integridad referencial de quien creo la categoría.
````
const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});
````
* Realizaremos la exportación de nuestro modelo.
````
module.exports = model( 'Categoria', CategoriaSchema );
````
Ya que tenemos muchos modelos crearemos un archivo `models/index.js` para realizar todas las importaciones
* Realizamos todas las importaciones del modelo.
````
const Categoria = require('./categoria');
const Role = require('./role');
const Server = require('./server');
const Usuario = require('./usuario');
````
* Luego hacemos la exportaciones de cada uno.
````
module.exports = {
    Categoria,
    Role,
    Server,
    Usuario
}
````
#
### 3.- Crear una categoría
Crearemos el controlador de categoría con las validaciones `controllers/catego.controllers.js`
* Realizamos la importación de apoyo de __Express__ y del modelo de __Categoria__.
````
const { response } = require("express");
const { Categoria } = require('../models');
````
* Creamos la función asincrona del controlador.
* Realizamos la exportación de la función.
````
const crearCategoria = async(req, res = response) => {
    ...
} 

module.exports = {
    crearCategoria
}
````
*  Capturamos el nombre que nos tendran que pasar por el __body__ y lo convertimos en mayuscula con `.toUpperCase()`.
* Verificamos si existe en la __Base de Datos__ una categoría igual, en el caso que exista mandamos un __status 400__, que ya existe.
* 
````
const nombre = req.body.nombre.toUpperCase();

const categoriaDB = await Categoria.findOne({ nombre });

if( categoriaDB ){
    return res.status(400).json({
        msg: `La categoria ${ categoriaDB.nombre }, ya existe`
    });
}
````
* Luego almacenamos el nombre de la categoría mas el ID de la persona que creo esa categoría. _(En el caso que quieran enviar la Id manualmente no la recibiremos y no será almacenada)_
* Luego creamos una nueva categoría con los datos que almacenamos.
* Y luego lo gruardamos en la __Base de Datos__ y lo mandamos con un __status 201__ que se creo exitosamente
````
const data = {
    nombre,
    usuario: req.usuario._id
}

const categoria = new Categoria( data );

await categoria.save();

res.status(201).json(categoria);
````
En `routes/categorias.js`
* Nos traemos elementos __Middlewares__ como son el validar JWT y validar campos.
* Importamos el controlador.
````
const { validarJWT, validarCampos } = require('../middlewares');

const { crearCategoria } = require('../controllers/catego.controllers');
````
* Realizamos las verificaciones del endpint __POST__, en este caso validar el JWT de la persona que desee crear una nueva categoría, validar que sea enviado el nombre, y los campos.
* Finalmente si todos las validaciones pasan, se creará una nueva categoría.
````
router.post('/', [
    validarJWT,
    check('nombre','El nombre es Obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria);
````
#