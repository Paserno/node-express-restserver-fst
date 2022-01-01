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
### 5.- Modelo de producto y rutas
Al igual como se hizo con la categoría, se replicará la creacion de los archivos, crear:
* `routes/productos.js` Se crearán las rutas para los diferentes endpint _(Recordar hacer la referencia en la clase __Server__)_.
* `models/producto.js` El modelo de los productos.
* `controllers/productos.controllers.js` El controlador de producto, donde se almacenará la logica de negocio.
Una vez creado estos archivos, comenzaremos con la referencia a la ruta en el servidor // `models/server.js`
* Se agrega la nueva ruta `productos`.
````
this.paths = {
            auth:      '/api/auth',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios:  '/api/usuarios',
        }
````
* Se agrega el paths de productos en el metodo `routes()`.
````
routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.usuarios, require('../routes/user'));
    }
````
Recordamos que se creo un archivo `index.js` en los modelos, para manejar todas las importaciones y exportaciones
* Realizamos la importación en el `index.js` de la 📂carpeta de modelos, el modelo de producto que se creara posteriormente.
````
const Producto = require('./producto');
````
* Realizamos la exportación de __Producto__.
````
module.exports = {
    Categoria,
    Producto,
    Role,
    Server,
    Usuario
}
````
Ahora crearemos el modelo de __Producto__
* Copiamos el modelo de categoría que es muy similar y lo pegamos aqui, cambiado el nombre del esquma a `ProductoSchema`.
* Podemos ver que reutilizaremos el nombre, estado y usuario.
* Agregamos adicionalmente precio, categoria, descripcion y disponible.
* Filtramos la versión de __MongoDB__ y el estado, para que no sean mostrados o enviados al __Frontend__.
* Exportamos el modelo, con el nombre __Producto__. 
````
const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
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
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: { type: String },
    disponible : { type: Boolean, default: true },
});

ProductoSchema.methods.toJSON = function()  {
    const { __v, estado,...data} = this.toObject();
    return data;
}

module.exports = model( 'Producto', ProductoSchema );
````
#
### 6.- CRUD de Productos Parte 1 : POST - GET - GET _(por ID)_
Se crearán los endpoint de __Productos__, comenzando en el controlador `controllers/productos.controllers.js`
* Realizamos las importaciones en el controlador, de __Express__ y el modelo de __Producto__.
````
const { response, request } = require('express');
const { Producto } = require('../models');
````
* Creamos la función `crearProducto` asincrona.
* Extraemos el estado, usuario para que no sean cambiado estos elementos en la creación del producto.
* Verificamos si en BD existe ya el nombre que fue enviado en el body del POST, en el caso que exista mandamos un __status 400__ de que el producto ya existe.
* Generamos la data a guardar, con el __operador spread__ `...body`, el nombre lo ponemos en mayuscula y almacenamos el ID del usuario del __TOKEN__. 
* Creamos un nuevo producto y lo guardamos en BD.
* Finalmente mandamos al __Frontend__ el producto y exportamos la fucnión creada.
````
const crearProducto = async(req, res = response) => {

    const { estado, usuario, ...body } = req.body;
    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if( productoDB ){
        return res.status(400).json({
            msg: `La producto ${ productoDB.nombre }, ya existe`
        });
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }
    const producto = new Producto( data );
    
    await producto.save();

    res.status(201).json(producto);
}
````
En `routes/productos.js`
* Importamos elementos necesario como __Express__, __Express-validator__ y algunos elementos que creamos anteriormente y usaremos, como el validador de JWT, validador de campos y el validador de rol.
* Finalmente importamos la función recien creada. _(Y las que crearemos posteriormente)_
````
const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { crearProducto } = require('../controllers/productos.controllers');
````
* Utilizamos el `Router()` de __Express__.
* En nuestro POST, ponemos la ruta por defecto, los __Middlewares__ y la función que se importo. _(Posteriormente agregaremos mas endpoits)_
* Los Middleware que utilizaremos son la de validar el JWT, que el campo nombre no este vacío y validar los campos.
* Hacemos la exportación del `router`.
````
const router = Router();

router.post('/', [
    validarJWT,
    check('nombre','El nombre es Obligatorio').not().isEmpty(),
    validarCampos
],crearProducto);

