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
### 4.- CRUD categoría
Se creará el __CRUD__ de la categoría, con sus validaciones
* Comenzando en el controlador de categoría, creamos la función de `obtenerCategorias()`, donde mostraremos todas las categorias.
* Copiamos lo que tenemos en el controlador de usuario, mostrando el limite de 5 por defecto y viendo solo las categorías que tenga el estado de __true__.
* Realizamos 2 promesa al mismo tiempo, mostrando la totalización de las categorías y trayendo los datos segun el limite puesto.
* Enviamos como respuesta estos datos el total y las categorias. 
* Realizamos la exportación de la función.
````
const obtenerCategorias = async(req = request, res = response) => {
    
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip( Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    }); 
}
````
En `routes/categorias.js`
* Realizamos la importación y lo ponemos en el GET principal, para mostrar todas las categorías.
````
router.get('/', obtenerCategorias);
````
Ahora realizaremos el Endpoit para traer una categoría por ID, para primero realizaremos una validación en `helpers/db-validators.js`
* Ya que en varios __Endpoits__ utilizaremos la busqueda de ID, necesitamos tener un validador si existe realmente.
* No olvidar exportar la función.
````
const existeCategoriaPorId = async ( id ) => {
    const existeCategoria = await Categoria.findById( id );
    if ( !existeCategoria) {
        throw new Error(`El ID no existe ${id}`);
    };
}
````
En `controllers/catego.controllers.js`
* Creamos la función `obtenerCategoria` esta sera por el ID.
* Capturamos el parametro ID que sea enviado, y lo buscamos en la BD.
* Ademas utilizamos un metodo de __Mongoose__ el cual es `populate` que permite hacer referencia a documentos en otras colecciones, en este caso el de usuario y buscando el nombre.
* Luego mandamos la categoría que coinsida con la ID en la respuesta al frontend.
````
const obtenerCategoria = async(req = requestst, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id)
                                     .populate('usuario', 'nombre');
    res.json({
        categoria
    })
}
````
Para que no nos muestre la version de mongo y el estado, agregaremos algo al modelo `models/categoria.js`
* Capturamos la version y el estado, para luego mandarle todo lo demas como respuesta, de esta manera evitando enviar información adicional.
````
CategoriaSchema.methods.toJSON = function()  {
    const { __v, estado,...data} = this.toObject();
    return data;
}
````
En `routes/categorias.js`
* Aqui utilizamos una validación propia de mongo `.isMongoId()`
* Importamos la función crada anteriormente `existeCategoriaPorId()`, esta validación personalizada para la captura de los id en __Categoria__`, posterior invocamos el validador de campos.
* Importamos la función de buscar por id las categorías `obtenerCategoria`. 
````
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],obtenerCategoria);
````
Ahora en __Actualizar__, vamos al controlador de categorias `controllers/catego.controllers.js`
* Creamos la función `actualizarCategoria()` asincrona, la que requerimos el id de los parametros que se nos envie.
* Capturamos el estado y usuario, para que estos elementos no sean cambiados.
* El nombre lo guardamos con mayuscula y le enviamos la id de la persona del __Token__.
* Actualizamos los datos de la categoría del id correspondiente y le enviamos los datos actualizados, ademas ponemos `{new: true}` para que nos actualize los datos que mostraremos.
* Le enviamos los datos actualizados al frontend.
* Exportamos nuestra función.
````
const actualizarCategoria = async(req, res = response) => {

    const { id } = req.params;
    const {estado, usuario, ...data}    = req.body;
    
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id, data, {new: true} );

    res.json( categoria );
}
````
En `routes/categorias.js`
* Ponemos los __Middlewares__ de validar token, que el campo nombre no este vacio, que el id que nos mande sea valido y exista en la BD.
* Importamos la función recien crada y la usamos para actualizar la categoría.
````
router.put('/:id', [
    validarJWT,
    check('nombre','El nombre es Obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], actualizarCategoria);
````
Ahora realizaremos el __Borrar Categoría__, comenzando en el controlador de categoría `controllers/catego.controllers.js` 
* Creamos la función `borrarCategoria()` asincrona, la cual requiere de los parametros el ID.
* Buscamos esa categoría con la Id y le cambiamo el estado a __false__.
* Enviamos al frontend el resultado.
````
const borrarCategoria = async(req, res = response) => {
    const {id} = req.params;
    
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});
    
    res.json(categoriaBorrada);
}
````
En `routes/categorias.js`
* Colocamos los validadores de JWT, el rol es admin o vendedor, id es de MongoDB, si existe ese id en la BD y el validador de campos.
* Importamos la función recien creada de `borrarCategoria`, para su uso.
````
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
], borrarCategoria);
````
#