module.exports = router;
````
El __GET__ de todos los productos, ahora en `controllers/producto.controllers.js`
* Creamos la función `obtenerProductos()` asincrona.
* Extraemos de la `.query` el limite y desde, ademas solamente los elementos que tengan el estado en `true`.
* Desestructuramos 2 promesas, el total de los datos que existan y el limite `.limit()` con el desde `.skip()`.
* Enviamos al __Frontend__ el total con los productos, no olvidar exportar la función.
````
const obtenerProductos = async(req = request, res = response) => {
    
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip( Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    }); 
}
````
En `routes/produtos.js`
* Importamos la función recien creada y la usamos en el GET para traer todos los elementos.
````
router.get('/', obtenerProductos);
````
El __GET__ por id de los productos, ahora se hará un validador en `helpers/db-validators.js`
* Importamos el modelo de `Produto`.
````
const { Usuario, Categoria, Producto } = require('../models');
````
* Realizamos una función personalizada para validar si existe el id en BD, en el caso que no exista, se enviará el error que no existe el ID.
* Exportamos esta función de validación.
````
const existeProductoPorId = async ( id ) => {
    const existeProducto = await Producto.findById( id );
    if ( !existeProducto) {
        throw new Error(`El ID no existe ${id}`);
    };
}
````
Ahora en `controllers/productos.controllers.js`
* Creamos la funcón `obtenerProducto`, este tomara el id en los parametros.
* Para luego buscar en la BD, para luego mostrar los datos, usando `.populate` que permite hacer referencia a documentos en otras colecciones.
* Mandamos al __Frontend__ el producto y exportamos la función.
````
const obtenerProducto = async(req = request, res = response) => {

    const  {id}  = req.params;
    const producto = await Producto.findById(id)
                                     .populate('usuario', 'nombre')
                                     .populate('categoria', 'nombre');

    res.json({
        producto
    })
}
````
En `routes/productos.js`
* Importamos la función recien creada, para luego crear un nuevo GET que recibira el id.
* Usamos __Middlewares__ para validar, verificamos si el id es propio de __Mongo__, si existe en la BD, Validar los campos.
* Usamos la función recien creada.
````
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto);
````
#
### 7.- CRUD de Productos Parte 2 : PUT - DELETE
Continuando con los demas endpoits, nos vamos al controlador de productos.
* Creamos la función `actualizarProducto()` asincrona.
* Para la actualización necesitamos extraer el id del `.params`.
* Omitir si nos mandan el estado y el id de usuario, lo demas puede ser actualizado.
* En el caso que se nos mande el nombre, transformarlo a mayuscula y utilizar el id del token.
* Actualizamos los datos del id del producto que nos mandaron en el `.params`.
* Mandamos al __frontend__ el producto actualizado y no olvidar exportar la función.
````
const actualizarProducto = async(req, res = response) => {

    const { id } = req.params;
    const {estado, usuario, ...data} = req.body;
    
     if( data.nombre ) {
        data.nombre  = data.nombre.toUpperCase();
    }
    
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate( id, data, {new: true} );

    res.json( producto );
}
````
En `routes/productos.js`
* Importamos la función `actualizarProducto()`.
* Usamos los __Middlewares__ para la validación del JWT, verificar que el id que se nos manda existe y el validador de campos.
* Usamos la función finalmente de actualizar los productos.
````
router.put('/:id', [
    validarJWT,
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto);
````
Como ultimo endpoit el __DELETE__, vamos a `controllers/productos.controllers/js`
* Creamos la función asincrona.
* Extremos de los `.params` el id.
* Acualizamos el estado del producto del id, en `false`. _(realizando así una eliminación logica)_
* Enviamos al __Frontend__ el producto borrado, no olvidar exportar función.
````
const borrarProducto = async(req, res = response) => {
    const {id} = req.params;
    
    const productoBorrada = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});
    
    res.json(productoBorrada);
}
```` 
Ahora en `routes/productos.js`
* Importamos la función recien creada `borrarProducto()`.
* Usamos los validadores de JWT, validar el rol, validar si es un id de mongo, si existe el id en la BD y finalmente validar los campos.
* Usamos la funcón creada para hacer la eliminación logica.
````
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], borrarProducto);
````
#
### 8.- Ruta para realizar Búsquedas
Se habilitará una ruta para realizar las búsquedas hacia la Base de Dato, para esto creamos los siguientes archivos:
* En el controlador `controllers/buscar.controllers.js`.
* En las rutas `routes/buscar.js`.
* Modificamos la clase de server en `models/server.js`.
Iniciando en el controlador
* Realizamos la importación de __Express__ para tener una asistencia de tipeo.
````
const { response } = require('express');
````
* Creamos la función buscar que se usará en el GET, recibiendo la `coleccion` y `termino` de los params. 
````
const buscar = ( req, res = response) => {
    const { coleccion, termino } = req.params;

    res.json({
        coleccion,
        termino,
        msg: 'Buscar...'
    })
}
````
* Realizamos la exportación de la función. 
````
module.exports = {
    buscar
}
````
Ahora vamos a la ruta `routes/buscar.js`
* Realizamos la importación del metodo de __Express__ `Router` y importamos lo del controlador.
````
const { Router } = require('express');
const { buscar } = require('../controllers/buscar.controllers');
````
* Definimos la constante que usaremos el metodo de __Express__ y inicializamos el primer GET, con lo que se solicitará, en este caso la `/:coleccion` y `/:termino`.
* Realizamos la exportación del router. 
````
const router = Router();

router.get('/:coleccion/:termino', buscar)

module.exports = router;
````
En `models/server.js`
* En el atributo paths, creamos una nueva ruta. 
````
this.paths = {
buscar: '/api/buscar',
...
}
````
* Esta la usamos en el metodo `routes()` de la clase __Server__, le pasamos la ruta nueva del atributo.
````
this.app.use(this.paths.buscar, require('../routes/buscar'));
````
De esta manera tenemos la ruta de la busqueda hecha, la probamos con __Postman__

<img align="center" width="500" src="https://res.cloudinary.com/dptnoipyc/image/upload/v1641001706/oqngm2l3bn9lgqyd7i3a.png" />

#
### 9.- Búsquedas en Base de Datos
En este punto, se modificará la coleccion de `buscar`, para hacer la primera busqueda hacia la base de datos, comenzando con el __Usuario__
* Realizamos una importación de __Mongoose__ para apoyarnos, en este caso se usará para comprobar si el ID de __Mongo__ es valido.
* La segunda importación es de los modelos, que se usaran para hacer las busquedas.
````
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');
```` 
* Realizamos un arreglo de las búsquedas que se realizarán a las colecciones creadas. 
````
const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]
````
* Se realizará la primera busqueda hacia los usuarios, para esto creamos una función de `buscarUsuarios()` asincrona.
* Utilizamos la importación de __Mongoose__ para luego hacer la validacón del id de la busqueda, con `ObjectId.isValid()`, en el caso que la id sea validad de mongo, enviará un `true`.
* Realizamos la validación de la id, en el caso que se envié y el resultado sea `true` se realizará la busqueda en el modelo de que si existe ese elemento.
* Se manda como respuesta al __Frontend__ un arreglo llamado `results`, en el caso que el usuario exista se mandará el usuario, en el caso que sea `null` se enviará un String vacío.
````
const buscarUsuarios = async( termino = '', res = response) =>{

    const esMongoID = ObjectId.isValid( termino );

    if( esMongoID ){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results:  ( usuario ) ? [ usuario ] : []
        })
    }
}
````
* Modificamos la función `buscar()` agregando una condición, en el caso que en la `coleccion` que se entregue por los parametros, no sea lo que existe en el arreglo `coleccionesPermitidas`, saldra un __status 400__ con un mensaje.
````
const buscar = ( req, res = response) => {
    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes( coleccion ) ){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }
    ...
}
````
* Se crea un __switch__ con los diferentes casos del arrelgo y un valor por defecto, en el caso que no se mande una opción que no exista, mandando un __status 500__.
* Invocamos la función `buscarUsuarios()` creada y le pasamos 2 parametros, `termino` y `res` 
````
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        
        break;
        case 'categorias':
        
        break;
        case 'productos':
        
        break;
        
        default:
            res.status(500).json({
                msg: 'Se olvido hacer esta búsqueda'
            })
    }
````
Aquí se ve el ejemplo en el caso que se le mande un id correcto de __Mongo__, que exista en base de datos 

<img align="center" width="500" src="https://res.cloudinary.com/dptnoipyc/image/upload/v1641017062/kxlyuzcoiu6vrof9cqcj.png" />

#