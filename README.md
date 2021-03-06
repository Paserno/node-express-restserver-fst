> __Elemento Anterior 馃憖:__ __[Creaci贸n de un Webserver](https://github.com/Paserno/node-express-webserver-first)__
#
> Releases [Descargables](https://github.com/Paserno/node-express-restserver-fst/releases)
# Contenido


| N掳      | Nombre      | Descripci贸n |Ir|
| ----------- | ----------- | ----------- | ----------- |
|__1__| **REST Server con Node.js y Express**| Creaci贸n de un Cascar贸n del RestServer - Endpoint Basico |__[Cascar贸n](https://github.com/Paserno/node-express-restserver-fst#rest-server-con-nodejs-y-express)__
|__2__| **REST Server - CRUD con MongoDB**| Creaci贸n de CRUD en BD con Encripaci贸n de Contrase帽a y Validar Campos|__[CRUD con MongoDB](https://github.com/Paserno/node-express-restserver-fst#rest-server---crud-con-mongodb)__
|__3__| **REST Server - Autentificaci贸n de usuario - JWT**| Protecci贸n de Rutas, Validaci贸n de Roles y Usuarios con JWT|__[JWT](https://github.com/Paserno/node-express-restserver-fst#rest-server---autentificaci贸n-de-usuario---jwt)__
|__4__| **REST Server - Google Sign in - Frontend y Backend**| Implementaci贸n de Google Sing-in, Validarci贸n en Backend y Boton en Frontend|__[Google Sign in](https://github.com/Paserno/node-express-restserver-fst#rest-server---google-sign-in---frontend-y-backend)__
|__5__| **REST Server - Categor铆as y Productos**| Nuevos CRUDs con B煤squeda Insensibles |__[Categor铆as y Productos](https://github.com/Paserno/node-express-restserver-fst#rest-server---categor铆as-y-productos)__
|__6__| **REST Server - Carga de Archivo y Protecci贸n**| Creacion de L贸gica de manejo de Archivos Locales y Almacenarlo - Subida de Archivos a Cloudinary|__[Carga de Archivo](https://github.com/Paserno/node-express-restserver-fst#rest-server---carga-de-archivo-y-protecci贸n)__

#
# REST Server con Node.js y Express
Este es un Rest Server B谩sico que sirve como cascar贸n y para aprender a configurarlo. Se utilizaron los siguientes elementos:
* __[Express](https://www.npmjs.com/package/express)__ - [Pagina Oficial](https://expressjs.com)
* __[Doenv](https://www.npmjs.com/package/dotenv)__
* __[Cors](https://www.npmjs.com/package/cors)__

#
> Releases [Descargables](https://github.com/Paserno/node-express-restserver-fst/releases)
#
#### Para reconstruir los modulos de node ejecute el siguiente comando.
````
npm install
````
#
> __Elemento Posterior 馃憖:__ __[Socket Server Basico](https://github.com/Paserno/node-socket-server-basic)__
#
### 1.- Express Basado en Clase
Creamos lo mismo de __[Creaci贸n de un Webserver](https://github.com/Paserno/node-express-webserver-first#uso-de-express-)__ pero con clase esta vez.
* Creamos la clase __Server__, con su constructor.
* Realizamos la importacion de __Express__.
* Con los diferentes elementos que utilizaremos, el puerto, y algunos metodos como `this.middlewares();` y `this.routes();`.
````
const express = require('express')

class Server {
    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        this.middlewares();

        this.routes();
    }
}
````
* Definimos los metodos a utilizar en la clase __Server__.
* Con `middlewares(){...}` hacemos uso de nuestros elementos estaticos que estan en la carpeta __Public__.
* Con `routes() {...}` utilizamos la ruta `/api` para mostrar un `Hello World`.
* Con `listen(){...}` es el puerto que utilizaremos para levantar la aplicaci贸n.
````
    middlewares(){

        // Directorio Publico
        this.app.use( express.static('public'))

    }
    routes() {
        this.app.get('/api', (req, res) => {
            res.send('Hello World');
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        });
    }
````
* No olvidar realizar la exportaci贸n de la clase
````
module.exports = Server;
````
En `app.js`
* Realizamos las importaciones respectivas.
* Y el llamado a la clase creada __Server__.
````
require('dotenv').config();
const Server = require('./models/server');

const server = new Server();

server.listen();
````
#
### 2.- Peticiones HTTP - GET - PUT - POST - DELETE
* En la ruta `routes()` creamos las diferentes peticiones, la que probamos con __Postman__.
````
this.app.get('/api', (req, res) => {
    res.json({
        msg: 'get API'
    });
});
this.app.put('/api', (req, res) => {
    res.json({
        msg: 'put API'
    });
});
this.app.post('/api', (req, res) => {
    res.json({
        msg: 'post API'
    });
});
this.app.delete('/api', (req, res) => {
    res.json({
        msg: 'delete API'
    });
});
this.app.patch('/api', (req, res) => {
    res.json({
        msg: 'patch API'
    });
});
````
#
### 3.- Usando codigo de respuesta HTTP con Express 馃敳
Estos son  algunos de los codigo de restpuestas HTTP mas utilizados.

<img align="center" width="800" src="https://1.bp.blogspot.com/-l4ENbjEoXDw/XD9PPNWIxmI/AAAAAAAAV5M/uVEboPRHjjEKvQ4KOHWpOiGwduqGVNFtACLcBGAs/s1600/statuscode.png" />

<br>

* Un ejemplo de un __POST__ usado el codigo __201__ de creado correctamente, esto se puede comprobar con __Postman__.
````
this.app.post('/api', (req, res) => {
            res.status(201).json({
                msg: 'post API'
            });
        });
````
#
### 4.- CORS - Middleware
__"CORS o Intercambio de recursos entre or铆genes. Es un mecanismo para permitir o restringir los recursos solicitados en un servidor web dependiendo de d贸nde se inici贸 la solicitud HTTP. Esta pol铆tica se utiliza para proteger un determinado servidor web del acceso de otro sitio web o dominio"__
* Hay que instalar el cors para su uso, para luego realizar la importaci贸n.
````
const cors = require('cors');
````
* Ya que esto es un Middleware _(lo identificamos por su uso de `.use()`)_.
* Esto lo ponemos en nuestra clase __Server__ dentro del metodo `middleware()`, para su uso.
````
//CORS
this.app.use( cors() );
````
#
### 5.- Separar las rutas y el controlador de la clase
Se crearon 2 馃搨carpetas, una llamada __馃搨routes__ y __馃搨controllers__, de esta manera no tenemos todo el codigo en la clase __Server__
* Quitamos los elementos que teniamos en el metodo `routes()` de la clase __Server__, y lo guardamos en el nuevo archivo llamado `user.js` que se encuenta en la carpeta __馃搨routes__.
* Realizamos la importacion de __Express__ y pedimos el elemento __Router__.
* Exporamos el elemento `router`.
````
const { Router } = require('express');

const router = Router();

router.get(...);
router.put(...);
router.post(...);
router.delete(...);
router.patch(...);

module.exports = router;
````
Nos vamos a la nueva carpeta __馃搨controllers__ y creamos el archivo `user.controllers.js`
* Realizamos una importacion de __Express__ y nos traemos el elemento `response`
````
const { response } = require('express')
````
* Tomamos el contenido de nuestras rutas, y lo dejamos en nuestro __controlador__, y luego pegamos los __Callback__ y les declaramos una constante para su llamado.
* Al `res.` le entregamos el elemento de __Express__.
````
const userGet = (req, res = response) => {
    res.json({
        msg: 'get API - controlador'
    });
}
const userPut = (req, res = response) => {
    res.status(500).json({
        msg: 'put API - controlador'
    });
}
````
* Luego realizamos la exportaci贸n de todas las funciones creadas en el controlador.
````
module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete,
    userPatch
}
````
Volvemos al la archivo `user.js` de la 馃搨carpeta  __routers__ 
* Realizamos la importaci贸n de los diferentes elementos del controlador.
* Y pasamos por referencia los elementos del controlador.
````
const { userGet,userGet...  } = require('../controllers/user.controllers');
router.get('/', userGet);
router.put('/', userGet);
````
En nuestra clase __Server__
* En el controlador dejamos de la clase __Server__, dejamos la ruta de usuario.
````
this.usuariosPath = '/api/usuarios';
````
* Nos vamos a nuestro metodo y le pasamos la ruta de usuario y de donde lo sacaremos.
````
routes() {
        this.app.use(this.usuariosPath, require('../routes/user'))
    }
````
#
### 6.- Obtener Datos por POST
Un procedimiento muy comun es recibir mensaje atravez del endpoint
* Para esto nos vamos a la metodo `middleware()` de la clase __Server__, donde recibiremos algunos datos por body, gracias a __Postman__.
* Recibiendo el `nombre` y `edad` por tipo __JSON__.
<br><br>

<img align="center" width="800" src="https://res.cloudinary.com/dptnoipyc/image/upload/v1639436298/qgeykpmegopnooz3ehhs.png" />
<br><br>


* Para esto utilizaremos `express.json()` que esto har谩 una serializaci贸n a un formato __JSON__.
````
// Lectura y parser del body
this.app.use( express.json() );
````
Ahora vamos al controladore de __usuario__
* En el funci贸n de POST, tenemos que extraer los elementos que nos quieren mandar.
* Para eso hacemos una desestructuracion de elementos, para tomar el `nombre` y `edad` solamente, en el caso que se envie otro elemento no lo recibiremos en este caso.
* Luego lo mandamos como mensaje en el objeto literario.
````
const userPost = (req, res = response) => {

    const {nombre, edad} = req.body;

    res.status(201).json({
        msg: 'post API - controlador',
        nombre,
        edad
    });
````
* Ah铆 mostramos el resultado de la petici贸n por POST
<br>

<img align="center" width="500" src="https://res.cloudinary.com/dptnoipyc/image/upload/v1639438121/fhlw7s9co5eotv4s5nya.png" />
<br><br>

#
### 7.- Parametros de segmento y query
En el caso que queramos mandar alguna id en particular, para actualizar un registro, o dato a travez de la __URL__, necesitaremos tomar esos datos de alguna forma...
* En este caso estamos en la 馃搨carpeta __routes__ con `user.js`, este ejemplo sera PUT, en el caso que queramos actualizar un dato, de por si __Express__ nos ayuda con esto y le mandamos la `/:id`.
````
router.put('/:id', userPut);
````
Ahora en el controlador de usuarios
* Definimos una costante con nombre `id`, luego usamos el `request` con `params` para tomar la `id` que nos fue mandada por el `user.js`.
* Luego mandamos un mensaje de la id que recibiremos
````
const userPut = (req, res = response) => {

    const id = req.params.id;

    res.json({
        msg: 'put API - controlador',
        id
    });
}
````
* Con __Postman__ mandamos en la url `/50` que se capturaria por la funci贸n PUT como la id.
<br>

<img align="center" width="750" src="https://res.cloudinary.com/dptnoipyc/image/upload/v1639440177/wpzuqoyfusiy5sgcqbnd.png" />
<br><br>

*  Aqui recibimos la resupuesta.
<br>
<img align="center" width="400" src="https://res.cloudinary.com/dptnoipyc/image/upload/v1639440337/sr60xvyfe02bwukss8i2.png" />
<br><br>

Ahora en el caso que queramos recibir una __query params__ y la querramos utilizar

* El ejemplo con GET capturando __query params__


<img align="center" width="750" src="https://res.cloudinary.com/dptnoipyc/image/upload/v1639440652/nwsd6gcmrd2aqj5xdh93.png" />
<br><br>

* En la funcion `userGet` definimos una constante, desestructurando los elementos que recibiremos.
* En el caso que no nos manden ciertos parametros podemos definirlos, como en el ejemplo el `nombre` y `page`.
````
const userGet = (req = request, res = response) => {
    const {q, nombre = 'no name', apikey, page = 1, limit} = req.query;

    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
}
````
*  Aqui mostramos los resultados obtenidos, y ademas los datos por defecto.

<br>
<img align="center" width="500" src="https://res.cloudinary.com/dptnoipyc/image/upload/v1639440881/nevalyzvfibaksh1p6n3.png" />
<br><br>

#
> [Volver](https://github.com/Paserno/node-express-restserver-fst#contenido)
# REST Server - CRUD con MongoDB
Este es un Rest Server - con adiciones como un CRUD hecho con MongoDB. Se utilizaron los siguientes elementos:
* __[REST Server con Node.js y Express](https://github.com/Paserno/node-express-restserver-fst#rest-server-con-nodejs-y-express)__ _(Elemetos que se habian utilizado aqu铆 +)_
* __[MongoDB Atlas](https://www.mongodb.com/atlas/database)__
* __[Mongoose](https://mongoosejs.com)__
* __[Bcryptjs](https://www.npmjs.com/package/bcryptjs)__
* __[Express-validator](https://www.npmjs.com/package/express-validator)__ _([docs](https://express-validator.github.io/docs/))_

#
### 1.- Conexion a la Base de Datos con Mongoose
Nos vamos al archivo que se encuentra en la raiz llamado `.env`, para establecer la conexi贸n a la base de datos.
* Donde teniamos definido el puerto, creamos una variable de entorno nueva, y ahi ponemos el enlace para conectarnos a la base de datos, en este caso a la de __MongoDB Atlas__.
````
PORT=8081
MONGODB_CNN= XXXXXXXXXXXXXXXX
````
Se creo una 馃搨carpeta llamada __database/__ con un archivo `config.js`
* Se realiza la importaci贸n a mongoose recien instalado.
* En el archivo `config.js` se creo una funci贸n asincrona para realizar la conexi贸n.
* Realizamos la exportacion de la funci贸n recien creada.
````
const mongoose = require('mongoose');

const dbConnection = async() => {...}

module.exports = {
    dbConnection
}
````

* Se creo un __try-catch__ dentro de la funci贸n __dbConnection__ en caso de presentar un error de conexi贸n a la base de datos.
* Realizamos la conexi贸n gracias a __mongoose__, y realizamos una impresi贸n por consola si nos encontramos conectado a la base de dato.
* Para lego hace la impreci贸n del `error` y un mensaje de que no se pudo conectar a la base de dato dentro del __catch__.
````
try {
    await mongoose.connect( process.env.MONGODB_CNN);
    console.log('Base de datos online');
        
}catch (error) {
    console.log(error);
    throw new Error('Error al iniciar la Base de Datos');
}
````
Nos vamos a la clase __Server__
* Importamos la funci贸n de __database/`config.js`__.
````
const { dbConnection } = require('../database/config');
````
* Creamos un metodo asincrono llamado `conectarDB()`, donde llamamos la funci贸n recine importada. 
````
async conectarDB(){
        await dbConnection();
    }
````
* Colocamos en el __constructor__ de la clase __Server__ el metodo anteriormente creeado.
````
// Connectar a Base de datos
    this.conectarDB();
````
#

### 2.- Modelo de Usuario
Aqu铆 crearemos el primer modelo de usuario
* Realizamos las importaciones de __Mongoose__ y los elementos que necesitaremos _(esquema, modelo)_.
* Creamos el objeto litaral que usaremos para los usuarios `UsuarioSchema`.
* Exportamos la funci贸n `model` de __Mongoose__ con el nombre que le pondremos a la colecci贸n en BD __Usuario__ y el objeto literario `UsuarioSchema`.
````
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({...});

module.exports = model( 'Usuario', UsuarioSchema );
````
* Nuestro objeto literario tendra todos estos elementos mostrados.
* Si el elemento es requerido ponesmo `required` con __true__ y un mensaje si es necesario.
* En el caso que no querramos un valor repetido usamos `unique: true`.
* Si vamos a usar algunos valores ya defindos en el caso de `rol`, utilizaremos las dos opciones que queremos mostrar `emun: ['ADMIN_ROLE', 'USER_ROLE']`, un rol de usuario y uno de administrador.
* En el caso de poner un valor por defecto como en `estado` y `google` podremos `default:`.
````
 nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El contrase帽a es obligatorio'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE'],
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
````
#
### 3.- POST: Creando un usuario en BD
Estamos en el __Controlador de Usuarios__ (`controllers/user.controlers.js`) para realizar la inserci贸n a la BD de MongoDB
* Para esto es necesario importar nuestro modelo de usuario (`models/usuario.js`) a nuestra __coleccion de usuario__. 
````
const Usuario = require('../models/usuario');
````
En la funci贸n __userPost__ realizaremos los cambios, para recibir al nuevo usuario en BD _(convertir la funci贸n a una asincrona)_
* Capturamos los elementos en nuestra constante `body`.
* Creamos una nueva instancia de `Usuario`, enviandole lo que recibimos en `body`.
* Realizamos un guardado en base de datos de lo que recibiremos por POST `.save()`, poner el `await` para esperar el guardado de los datos.
* Luego le hacemos una impresi贸n de los datos que se guardaron en `usuario`  a travez de `msg:`. 
````
const userPost = async(req, res = response) => {
    const body    = req.body;
    const usuario = new Usuario( body );
    await usuario.save();

    res.status(201).json({
        msg: 'post API - controlador',
        usuario
    });
}
````
* Le mandado un JSON en el raw gracias a __Postman__.
<br>
<img align="center" width="500" src="https://res.cloudinary.com/dptnoipyc/image/upload/v1639529791/ewh0dhhzrsxiiuxz1fea.png" />
<br>

* Recibimos la impresi贸n de los datos. 
<br>
<img align="center" width="500" src="https://res.cloudinary.com/dptnoipyc/image/upload/v1639529895/qgyvqduxk5zfmv9fthbr.png" />
<br>

* Y finalmente tenemos el guardado del dato en la BD creada.
<br>
<img align="center" width="370" src="https://res.cloudinary.com/dptnoipyc/image/upload/v1639529980/feftwogwm1puqdhzl5at.png" />
<br>

#
### 4.- Bcryptjs - Encripar Contrase帽as
* Una vez realizada la instalacion de __Bcryptjs__ realizamos la importaci贸n.
````
const bcryptjs = require('bcryptjs');
````
* En la funci贸n `userPost` realizamos la desestructuraci贸n de lo que recibiremos.
````
const {nombre, correo, password, rol}    = req.body;
const usuario = new Usuario( {nombre, correo, password, rol} );
````
* Antes de guardar en base de datos realizamos la encriptaci贸n de la contrase帽a.
* Para esto usamos el metodo propio de __Bcryptjs__ el cual es `genSaltSync`, esto es el numero de vuelta que se le dara a la encriptacion "dificultad", pero por defecto es 10, entre mayor sea mas tiempo tomara.
* Utilizamos la encripaci贸n de una sola via con `.hashSync()` este metodo necesita la propiedad que queremos incriptar, en este caso el `password` y su "dificultad" con nuestra constante `salt`.
````
const salt = bcryptjs.genSaltSync();
usuario.password = bcryptjs.hashSync( password, salt );
````
#
### 5.- Validar Campos Obligatorios - Email
Es necesario hacer algunas validaciones dentro de nuestra aplicaci贸n, en este caso nos enfocaremos en el correo para realizar las validaciones correspondientes, aqui utilizaremos __Express-validator__ <br>
Estamos en el __controlador de usuarios__
* Realizamos una valizacion en el controlador, en la metodo `userPost`, para validar si existe el correo que fue enviado.
* En el caso que exista retornara un codigo __400__ _(Petici贸n incorrecta)_ con un mensaje diciendo que existe el correo enviado.
````
const existeEmail = await Usuario.findOne({correo});
    if( existeEmail ){
        return res.status(400).json({
            msg: 'Este correo ya esta registrado'
        });
    }
````
En el archivo que se encuentra en la 馃搨carpeta `routers/user.js`
* Instalamos __Express-validator__ y lo importamos en `routers/user.js`.
````
const { check } = require('express-validator');
````
* Buscamos la ruta del POST donde tenemos la referencia del __controlador de usuario__.
* Le a帽adimos un tercer argumento a nuesta ruta POST, esto significa que le mandaremos un __Middlewares__.
* Utilizamos el metodo `check` de __Express-validator__, esto hara que se revisen los elementos en este caso el __correo__ que fue enviado.
````
router.post([
    check('correo', 'El correo no es v谩lido').isEmail(),
], userPost); 
````
Ahora en el __controlador de usuario__ _(馃搨`controllers/user.controllers.js`)_
* Realizamos la importacion de __Express-validator__.
````
const { validationResult } = require('express-validator');
````
* En nuestro funci贸n `userPost` revisamos si existe algun error y mandamos el metodo `validationResult` y le enviamos la solicitud `req`.
* En el caso que haya errores enviaremos un status __400__ _(Petici贸n incorrecta)_ y mandamos los errores creados por el __Express-validator__.
````
const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json(errors);
    }
````
#
### 6.- Validar Todos los Campos Necesarios
Ahora realizaremos todas las validaciones que necesita para la funci贸n POST _(nombre, contrase帽a y rol)_, ademas de que es necesario que se realizen mas validaciones dentro de la aplicacion por ejemplo en las funciones que asignamos para GET - PUT - DELETE, para no realizar muchos __Copy-Paste__ haremos una funci贸n separada para realizar las validaciones. 

<br>

Creamos una nueva 馃搨carpeta llamada __middlewares__ y agregamos un archivo llamado `validar-campos.js` 

* Importamos __Express-validator__ y lo sacamos de `user.controllers.js`.
````
const { validationResult } = require('express-validator');
````
* Creamos nuestra nueva funci贸n `validarCampos()` necesitamos los diferentes parametros `( req, res, next )`.
* Necesitaremos el parametro `next()` para cuando pase nuestra validaci贸n siga al siguiente __"Middleware"__.
````
const validarCampos = ( req, res, next ) => {

    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json(errors);
    }

    next();
}
````
Ahora en `routes/user.js`
* Realizamos las validaciones de nombre usando `.not().isEmpty()` para que el campo __nombre__ sea enviado y no llegue vacio.
* En la __contrase帽a__ establecemos un largo minimo de  6 con `.isLength({ min:6 }`.
* Y en el __rol__ buscaremos entre las 2 opciones que necesitamos `.isIn(['ADMIN_ROLE', 'USER_ROLE'])`.
* Finalmente enviamos el __Middlewares__ `validarCampos`, para que en el caso que exista un error llegue hasta el validador del campo y no pase a la funci贸n POST.
````
router.post('/', [ 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contrase帽a debe ser mas de 6 letras').isLength({ min:6 }),
    check('correo', 'El correo no es v谩lido').isEmail(),
    check('rol', 'No es un rol v谩lido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos
], userPost);
````
#
### 7.- Validar Rol contra la Base de Datos
Ahora realizamos la validaci贸n del rol hacia la base de datos, ya que si la tenemos el dato en "duro", puede que en el d铆a de ma帽ana necesitemos agregar un nuevo rol y para esto tendriamos que detener la aplicaci贸n, por este motivo es mejor manejarlo por __Base de Dato__

<br>

Creamos un nuevo __modelo__ llamado `role.js` 
* Creamos la referencia a __Mongoose__ ya que necesitamos el __esquema y el modelo__.
````
const { Schema, model } = require('mongoose');
````
* Creamos el objeto `RoleSchema` donde tendremos el rol.
* Este rol sera requerido.
* Realizamos la exportaci贸n con el nombre __Role__
````
const RoleSchema = Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio'],
    }
});

module.exports = model( 'Role', RoleSchema );
````
Ahora en 馃搨`routes/user.js`
* Modificamos nuestra validacion de rol en la funci贸n POST.
* Colocamos el __Middelware__ `check` para evaluar el `rol`, le mandaremos el `.custom()` para realizar una __verificaci贸n personalizada__.
* Creamos una funci贸n asincrona `async(rol = '')` el cual el rol evaluara lo que se mande por el __body__ de la petici贸n __POST__ y le definimos un __String__ vac铆o en el caso que no venga.
* Realizamos una validaci贸n de que si existe el __Rol__ con el `.findOne({ rol })` que nos enviar谩n en el __body__.
* En el caso que no exista entrar谩 en nuestra condici贸n, mandando un __Error__.
````
check('rol').custom( async(rol = '') => {
        const existeRol = await Role.findOne({ rol });
        if( !existeRol ){
            throw new Error(`El rol (${ rol }) no est谩 registrado en la BD`)
        }
    }),
````
#
### 8.- Centralizar la Validaci贸n de Rol
Sacaremos la validaci贸n hecha en la parte anterior, para centralizarla para esto creamos un 馃搨carpeta __helper/__ con su archivo `db-validators.js`.

<br>

Extrayendo lo recien creado en la funci贸n POST especificamente en la validaci贸 del __rol__
* Esto lo tomamos y lo dejamos en nuestro nuevo archivo `db-validators.js`.
* Extraemos la importacion de __Role__.
* Creamos una constante `esRolValido` donde almacenaremos la funci贸n que se extrajo de la validaci贸n de __rol__.
* Realizamos la exportaci贸n de la funci贸n creada.
````
const Role = require('../models/role');

const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if( !existeRol ){
        throw new Error(`El rol (${ rol }) no est谩 registrado en la BD`)
    }
}

module.exports = {
    esRolValido
}
````
En `routes/user.js`
* Importamos la funci贸n recien creada __esRolValido__.
````
const { esRolValido } = require('../helpers/db-validators');
````
* Y en la validaci贸n del __rol__ colocamos nuestra importaci贸n. _(Lo del ejemplo es equivalente a esto `.custom(rol => esRolValido(rol))`)_
````
check('rol').custom( esRolValido ),
````
Para quitar la contrase帽a de nuestra respuesta al __POST__ de una forma global, iremos a nuestro modelo de `usuario.js`
* Sobrescribiremos el `.toJSON`, necesitaremos una funci贸n normal, para utilizar el `this` para dar una referencia a una instancia creada.
* Realizamos la desestructuracion de la versi贸n `__v`, la contrase帽a `password` y lo demas utilizando el operador spread `...usuario`
* El `this.toObject()` genera una instancia con sus valores respectivo, como si fuera un objeto literar de JavaScript.
* Finalmente retornamos el `usuario`, dando asi todo el contenido exepto la contrase帽a y la versi贸n.
````
UsuarioSchema.methods.toJSON = function()  {
    const { __v, password, ...usuario} = this.toObject();
    return usuario;
}
````
* As铆 se muestra el contenido, exeptuando la contrase帽a y la versi贸n.

<br>

<img align="center" width="500" src="https://res.cloudinary.com/dptnoipyc/image/upload/v1639555719/lztzzljo1uvw1snjingc.png" />
<br>

#
### 9.- Custom Validaci贸n del Correo
Extrayendo la validaci贸n que teniamos en la funci贸n `userPost` que realizaba una validaci贸n en los correos (馃搨`controllers/user.controllers.js`) y creando una mas centralizada en nuestra 馃搨carpetra `helpres/db-validators.js`
* Realizamos la importaci贸n de `Usuario`.
````
const Usuario = require('../models/usuario');
````
* Creamos una constante llamada `emailExiste` y le asignamos una funci贸n asincrona _(extrayendo y pegado aqu铆 lo que teniamos en el controlador)_.
* Realizamos una validaci贸n de que si existe el correo, en el caso que exista se emitira un error, de que el correo ya esta registrado.
````
const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`Este (${correo}) ya esta registrado`)
    };
}
````
En `routes/user.js`
* Realizamos la exportaci贸n de nuestra nueva funci贸n `emailExiste`.
````
const { esRolValido, emailExiste } = require('../helpers/db-validators');
````
* En el router POST, agregamos una nueva validaci贸n personalizable, que evaluar谩 el correo que se envie.
````
check('correo').custom(emailExiste),
````
#
### 10.- PUT Actualizar informaci贸n de usuario
Ahora haremos funcional nuestra funci贸n POST, donde si le enviamos algun __id__ pueda actualizar en base de datos, los datos que le mandemos
* Nos vamos a nuestro metodo `userPut` en el controlador, y le implementamos los cambios.
* Es necesario la id para la actualizaci贸n de datos, y cremoas una desestructuraci贸n para tomar los datos que queramos exluir o necesitar _(extraemos el correo ya que nos manda error por una validaci贸n)_.
* Realizamos una validaci贸n si la contrase帽a que nos envian es correcto a lo que se encuentra en bd.
* Utilizamos la funci贸n de __Mongoose__ `.findByIdAndUpdate()`, la que nos ayudar谩 con la actualizaci贸n de los datos, para esto es necesario mandarle la id y lo que queremos actualizar.
````
const userPut = async(req, res = response) => {
    const id  = req.params.id;
    const {_id, password, google, correo, ...resto} = req.body;

    if( password ){
        // Encriptar la contrase帽a
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }
    const usuario = await Usuario.findByIdAndUpdate( id, resto)
    res.json({
        msg: 'put API - controlador',
        usuario
    });
}
````
#
### 11.- Validaci贸n adicional en el PUT
Realizaremos validaciones del envio del ID, en el caso que nos manden otro id o otra cosa que no sea el id de __Mongodb__
* Estamos en 馃搨`helpres/db-validators.js` donde se crear谩 una funci贸n assincrona llamada `existeUsuarioPorId`.
* Usamos la funci贸n de __Mongoose__ `.findById()` para encontrar el id.
* Luego hacemos una validaci贸n si el id que nos manda no existe, se enviara un error de que no existe el id.
````
const existeUsuarioPorId = async ( id ) => {
    const existeUsuario = await Usuario.findById( id );
    if ( !existeUsuario) {
        throw new Error(`El ID no existe ${id}`);
    };
}
````
En `routes/user.js`
* Realizamos diferentes validaci贸nes, en el caso que la id no sea valida usaremos `.isMongoId()` comprobando si es una id valida propiemante de __MongoDB__.
* Enviaremos la validaci贸n creada anteriormente `existeUsuarioPorId` _(no olvidar realizar la importaci贸n)_, de esta manera comprueba si exactamente existe esa id en la base de datos.
* La validaci贸n del rol, de esta manera siempre recibiremos el rol correcto, pero tendremos que mandar siempre el rol.
* Usar el `validarCampos` para que en el caso que surga un error no pase al siguiente paso, de ejecutar el controlador.
````
router.put('/:id',[
    check('id', 'No es un ID v谩lido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( esRolValido ),
    validarCampos
], userPut);
````
#
### 12.- GET: Obtener todos los usuarios de forma paginada
En nuestro controlador
* En nuestra funci贸n GET, le agregamos un `async`.
* Desestructuramos dos elementos que esperamos recibir, el `limite` dandole un valor por defecto de 5 y `desde`.
* Agregamos la funci贸n `.find()` para traer ciertos elementos.
* Usamos el `.skip()` para traer los elementos despues de un punto.
* Usamos el `.limit()` para traes los elementos asingados del primero hasta el numero enviado o por defecto traer los primeros 5.
````
const userGet = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const usuarios = await Usuario.find()
    .skip( Number(desde))
    .limit(Number(limite)); 

    res.json({
        usuarios
    });
}
````
#
### 13.- Retornar numero total de registros en una colecci贸n
Para saber el numero total de registro de nuestra base de dato, haremos un conteo de esto y enviarlo en el resultado del GET
* En nuestro controlador de usuarios, usaremos el `.countDocuments()` para realizar el conteo total de nuestros registros.
````
const total = awiat Usuario.countDocuments()
````
Pero en nuetra base de datos tenemos una __eliminaci贸n logica__ que necesitamos manejar
* Para esto creamos una constante, donde le asignamos el estado en `true`.
* Se lo asignamos a nuestro `usuario` y `total`, de esta manera solo tomar los datos que tengan un __estado `true`__.
````
const eliLogica = {estado: true};

const usuarios = await Usuario.find(eliLogica)
                        .skip( Number(desde))
                        .limit(Number(limite));

const total = awiat Usuario.countDocuments(eliLogica);
````
Ya que existen 2 promesas en una funci贸n y resultan bloqueantes, ya que tendra que retornar una y despues la otra, es necesario evitar esto
* Para esta soluci贸n utilizamos el `Promise.all([])` que nos permite mandar un __arreglo__ con las diferentes promesas.
* Es necesario asignarel el `await` para que resuelva las dos promesas del arreglo, de esta manera ejecutara ambas promesas simultaneas y no continuar谩 hasta que ambas se solucionen. _(En el caso que 1 de error todas lo daran!)_

````
const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(eliLogica),
        Usuario.find(eliLogica)
            .skip( Number(desde))
            .limit(Number(limite))
    ]);
````
#
### 14.- Delete: Borrando un usuario de la base de datos
En esta parte se mostrar谩 como hacer eliminaciones, tanto logica como fisica
<br>

Estamos en `routes/user.js` 
* Para validar la id que nos envien es necesario realizar las validaci贸nes correspondientes, primero necesitamos recibir la id `/:id`.
* Luego nos traemos las validaciones realizadas en el GET, el cual es el primero validar si la id que nos manda es acorde a __MongoDB__ y como segundo validaro, es si existe en nuestra base de datos esa id.
* Para que no siga ejecutando mandamos `validarCampos`
````
router.delete('/:id', [
    check('id', 'No es un ID v谩lido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], userDelete);
````
Estamos en `controllers/user.controllers.js`
* Para realizar una eliminaci贸n fisica en la BD es necesario `.findByIdAndDelete(id)`, pero esta no es recomendable ya que perjudica la estabilidad referencial que existe en la Base de datos.
````
// Borrar Fisicamente 
const usuario = await Usuario.findByIdAndDelete(id);
````
* La que si es recomendable es hacer esta, la eliminaci贸n logica, cambiando el estado del registro `.findByIdAndUpdate(id, {estado: false})` el estado cambiandolo a __false__.
* Luego enviado el `usuario` que fue eliminado.
````
 const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

res.json(usuario);
````
#
> [Volver](https://github.com/Paserno/node-express-restserver-fst#contenido)

# REST Server - Autentificaci贸n de usuario - JWT

Esto es posterior a __[REST Server - CRUD con MongoDB](https://github.com/Paserno/node-express-restserver-fst/blob/main/README2.md)__, Este REST Server tendra autentificaci贸n con Token (JWT). Se utilizaron los siguientes elementos:
* __[REST Server con Node.js y Express](https://github.com/Paserno/node-express-restserver-fst/blob/main/README1.md)__  _(Primera versi贸n [V1.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v1.0.0))_
* __[REST Server - CRUD con MongoDB](https://github.com/Paserno/node-express-restserver-fst/blob/main/README2.md)__  _(Segunda versi贸n anterior [V2.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v2.0.0))_
* __[JWT](https://www.npmjs.com/package/jsonwebtoken)__ - [Pagina Oficial](https://jwt.io)


#
### 1.- Ruta Auth - Login
En nuestro 馃搨`models/server.js`
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
Creamos el archivo en 馃搨`controllers/auth.controllers.js`
* Hacemos la referencia a __Express__.
* Creamos la funci贸n login, con una respuesta que emitiremos.
* Hacemos la exportaci贸n de nuestra funci贸n `login()`.
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
Creamos el archivo en 馃搨`routes/user.js`
* Realizamos las referencia a __Express__ y __Express-validator__.
* Referenciamos el `validadorCampos` que creamos en la secci贸n anterior.
* Referenciamos al controlador anteriormente creado.
````
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { login } = require('../controllers/auth.controllers');
````
* Hacemor la instancia del `Router()`.
* En `router.post` le agregamos el path `/login` y insertamos los __Midlewares__ para validar el correo y la contrase帽a.
* Realizamos la exportaci贸n del `router`.
````
const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'El contrase帽a es obligatorio').not().isEmpty(),
    validarCampos
],login);

module.exports = router;
````
#
### 2.- Login de usuario
En `controllers/auth.controllers.js`
* Agregamos un __TryCatch__ en el caso que haya un problema con el servidor, y mandamos un mensaje de error con un mensaje.
````
try{

} catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
````
* Realizamos una desestructuraci贸n de lo que recibiremos el correo y contrase帽a. _(fuera del trycatch)_
````
const { correo, password } = req.body;
````
Realizaremos algunas validaci贸n
* Realizamos la validaci贸n del correo, si esque existe o no.
* Enviamos un mensaje 400 en el caso que no exista y un mensaje para informarnos cual fue el error. _(Enviamos el mensaje de correo para saber cual poderia ser el problema, pero luego lo borraremos)_
````
const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son validos - correo'
            })
        }
````
* Validar si en la base de dato esta con __"Eliminaci贸n Logica"__.
````
if( !usuario.estado ){
    return res.status(400).json({
        msg: 'Usuario / Password no son validos - estado: false'
    })
}
````
* Verificar la contrase帽a, no olvidar hacer la importaci贸n de `bcryptjs`, enviaremos la contrase帽a que recibiremos con la que esta en la BD para compararla.
````
const contrase帽aValida = bcryptjs.compareSync( password, usuario.password );
        if( !contrase帽aValida){
            return res.status(400).json({
                msg: 'Usuario / Password no son validos - Password'
            })
        }
````
# 
### 3.- Generar un JWT
En `.env` donde tenemos las variables de entorno
* Creamos una firma para los token que generemos.
````
JWT_KEY= XXXXXXXXXX
````
Creamos un archivo en 馃搨`helprers/generar-jwt.js` 
* Realizamos una importaci贸n de __JWT__, que recien instalamos.
````
const jwt = require('jsonwebtoken');
````
* Necesitamos pasar nuestro __Callback__ a una __Promesa__, para esto creamos una funci贸n `generarJWT()` la cual le entregamos un `uid` que lo definimos como un string vacio.
* Rotornamos una __Promesa__ con sus argumentos.
* En nuestra constante llamada `payload` _(el cuerpo del token)_ le asignamos el `uid`._(Se le puede asignar mas elementos al __Payload__, pero no es recomendable mandar una contrase帽a)_
* Tenemos que generar el JWT con `jwt.sign()`, para esto le mandamos el `payload` y la firma que generamos en las variables de entorno `.env`, ademas de el tiempo de expiraci贸n del token, en este caso asginamos __8 horas__.
* Luego viene el __Callback__ que recibiremos el error `err` y el __token__.
* Realizamos un condici贸n en el caso que exista un error _(con los argumentos de la promesa)_. 
````
const generarJWT = ( uid = '' ) => {
    return new Promise( (resolve, reject) =>{
        const payload = { uid };

        jwt.sign( payload, process.env.JWT_KEY, {
            expiresIn: '8h'
        },( err, token) => {

            if(err){
                console.log(err);
                reject( 'No se pudo generar el token' )
            }else{
                resolve( token );
            }
        })
    }); 
}
````
* Relizamos la exportaci贸n de `generarJWT`.
````
module.exports = {
    generarJWT
}
````
En `controllers/auth.controllers.js` con la funci贸n __login__
* Realizamos la importaci贸n de la funci贸n que creamos anteriormente.
````
const { generarJWT } = require("../helpers/generar-jwt");
````
* Generamos nuestro Token con un `await`, enviandole el id del usuario que se "logio".
````
const token = await generarJWT( usuario.id );
````
* Mostramos el usuario ademas del token, como respuesta del POST.
````
res.json({
        usuario,
        token
    })
````
#
### 4.- Cambiar Visualizaci贸n _id por uid en Mongoose
Es necesario cambiar el nombre de id, para identificarlo de una mejor manera, para esto lo cambiamos en el modelo `models/usuario.js`
* Extraemos el `_id` del `toObject()`.
* Le asignamos el `_id` a  `usuario.uid`.
````
UsuarioSchema.methods.toJSON = function()  {
    const { __v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id
    return usuario;
}
````
#
### 4.- Proteger ruta medianto un Token - Middlewares - Delete
Creamos un validador de __JWT__, el ejemplo que se mostrar谩 es del borrar un usuario, ya que alguien tendra que estar registrado para borrar a un usuario _(en el futuro tendra que ser el rol de ADMIN el que pueda borrar un usuario)_
#### En el controllador `controllers/user.controllers.js` en la funci贸n `userDelete`
* Necesitamos enviar el `req.uid` para saber quien elimino el usuario.
* Retonramos al usuario que fue eliminamos y agregamos el `uid` quien elimino al usuario.
````
const userDelete = async(req, res = response) => {
    const {id, ...resto} = req.params;
//* + *//const uid = req.uid;

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json({usuario, uid});
}
````
Creamos un nuevo archivo `middleweres/validar-jwt`
* Realizamos la importacio de express para tener ayuda de tipado.
* Importamos JWT para utilizarlo.
````
const { response, request } = require('express');
const jwt = require('jsonwebtoken');
````
* Creamos una funci贸n que enviamos los elementos de un __Middlewares__ _(req, res, next)_.
* Lo encerramos en un __try-catch__ en el caso de que no nos envie un Token valido, enviandole un error 401 _(No autorizada)_.
* Capturamos el token que nos enviaran en el header `req.header` con el nombre __"x-token"__.
* Hacemos una condicion, en el caso que no sea enviado el __"x-token"__, saltara el error con el mensaje correspondiente.
* Realizamos la verificaci贸n del __JWT__, le enviamos el elemento del __header__, y la firma.
````
const validarJWT = (req = request, res = response, next) => {
    try {
        const token= req.header('x-token');

        if(!token){
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la peticion'
            });
        }
        const {uid} = jwt.verify(token, process.env.JWT_KEY);
        req.uid = uid;
        next();
        
    } catch (e) {
        return res.status(401).json({
            ok:false,
            msg: ' Token no es valido'
        });
    }
}
````
En `routes/user.js`
* Realizamos la importaci贸n de nuestra funci贸n creada.
````
const { validarJWT } = require('../middlewares/validar-jwt');
````
* Insertamos en el __Delete__ la validaci贸n del token.
````
router.delete('/:id', [
    validarJWT,...])
````
#
### 5.- Obtener informaci贸n del usuario autenticado - Validaciones 
* Leer el usuario que corresponde al __uid__, de esta manera obtenemos todos los datos de quien eliminara.
* No olvidar importar del __modelo de usuario__ `require('../models/usuario');`.
````
const {uid} = jwt.verify(token, process.env.JWT_KEY);

const usuario = await Usuario.findById(uid);
````
* Realizamos una validaci贸n en el caso que tengamos un Token correcto pero el usuario fue eliminado recientemente de la BD _"Eliminacion Fisica"_.
````
if( !usuario){
    return res.status(401).json({
        msg: 'Token no v谩lido - usuario no existe en DB'
    })
}
````
* Verificar si el __uid__ tiene estado en true, esto quiere decir que el usuario no este elimiando _"Eliminaci贸n Logica"_.
* Se remplazo `req.uid = uid;` por __usuario__.
````
if( !usuario.estado){
    return res.status(401).json({
        msg: 'Token no v谩lido - usuario con estado false'
    })
}
req.usuario = usuario;
````
En `controllers/user.controllers.js` 
* Eliminamos los cambios que se tengan, de mandar el `uid`, solamente era para comprobar quien era el usuario que elimino.
#
### 6.- Middleware: Verificar Rol de administrador
Es necesario tener un rol de Administrador para realizar algunos cambios, como la eliminaci贸n de un usuario, para esto realizaremos algunas validaciones
#### Se Crea `middlewares/validar-roles.js`
* Se realiza la importaci贸n de __Express__ para tener una ayuda de tipado.
* se crea la funci贸n `esAdminRole`, el cual necesitamos el "req, res y next".
````
const { response } = require("express")

const esAdminRole = ( req, res = response, next) => {...}
````
* Verificamos si existe `req.usuario`, ya que eso se crea en el `middlewares/validar-jwt.js`, en el caso que todo salga bien el las validaciones del __JWT__.
* Realizamos una validaci贸n para comprobar que primero se verifique el toquen y luego que se realize la verificaci贸n del __rol Admin__.
* Para esta validaci贸n enviamos un error tipo __500__, para dar a conocer que es un error del servidor, por no verificar primero el token.
````
if( !req.usuario ){
        return res.status(500).json({
            msg: 'Se quiere verificar el role, sin validar el token Primero'
        })
    }
````
* Ya que se creo el `req.usuario` en el validadro de __JWT__, nos traemos el rol y nombre de la persona que quiere realizar la eliminaci贸n del usuario.
* Realizamos una validaci贸n, si la persona que quiere eliminar al usuario, tiene el rol de __ADMIN_ROLE__, en el caso que no lo tenga se enviar谩 un error __401__, con un mensaje.
* En el caso que todo salga bien, y tenga su rol correspondiente pasara a `next()`, al siguiente __Middleware__.
````
 const { rol, nombre } = req.usuario;
    
    if( rol !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: `${ nombre } no es administrador - No puede hacer esto`
        });
    }

next();
````
#
### 7.- Middleware: Validar-roles, validar otros roles
En algunos casos es necesario asignar varios roles aparte del administrador, que gestione ciertos __endpoint__, en este caso le daremos poder al `VENTAS_ROLE` para que pueda borrar datos de usuario para este ejemplo
#### En `routes/user.js`
* En el ejemplo anterior solo el __admin__ podia borrar usuarios, esta vez tambien podra el rol de `VENTAS_ROLE`, para esto comentaremos el __Middleware__ de solo admin.
* Crearemos un __Middleware__ _(Funci贸n)_ para validar otros tipos de roles. _(una vez creado lo importamos)_
````
 validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
````
En `middlewares/validar-roles.js`
* Utilizaremos el __Opreador Rest__ para recibir el resto de operaciones _(En el caso que se envien mas de 1 rol)_.
* No olvidar hacer la exportacion de la funci贸n.
````
const tieneRole = ( ...roles ) => {...}
````
* Retornamos la funci贸n con los diferentes elementos de un __Middleware__ _( req, res y next )_.
* En el caso que pase las validaci贸nes que mencionaremos despues, pasara al siguiente __Middleware__ con `next()`.
````
return (req, res = response, next) => {
    ...
   next();
}
````
* Realizamos la validaci贸n de que si tenemos validado el token antes.
````
if( !req.usuario ){
    return res.status(500).json({
        msg: 'Se quiere verificar el role, sin validar el token Primero'
    });
}
````
* Realizamos la validaci贸n de que si el rol que esta haciendo la eliminaci贸n `req.usuario.rol` tiene algun rol permitido para hacer este tipo de eliminacion `!roles.includes` en este caso solo `tieneRole('ADMIN_ROLE', 'VENTAS_ROLE')`.
* En el caso que no cuente con esos roles asignados, saltar谩 el return con un __status 401__ y un mensaje de error. 
````
if( !roles.includes( req.usuario.rol )){
    return res.status(401).json({
        msg: `El servicio requiere uno de estos roles ${ roles }`
    });
}
````
#
### 8.- Optimizar Importaciones de Node
Ya que en nuestra ruta de usuario existian muchos __Middleware__ importados, se prefirio optimizar, para esto se creo en la 馃搨carpeta `middlewares` un archivo llamado `index.js` para enviarle todas las importaciones
* Extraemos todas las importaciones que tenia `routes/user.js` relacionada a la 馃搨carpeta `middlewares`.
* Creamos unas constantes nuevas, que tengan relaci贸n con el archivo.
````
const validarCampos = require('../middlewares/validar-campos');
const validarJWT    = require('../middlewares/validar-jwt');
const validaRoles   = require('../middlewares/validar-roles');
````
* Realizamos una exportaci贸n de los diferentes elementos, con ayuda del __operador spread__. 
````
module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
}
````
En `routes/user.js`
* Aqui remplazamos lo que teniamos y lo remplazamos por las funciones unicamente _(Middlewares)_.
````
const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');
````
#
> [Volver](https://github.com/Paserno/node-express-restserver-fst#contenido)

# REST Server - Google Sign in - Frontend y Backend

Ahora se utilizar谩 la autentificaci贸n de Google, elementos utilizados

* __[REST Server con Node.js y Express](https://github.com/Paserno/node-express-restserver-fst/blob/main/README1.md)__  _(Primera versi贸n [V1.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v1.0.0))_
* __[REST Server - CRUD con MongoDB](https://github.com/Paserno/node-express-restserver-fst/blob/main/README2.md)__  _(Segunda versi贸n [V2.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v2.0.0))_

* __[REST Server - Autentificaci贸n de usuario - JWT](https://github.com/Paserno/node-express-restserver-fst/blob/main/README3.md)__  _(Tercera versi贸n anterior [V3.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v3.0.0))_

* __[Google Auth Library](https://www.npmjs.com/package/google-auth-library)__ _([Guia de Google](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token))_

#
### 1.- Generar API Key y API secret de Google
Se creo un proyecto en Google, para generar las [APIs](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid) que se utilizar谩n
* En `.env` se crearon 2 nuevas variables de entornos para utilizar.
````
GOOGLE_CLIENT_ID=
GOOGLE_SECRET_ID=
````
#
### 2.- Usuario de Google - Frontend
Ahora copiaremos las instrucciones que nos sale en la documentaci贸n de Google para poner el [boton de Google](https://developers.google.com/identity/gsi/web/guides/display-button)
* Como agregado, cambiamos el titulo de la pagina por `Google Sign-in` _(antes tenia el acceso denegado)_.
* Insertamos el codgio que nos entrega Google _(Donde sale `YOUR_GOOGLE_CLIENT_ID` insertamos nuestra variable de entorno `GOOGLE_CLIENT_ID`)_.
* Ademas eliminamos `data-login_uri` y lo remplazamos por `data-callback` que nos salia en el [manejo de respuesta de credencial con JS](https://developers.google.com/identity/gsi/web/guides/handle-credential-responses-js-functions).
````
    <div id="g_id_onload"
         data-client_id="YOUR_GOOGLE_CLIENT_ID"
         data-auto_prompt="false"
         data-callback="handleCredentialResponse">
      </div>
      <div class="g_id_signin"
         data-type="standard"
         data-size="large"
         data-theme="outline"
         data-text="sign_in_with"
         data-shape="rectangular"
         data-logo_alignment="left">
      </div>
````
* Agregamos el Script que nos da [Google](https://developers.google.com/identity/gsi/web/guides/display-button)
````
<script src="https://accounts.google.com/gsi/client" async defer></script>
````
* Agregamos la funci贸n de [manejo de credencial con JS](https://developers.google.com/identity/gsi/web/guides/handle-credential-responses-js-functions) y eliminamos la mayoria del contenido, para solo recibir el __Token de Google__
````
<script>
        function handleCredentialResponse(response) {

           console.log('id_token', response.credential);
        }
</script>
````
#
### 3.- Ruta para manejo de autenticaci贸n de Google
Crearemos una funci贸n en el controlador para manejar lo que recibiremos por la petici贸n POST, en este caso el __Token__, esto lo haremos en el __Backend__ y tendremos que hacer el POST desde el __Frontend__
#### Backend
En `controllers/auth.controllers.js`
* Realizaremos la funci贸n la cual recibir谩 el token que ser谩 mandado por el body del endpoint.
* Si sale todo bien, se enviar谩 una respuesta de que todo esta bien y el token.
* No olvidar hacer la exportaci贸n de la funci贸n creada.
````
const googleSignIn = async(req, res = response) => {
    const { id_token } = req.body;

    res.json({
        msg: 'Todo bien',
        id_token
    })
}
```` 
En `routes/auth.js`
* Realizamos la importaci贸n de la funci贸n recien creada, para su utilizaci贸n.
````
const { login, googleSignIn } = require('../controllers/auth.controllers');
````
* Creamos otro POST, en este caso ser谩 especificamente para Google.
* Verificamos que `id_token` sea recibido, en el caso que no venga, se emitira un mensaje que es requerido.
* Posterior a la validaci贸n del campo, pasamos la funci贸n creada, para recibir el token.
````
router.post('/google', [
    check('id_token', 'id_Token de google es necesario').not().isEmpty(),
    validarCampos
],googleSignIn);
````
#### Frontend
* Recibimos el token de Google, y los almacenamos en la constante body.
````
const body = { id_token: response.credential }
````
* Invocamos el metodo de JS, Fetch para realizar una endpoint POST a la API del __Backend__.
* Definimos el metodo POST con el tipo de dato JSON, ademas le mandamos el token que almacenamos en la constante __Body__.
* Realizamos el primero `.then()` par recibir la respuesta de la promesa del __fetch__ y transformarlo en un __JSON__ para luego con el segundo `.then()` recibir la segunda promesa con la respuesta que dar谩 el __JSON__ que vendra el contenido que se nos mando del __Backend__, el cual es el mensaje y el __Token__.
* Realizamos un `.catch()` en el caso que pase un error.
````
fetch('http://localhost:8081/api/auth/google',{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(body)
            })
                .then( resp => resp.json() )
                .then( resp => {
                    console.log(resp)
                })
                .catch(console.warn);
````
#
### 4.- Validar Token de Google - Backend
Una vez instalado __google-auth-library__ podemos realizar la verificaci贸n del Token
* Se crea un archivo en los __Helpres__ llamado `helpers/google-verify.js`, la cual le pegamos la informaci贸n extraida de [aqu铆 en la parte de Node.js](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token).
* Donde estaba el `CLIENT_ID` lo remplazamos por nuestra variable de entorno.
* Le cambiamos el nombre de `verify()` a `googleVerify()` y le pasaremos el __Token__.
* Creamos una constante desestructurada, donde tomaremos el `name, picture, email`.
* Luego lo retornamos con los nombres que usaremos en la BD.
* Finalmente realizamos la exportaci贸n de la funci贸n creada.
````
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID );

async function googleVerify( token = '' ) {
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  
  });
  const { name, picture, email } = ticket.getPayload();

  return {
    nombre: name, 
    img: picture, 
    correo: email
  }
}

module.exports = {
    googleVerify
}
````
En `controllers/auth.controllers.js`
* Realizamos la importaci贸n de la funci贸n.
````
const { googleVerify } = require("../helpers/google-verify");
````
* En la funci贸n `googleSignIn()` le insertamos un __Try-Catch__ en el caso que se produzca un error.
* Del token de google se lo mandamos a la funci贸n para que extraiga el nombre, img y correo.
* Seguimos mandamos nuestra respuesta con el mensaje y el token.
* Manejamos un catch en el caso que no se pueda verificar el token.
````
    try {
        const { nombre, img, correo } = await googleVerify( id_token );

        res.json({
            msg: 'Todo bien',
            id_token
        })
    } catch (error) {
        json.status(400).json({
            ok: false,
            msg: 'El Token no se pudo verificar'
        })
    }
````
#
### 5.- Crear un usuario personalizado con las credenciales de Google
Se realizaran algunas validaciones y un registro a la BD en el caso que el usuario no exista
* En nuestra funci贸n `googleSignIn()` del controlador de `auth.controllers.js`, en el __Try__.
* Verificamos si el correo que recibimos del __Token de Google__ ya existe.
````
let usuario = await Usuario.findOne({ correo });
````
* En el caso que no exista, tenemos que crear un nuevo usuario.
* Le insertamos los datos que nos pasa el __Token de Google__ y le definimos un rol por defecto.
* Luego creamos el nuevo usuario y lo guardamos en la Base de Dato.
````
if( !usuario ){

            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: 'USER_ROLE',
                google: true
            };
            
            usuario = new Usuario(data);
            await usuario.save();
        }
````
* Verificamos si el estado del usuario es `false`, si es as铆 le mandamos un mensaje de que el usuario esta bloqueado.
````
 if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }
````
* Mandamos como respuesta al Frontend el usuario con el token que se gener贸.
````
const token = await generarJWT( usuario.id );

res.json({
            usuario,
            token
        })
````
#
### 6.- Logout - Google Identity - Frontend
En el codigo de `index.html` realizaremos un __Logout__ 
* Vamos a la seguna promesa de nuestra pantalla y le mandamos el email hacia el __LocalStorage__, para almacenarlo.
````
.then( resp => {
                console.log(resp)
                localStorage.setItem( 'email', resp.usuario.correo )
            })
````
* Hacemos un boton con HTML y le agregamos unos estilos.
````
<button id="rainbow-button" class="button">
          Sign-out
      </button>
````
* Y nos creamos una funci贸n para salirnos de la sesi贸n, para esto buscamos el id del boton.
* Realizamos un evento `onclick` y es necesario realizar el `disableAutoSelect()` para registrar el estado de las [cookies](https://developers.google.com/identity/gsi/web/reference/js-reference).
* Es necesario usar el `revoke()` para [remover](https://developers.google.com/identity/gsi/web/guides/revoke) la sesi贸n de google, para esto tambien llamamos el limpiar el __LocalStorage__ y recargar la pagina.
````
 const button = document.getElementById('rainbow-button');
        button.onclick = () => {

            console.log( google.accounts.id )
            google.accounts.id.disableAutoSelect();

            google.accounts.id.revoke( localStorage.getItem( 'email' ), done =>{
                localStorage.clear();
                location.reload();
            });
        }
````
#
> [Volver](https://github.com/Paserno/node-express-restserver-fst#contenido)

# REST Server - Categor铆as y Productos

Se crear谩 2 nuevas colecciones de __Categor铆a__ y __Productos__ la que se aplicar谩n relaciones entre las diferentes colecciones para su manejo en __Base de Datos__, elementos utilizados

* __[REST Server con Node.js y Express](https://github.com/Paserno/node-express-restserver-fst/blob/main/README1.md)__  _(Primera versi贸n [V1.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v1.0.0))_
* __[REST Server - CRUD con MongoDB](https://github.com/Paserno/node-express-restserver-fst/blob/main/README2.md)__  _(Segunda versi贸n [V2.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v2.0.0))_

* __[REST Server - Autentificaci贸n de usuario - JWT](https://github.com/Paserno/node-express-restserver-fst/blob/main/README3.md)__  _(Tercera versi贸n [V3.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v3.0.0))_

* __[REST Server - Google Sign in - Frontend y Backend](https://github.com/Paserno/node-express-restserver-fst/blob/main/README4.md)__  _(Cuarta versi贸n anterior [V4.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v4.0.0))_


#
### 1.- CRUD - Rutas de Categor铆a
Ahora trabajaremos con Categor铆as, para esto tendremos que crear los Endpoint para su manejo pero antes...
* Se crear谩n los archivos que manejaremos, vamos a los controladores y creamos `controllers/catego.controllers.js` aqui realizaremos el manejo de la categor铆a.
* Luego haremos la creacion de la ruta `routes/categorias.js`.

Una vez creado estos dos archivos iremos a `models/server.js` a declarar la nueva ruta que utilizaremos para las categor铆as

* Ya que en nuestro clase __Server__ utilizamos mas de 1 ruta, realizaremos un objeto literal donde almacenaremos todas las rutas.
* Creamos la nueva ruta de `categoria` para realizar las diferentes peticiones.
````
this.paths = {
            auth:      '/api/auth',
            categoria: '/api/categorias',
            usuarios:  '/api/usuarios',
        }
````
* En el metodo `routes()` insertaremos nuestra nueva ruta con su importaci贸n requerida de `routes/categorias.js`.
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
* Agregamos un endpoint GET para obtener todas las categor铆as, esta sera publica.
* Otro GET para obtener una categor铆a por id, que tambien ser谩 publica.
* Una creaci贸n de categor铆a, esta ser谩 privada y solo se podra crear con un token valido.
* Un actualizar categor铆a por id, este es Privado y cualquiera con token valido podr谩 actualizarlo.
* Finalmente un borrar categor铆a, solo el que tenga el rol de __Admin__ podra realizar la eliminaci贸n.
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
### 2.- Modelo Categor铆a
Creamos nuestro nuevo modelo `models/categoria.js`
* Realizamos la importaci贸n de __Mongoose__.
````
const { Schema, model } = require('mongoose');
````
* Asignamos las diferentes propiedades del modelo (nombre, estado y usuario), el usuario es especial ya que necesitaremos la integridad referencial de quien creo la categor铆a.
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
* Realizaremos la exportaci贸n de nuestro modelo.
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
### 3.- Crear una categor铆a
Crearemos el controlador de categor铆a con las validaciones `controllers/catego.controllers.js`
* Realizamos la importaci贸n de apoyo de __Express__ y del modelo de __Categoria__.
````
const { response } = require("express");
const { Categoria } = require('../models');
````
* Creamos la funci贸n asincrona del controlador.
* Realizamos la exportaci贸n de la funci贸n.
````
const crearCategoria = async(req, res = response) => {
    ...
} 

module.exports = {
    crearCategoria
}
````
*  Capturamos el nombre que nos tendran que pasar por el __body__ y lo convertimos en mayuscula con `.toUpperCase()`.
* Verificamos si existe en la __Base de Datos__ una categor铆a igual, en el caso que exista mandamos un __status 400__, que ya existe.
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
* Luego almacenamos el nombre de la categor铆a mas el ID de la persona que creo esa categor铆a. _(En el caso que quieran enviar la Id manualmente no la recibiremos y no ser谩 almacenada)_
* Luego creamos una nueva categor铆a con los datos que almacenamos.
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
* Realizamos las verificaciones del endpint __POST__, en este caso validar el JWT de la persona que desee crear una nueva categor铆a, validar que sea enviado el nombre, y los campos.
* Finalmente si todos las validaciones pasan, se crear谩 una nueva categor铆a.
````
router.post('/', [
    validarJWT,
    check('nombre','El nombre es Obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria);
````
#
### 4.- CRUD categor铆a
Se crear谩 el __CRUD__ de la categor铆a, con sus validaciones
* Comenzando en el controlador de categor铆a, creamos la funci贸n de `obtenerCategorias()`, donde mostraremos todas las categorias.
* Copiamos lo que tenemos en el controlador de usuario, mostrando el limite de 5 por defecto y viendo solo las categor铆as que tenga el estado de __true__.
* Realizamos 2 promesa al mismo tiempo, mostrando la totalizaci贸n de las categor铆as y trayendo los datos segun el limite puesto.
* Enviamos como respuesta estos datos el total y las categorias. 
* Realizamos la exportaci贸n de la funci贸n.
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
* Realizamos la importaci贸n y lo ponemos en el GET principal, para mostrar todas las categor铆as.
````
router.get('/', obtenerCategorias);
````
Ahora realizaremos el Endpoit para traer una categor铆a por ID, para primero realizaremos una validaci贸n en `helpers/db-validators.js`
* Ya que en varios __Endpoits__ utilizaremos la busqueda de ID, necesitamos tener un validador si existe realmente.
* No olvidar exportar la funci贸n.
````
const existeCategoriaPorId = async ( id ) => {
    const existeCategoria = await Categoria.findById( id );
    if ( !existeCategoria) {
        throw new Error(`El ID no existe ${id}`);
    };
}
````
En `controllers/catego.controllers.js`
* Creamos la funci贸n `obtenerCategoria` esta sera por el ID.
* Capturamos el parametro ID que sea enviado, y lo buscamos en la BD.
* Ademas utilizamos un metodo de __Mongoose__ el cual es `populate` que permite hacer referencia a documentos en otras colecciones, en este caso el de usuario y buscando el nombre.
* Luego mandamos la categor铆a que coinsida con la ID en la respuesta al frontend.
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
* Capturamos la version y el estado, para luego mandarle todo lo demas como respuesta, de esta manera evitando enviar informaci贸n adicional.
````
CategoriaSchema.methods.toJSON = function()  {
    const { __v, estado,...data} = this.toObject();
    return data;
}
````
En `routes/categorias.js`
* Aqui utilizamos una validaci贸n propia de mongo `.isMongoId()`
* Importamos la funci贸n crada anteriormente `existeCategoriaPorId()`, esta validaci贸n personalizada para la captura de los id en __Categoria__`, posterior invocamos el validador de campos.
* Importamos la funci贸n de buscar por id las categor铆as `obtenerCategoria`. 
````
router.get('/:id', [
    check('id', 'No es un ID v谩lido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],obtenerCategoria);
````
Ahora en __Actualizar__, vamos al controlador de categorias `controllers/catego.controllers.js`
* Creamos la funci贸n `actualizarCategoria()` asincrona, la que requerimos el id de los parametros que se nos envie.
* Capturamos el estado y usuario, para que estos elementos no sean cambiados.
* El nombre lo guardamos con mayuscula y le enviamos la id de la persona del __Token__.
* Actualizamos los datos de la categor铆a del id correspondiente y le enviamos los datos actualizados, ademas ponemos `{new: true}` para que nos actualize los datos que mostraremos.
* Le enviamos los datos actualizados al frontend.
* Exportamos nuestra funci贸n.
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
* Importamos la funci贸n recien crada y la usamos para actualizar la categor铆a.
````
router.put('/:id', [
    validarJWT,
    check('nombre','El nombre es Obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], actualizarCategoria);
````
Ahora realizaremos el __Borrar Categor铆a__, comenzando en el controlador de categor铆a `controllers/catego.controllers.js` 
* Creamos la funci贸n `borrarCategoria()` asincrona, la cual requiere de los parametros el ID.
* Buscamos esa categor铆a con la Id y le cambiamo el estado a __false__.
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
* Importamos la funci贸n recien creada de `borrarCategoria`, para su uso.
````
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo v谩lido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
], borrarCategoria);
````
#
### 5.- Modelo de producto y rutas
Al igual como se hizo con la categor铆a, se replicar谩 la creacion de los archivos, crear:
* `routes/productos.js` Se crear谩n las rutas para los diferentes endpint _(Recordar hacer la referencia en la clase __Server__)_.
* `models/producto.js` El modelo de los productos.
* `controllers/productos.controllers.js` El controlador de producto, donde se almacenar谩 la logica de negocio.
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
* Realizamos la importaci贸n en el `index.js` de la 馃搨carpeta de modelos, el modelo de producto que se creara posteriormente.
````
const Producto = require('./producto');
````
* Realizamos la exportaci贸n de __Producto__.
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
* Copiamos el modelo de categor铆a que es muy similar y lo pegamos aqui, cambiado el nombre del esquma a `ProductoSchema`.
* Podemos ver que reutilizaremos el nombre, estado y usuario.
* Agregamos adicionalmente precio, categoria, descripcion y disponible.
* Filtramos la versi贸n de __MongoDB__ y el estado, para que no sean mostrados o enviados al __Frontend__.
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
### 7.- CRUD de Productos Parte 2 : PUT - DELETE
Continuando con los demas endpoits, nos vamos al controlador de productos.
* Creamos la funci贸n `actualizarProducto()` asincrona.
* Para la actualizaci贸n necesitamos extraer el id del `.params`.
* Omitir si nos mandan el estado y el id de usuario, lo demas puede ser actualizado.
* En el caso que se nos mande el nombre, transformarlo a mayuscula y utilizar el id del token.
* Actualizamos los datos del id del producto que nos mandaron en el `.params`.
* Mandamos al __frontend__ el producto actualizado y no olvidar exportar la funci贸n.
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
* Importamos la funci贸n `actualizarProducto()`.
* Usamos los __Middlewares__ para la validaci贸n del JWT, verificar que el id que se nos manda existe y el validador de campos.
* Usamos la funci贸n finalmente de actualizar los productos.
````
router.put('/:id', [
    validarJWT,
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto);
````
Como ultimo endpoit el __DELETE__, vamos a `controllers/productos.controllers/js`
* Creamos la funci贸n asincrona.
* Extremos de los `.params` el id.
* Acualizamos el estado del producto del id, en `false`. _(realizando as铆 una eliminaci贸n logica)_
* Enviamos al __Frontend__ el producto borrado, no olvidar exportar funci贸n.
````
const borrarProducto = async(req, res = response) => {
    const {id} = req.params;
    
    const productoBorrada = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});
    
    res.json(productoBorrada);
}
```` 
Ahora en `routes/productos.js`
* Importamos la funci贸n recien creada `borrarProducto()`.
* Usamos los validadores de JWT, validar el rol, validar si es un id de mongo, si existe el id en la BD y finalmente validar los campos.
* Usamos la func贸n creada para hacer la eliminaci贸n logica.
````
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo v谩lido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], borrarProducto);
````
#
### 8.- Ruta para realizar B煤squedas
Se habilitar谩 una ruta para realizar las b煤squedas hacia la Base de Dato, para esto creamos los siguientes archivos:
* En el controlador `controllers/buscar.controllers.js`.
* En las rutas `routes/buscar.js`.
* Modificamos la clase de server en `models/server.js`.
Iniciando en el controlador
* Realizamos la importaci贸n de __Express__ para tener una asistencia de tipeo.
````
const { response } = require('express');
````
* Creamos la funci贸n buscar que se usar谩 en el GET, recibiendo la `coleccion` y `termino` de los params. 
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
* Realizamos la exportaci贸n de la funci贸n. 
````
module.exports = {
    buscar
}
````
Ahora vamos a la ruta `routes/buscar.js`
* Realizamos la importaci贸n del metodo de __Express__ `Router` y importamos lo del controlador.
````
const { Router } = require('express');
const { buscar } = require('../controllers/buscar.controllers');
````
* Definimos la constante que usaremos el metodo de __Express__ y inicializamos el primer GET, con lo que se solicitar谩, en este caso la `/:coleccion` y `/:termino`.
* Realizamos la exportaci贸n del router. 
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
### 9.- B煤squedas en Base de Datos
En este punto, se modificar谩 la coleccion de `buscar`, para hacer la primera busqueda hacia la base de datos, comenzando con el __Usuario__
* Realizamos una importaci贸n de __Mongoose__ para apoyarnos, en este caso se usar谩 para comprobar si el ID de __Mongo__ es valido.
* La segunda importaci贸n es de los modelos, que se usaran para hacer las busquedas.
````
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');
```` 
* Realizamos un arreglo de las b煤squedas que se realizar谩n a las colecciones creadas. 
````
const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]
````
* Se realizar谩 la primera busqueda hacia los usuarios, para esto creamos una funci贸n de `buscarUsuarios()` asincrona.
* Utilizamos la importaci贸n de __Mongoose__ para luego hacer la validac贸n del id de la busqueda, con `ObjectId.isValid()`, en el caso que la id sea validad de mongo, enviar谩 un `true`.
* Realizamos la validaci贸n de la id, en el caso que se envi茅 y el resultado sea `true` se realizar谩 la busqueda en el modelo de que si existe ese elemento.
* Se manda como respuesta al __Frontend__ un arreglo llamado `results`, en el caso que el usuario exista se mandar谩 el usuario, en el caso que sea `null` se enviar谩 un String vac铆o.
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
* Modificamos la funci贸n `buscar()` agregando una condici贸n, en el caso que en la `coleccion` que se entregue por los parametros, no sea lo que existe en el arreglo `coleccionesPermitidas`, saldra un __status 400__ con un mensaje.
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
* Se crea un __switch__ con los diferentes casos del arrelgo y un valor por defecto, en el caso que no se mande una opci贸n que no exista, mandando un __status 500__.
* Invocamos la funci贸n `buscarUsuarios()` creada y le pasamos 2 parametros, `termino` y `res` 
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
                msg: 'Se olvido hacer esta b煤squeda'
            })
    }
````
Aqu铆 se ve el ejemplo en el caso que se le mande un id correcto de __Mongo__, que exista en base de datos 

<img align="center" width="500" src="https://res.cloudinary.com/dptnoipyc/image/upload/v1641017062/kxlyuzcoiu6vrof9cqcj.png" />

#
### 10.- Buscar por otros argumentos
Seguimos en el controlador de __"Buscar"__, para obtener mas elementos por el nombre o correo que se le env铆e
* Utilizaremos una expresion regular para poder buscar el nombre del usuario independiente de como este escrito, para esto usamos `new RegExp()` que es propio de __JavaScript__, enviandole el `termino` y que sea insensible a las mayusculas.
* Hacemos uso de `.find()` para buscar los elementos que necesitemos como respuestas, para esto ponemos una condici贸n propia de __Moongose__ `$or` y `$and`, buscamos por el nombre o el correo y que siempre tenga el estado en `true` el registro.
* Esto lo repetimos para el `.count()`, la cual har谩 la misma busqueda pero devolviendo el numero total de registros entregados.
* Esto se lo enviamos al __Frontend__. 
````
 const regex = new RegExp( termino, 'i' );

    const usuarios = await Usuario.find({ 
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{estado: true}]
     });
     const countUsuario = await Usuario.count({ 
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{estado: true}]
     });

    res.json({
        results:  [{cantidad: countUsuario}, usuarios ]
    });
````
#
### 11.- Buscar en otras colecciones
Ahora se realizar谩 la b煤squeda de la colecci贸n de __Categor铆a__ y __Producto__
* Se crea la nueva funci贸n `buscarCategorias()` asincrona, recibiremos los mismos parametros que la funci贸n anterior, `termino` y `res`.
* En el caso que se mande una ID realizamos la validaci贸n de si la Id es de __Mongo__, en el caso que sea as铆 se buscar谩 por id en las categor铆as, y se manda al __Frontend__ la categor铆a encontrada, en el caso que no, se envia un arreglo vac铆o.
* Usando una expresi贸n regular que acepta mayusculas, se buscar谩 el nombre en la __Categor铆a__ que este con estado en `true`.
* Se envi谩 el resultado de la categor铆a al __Frontend__.
````
const buscarCategorias = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); 

    if (esMongoID) {
        const categoria = await Categoria.findById(termino)
            .populate('usuario', 'nombre');
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }
    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({ nombre: regex, estado: true })
        .populate('usuario', 'nombre');

    res.json({
        results: categorias
    });
}
```` 
Al igual que en la busqueda de categor铆a as铆 mismo se realizar谩 en el producto
* Creando la funci贸n, verificar id de __Mongo__, buscar la id por id en los productos.
* En el caso que no se mande la id se buscar谩 por el nombre del producto.
* Ademas se contar谩 el numero de b煤squedas encontradas.
* Enviando la respuesta al __Frontend__.
````
const buscarProductos = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); 

    if (esMongoID) {
        const producto = await Producto.findById(termino)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }
    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({ nombre: regex, estado: true })
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');
   
    
    const countProductos = await Producto.count({ nombre: regex, estado: true });

    res.json({
        results: [{ cantidad: countProductos }, productos]
    });
}
````
* En el __switch__ se agregan las 2 nuevas funci贸nes creadas.
````
case 'categorias':
        buscarCategorias(termino, res);
    break;

case 'productos':
        buscarProductos(termino, res);
    break;
````
#
> [Volver](https://github.com/Paserno/node-express-restserver-fst#contenido)

# REST Server - Carga de Archivo y Protecci贸n

Se trabajar谩 con la __Carga de Archivos__ realizando un endpoint que reciba cualquier archivo, ademas con imagenes para los productos y usuarios, elementos utilizados

* __[REST Server con Node.js y Express](https://github.com/Paserno/node-express-restserver-fst/blob/main/README1.md)__  _(Primera versi贸n [V1.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v1.0.0))_
* __[REST Server - CRUD con MongoDB](https://github.com/Paserno/node-express-restserver-fst/blob/main/README2.md)__  _(Segunda versi贸n [V2.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v2.0.0))_

* __[REST Server - Autentificaci贸n de usuario - JWT](https://github.com/Paserno/node-express-restserver-fst/blob/main/README3.md)__  _(Tercera versi贸n [V3.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v3.0.0))_

* __[REST Server - Google Sign in - Frontend y Backend](https://github.com/Paserno/node-express-restserver-fst/blob/main/README4.md)__  _(Cuarta versi贸n [V4.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v4.0.0))_

* __[REST Server - Categor铆as y Productos](https://github.com/Paserno/node-express-restserver-fst/blob/main/README5.md)__  _(Quinta versi贸n anterior [V5.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v5.0.0))_

* __[Express-fileupload](https://www.npmjs.com/package/express-fileupload)__

* __[uuid](https://www.npmjs.com/package/uuid)__

* __[Cloudinary npm](https://www.npmjs.com/package/cloudinary)__ _([Cloudinary](https://cloudinary.com))_
#
### 1.- Preparando RestServer para Carga de Archivo
Para el inicio se tendran que crear algunos archivos, esto son los siguientes:
* Crear controlador `controllers/uploads.controllers.js`.
* Crear la ruta `roytes/uploads.js`.
* Agregar nueva ruta en la clase __Server__.

Ahora en el controlador de `uploads`
* Creamos la importaci贸n para apoyarnos en __Express__.
````
const { response } = require("express");
````
* Creamos la funci贸n para el endpoint enviando un mensaje para luego probarlo en __Postman__.
````
const cargarArchivo = (req, res = response) => {

    res.json({
        msg: 'Cargar archivo ... '
    })
}
````
* Realizamos la exportaci贸n de la funci贸n.
````
module.exports = {
    cargarArchivo
}
````
Ahora en `routes/uploads.js`
* Hacemos las importaciones de __Express__, __Express-validator__, validar campos y la funci贸n creada `cargarArchivo`.
````
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { cargarArchivo } = require('../controllers/uploads.controllers');
````
* Hacemos uso del metodo de __Express__ `Router()`.
* Generamos un __POST__ con la funci贸n importada del controlador.
* Realizamos la exportaci贸n de `router`.
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
* En el metodo `routes()` de la clase Server, implementamos la nueva ruta en la que se trabajar谩.
````
this.app.use(this.paths.uploads, require('../routes/uploads'));
````
#
### 2.- Subir Archivo
Instalaremos el paquete __Express-fileupload__ para subir archivos, este paquete simplificar谩 a la hora de subir archivos en nuestro __Rest Server__, una vez instalado se har谩n las configuraciones

Primero configuramos el __Servidor__ `models/server.js`
* Importamos __Express-fileupload__ que recien se instalo.
````
const fileUpload = require('express-fileupload');
````
* Realizamos uso del __[Using useTempFile Options](https://www.npmjs.com/package/express-fileupload)__ que se encuentra en la documentaci贸n, esto lo colocamos como un __Middleware__ en nuestra funcion llamada `middlewares()`, esto nos permitir谩 manejar la carga de archivos.
````
this.app.use( fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
````
Ahora en el controlador de `controllers/uploads.controllers.js`
* Se realizar谩 la importaci贸n del `path` para proximamente usarlo al momento de guardar archivos en la aplicaci贸n de __Node__.
````
const path = require('path');
````
Utilizaremos el codigo de ejemplo de __Express-fileupload__, para utilizarlo _(modificandolo a nuestra necesidad)_
* El codigo lo sacamos del __[Github de Express-fileupload](https://github.com/richardgirges/express-fileupload/blob/master/example/server.js)__, se utilizar谩 lo del interior del __POST__ y lo pegamos en nuestra funci贸n __cargarArchivo__.
* Extraemos la validaci贸n, esta validaci贸n es para verificar de si viene un archivo, y le agregamos el `!req.files.archivo` para validar que venga con nombre, en el caso que se cumpla una de las condiciones, saltar谩 un __status 400__ con su mensaje.
````
if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
      res.status(400).json({msg: 'No hay archivos que subir'});
      return;
    }
````
* Creamos una constante, donde desestructuramos `archivo` y le enviamos la `request` del archivo.
* Aqu铆 hacemos uso de la importaci贸n del __path__, donde se almacenar谩 el archivo, creamos la carpeta `uploads/` en la ra铆z del proyecto, y usamos el `path.join()` para poder almacenar en la ra铆z del proyecto en una carpeta creada llamada `../uploads/` y almacenarla con su nombre _(Con el nombre del archivo)_.
* En el caso que exista un error se mandar谩 un __status 500__ al __Frontend__ con el error.
* En el caso que todo sea exitoso, se enviar谩 un mensjae al __Frontend__ diciendo que se almaceno el archivo y en donde. _(En este caso en que parte del servidor o computador)_
````
const { archivo } = req.files;
  
    const uploadPath = path.join( __dirname, '../uploads/', archivo.name);
  
    archivo.mv(uploadPath, (err) => {
      if (err) {
         return res.status(500).json({ err });
      }
  
      res.json({ msg: 'El archivo se subio a ' + uploadPath });
    });
````
#
### 3.- Validar la Extensi贸n
Para realizar este punto, dejamos como comentario la subida de archivo, para realizar la __validacion de la extensiones__. En el controlador de `uploads`
* Agregamos en la funci贸n `cargarArchivo()` la validaci贸n de las extensiones.
* Para esto buscamos el nombre del archivo y lo separamos por el __Punto " . "__.
* Luego cremos una constante `extension` y le asignamos la ultima posici贸n de `nombreCortado`.
````
const { archivo } = req.files;
const nombreCortado = archivo.name.split('.');
const extension = nombreCortado[ nombreCortado.length - 1 ];
````
* Luego realizamos la validaci贸n de las extensiones, como primer paso colocando todas las extensiones que acetaremos en un arreglo.
* Hacemos la validaci贸n de que si no incluye la variable `extension` una de las extensiones permitidas que cuenta el arreglo `extensionesValidas`, se mandar谩 un error al __Frontend__ con un __status 400__, en el caso que la incluya se saltara la validaci贸n.
````
const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

if( !extensionesValidas.includes(extension) ){
  return res.status(400).json({
    msg: `La extensi贸n ${ extension } no es permitida, ${ extensionesValidas }`
  });
}
````
#
### 5.- Helper - SubirArchivo 
En toda la seccion se ha realizado la subida de archivo en el controlador, ya que proximamente necesitaremos subir archivos para el usuario y producto, se necesitar谩 replicar el codigo para subir archivos, para esto es necesario centralizar ese codigo de subida y usarlo desde los diferentes controladores

Para esto creamos un nuevo helper:
* Se crea un `helpers/index.js` donde realizaremos la importaci贸n y exportacion de todos los helpers.
* Se crea `helpers/subir-archivo.js` para manejar la subida de archivos.

En `helpers/index.js`
* Realizamos la importaci贸n de todos los archivo de la carpeta __helpers__.
````
const dbValidators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');
````
* Realizamos la exportaci贸n de todos los archivos de la carpeta __helpers__
````
module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo
}
````
En `helpers/subir-archivo.js`
* Extreameos la importaci贸n del `path` y `uuid` del controlador de `uploads` y lo usamos en el helper nuevo.
````
const path = require('path');
const { v4: uuidv4 } = require('uuid');
````
* Extraemos todo el codigo de __subir archivo__ del controlador de `uploads`.
* Creamos nuestra nueva funci贸n `subirArchivo()` que le pasaremos los parametros que necesitaremos, el `files` que es el archivo nos envian, `extensionesValidas` que le agregamos un arreglo por defecto de imagenes y `carpeta` en el caso que lo querramos almacenar en una carpeta adicional.
* Retornamos una nueva promesa, donde encerraremos todo el codgio que se extrajo del controlador _(para la subida de archivos)_.  
````
const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'], carpeta = '' ) => {

    return new Promise((resolve, reject) => {

      ...
    });

}
````
* Las primeras 3 lineas las dejamos igual, es para extraer la extensi贸n.
* En la validaci贸n se remplaza el `res.status(400).json()` por un `reject()` con el mismo mensaje.
* Las siguientes lineas las dejamos igual hasta llegar al `if(err)`, en vez de mandar un `res.status(500).json()` enviamos un `reject()` con el error.
* Y al final en vez de un `res.json()` con el mensaje que se subio el archivo, se envia un `resolve()` con el nombre del archivo y su extensi贸n, a diferencia de antes que se enviaba la direcci贸n completa de donde se almacenaba, pero no es necesario ya que al cliente no puede acceder a esa direcci贸n del servidor.
````
const { archivo } = files;
const nombreCortado = archivo.name.split('.');
const extension = nombreCortado[nombreCortado.length - 1];


if (!extensionesValidas.includes(extension)) {
    return reject(`La extensi贸n ${extension} no es permitida ${extensionesValidas}`);
}


const nombreTemp = uuidv4() + '.' + extension;
const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

archivo.mv(uploadPath, (err) => {
    if (err) {
        reject ( err );
    }

    resolve( nombreTemp );
});
````
En `controllers/uploads.controllers.js`
* Dejamos la validaci贸n de que si viene un archivo o no.
* Luego la funci贸n la hacemos asincrona, creamos una constante `nombre` y despues de importar la funci贸n de `subirArchivo()` la utilizamos con el `await` y le asignamos `req.files`.
* Luego mandamos al __Frontend__ la constante creada. 
```` 
    const nombre = await subirArchivo( req.files )
    
    res.json({ nombre })
````
#
### 6.- Crear Carpetas de Destino
Para crear carpetas se usara una configuraci贸n de __Express-fileupload__ llamada __[createParentPath](https://www.npmjs.com/package/express-fileupload)__, esta por defecto tiene un valor `false` hay que pasarlo a `true`

En `models/server.js`
* Nos vamos al metodo `middlewares()` para agregar `createParentPath` con un valor en `true`, de esta manera permitiendo crear carpetas nuevas en el directorio.
````
this.app.use( fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
````
En `controllers/uploads.controllers.js`
* Encerramos en un __Try-Catch__ para controlar los errores, en el caso que no se envi茅 un formato deseado por ejemplo.
* En este ejemplo queremos que solo se admitan formatos `.txt` y `.md`, ademas que cree una carpeta llamada `textos`, gracias a la configuraci贸n anterior se podr谩 crear.
* En el __catch__ recibiremos el error que sea mandado del helper `subirArchivo`.
````
try {
      const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos' );
      res.json({ nombre });
      
    } catch (msg) {
      res.status(400).json({msg})
    }
````
* Finalmento lo dejamos por defecto como lo teniamos antes, aceptando imagenes `undefined` y creando una carpeta llamada `imgs`.
````
const nombre = await subirArchivo( req.files, undefined, 'imgs' );
````
#
### 7.- Ruta para Actualizar Im谩genes de Usuario y Producto
A continuaci贸n se crear谩 el endpoit para validar las rutas para las imagenes
En `helpers/db-validators.js`
* Crearemos la validaci贸n de las colecciones permitidas, con una funci贸n `coleccionesPermitidas()` que recibira como parametros la `coleccion` que vendr谩 del __Frontend__ y la `colecciones` como un arreglo que se perimitiran, esta ya estar谩n definidas en el endpoint.
* En el caso que no se incluya se enviar谩 un error.
* No olvidar exportar la funci贸n.
````
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );
    if( !incluida ){
        throw new Error(`La colecci贸n ${ coleccion } no es permitida: ${ colecciones } `);
    }
    return true;
}
````
En `controllers/uploads.controllers.js`
* Crearemos la funci贸n de actualizar asincrona.
* Que simplemente recibira el id y la colecci贸n para luego enviarla al __Frontend__.
````
const actualizarImagen = async(req, res = response) => {

  const { id, coleccion } = req.params;

  res.json({id, coleccion})
}
````
En `routes/uploads.js`
* Creamos el nuevo endpoit __PUT__ para la actualizaci贸n, que recibir谩 la colecci贸n y el id.
* Validar si el id es de __MongoDB__.
* Validar la colecci贸n, de una manera personalizada usando la funci贸n crada en `helpers/db-validators.js`, viendo si lo que se recibe por el __Frontend__ es una coleccion valida, segun lo que se tenga en el arreglo, en el caso que no se enviar谩 un error _(importamos `coleccionesPermitidas`)_.
* Agregamos el `validarCampos` y usamos la funci贸n del controlador de `uploads`.
````
router.put('/:coleccion/:id', [
    check('id', 'El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], actualizarImagen);
````
#
### 8.- Actualizar Imagen de Usuario y Producto - En BD
Se actualizar谩 el modelo de __Producto__ para almacenar imagenes y modificar el controlador de __Actualizar__ imagenes, tanto de los Usuarios como Productos

En `models/producto.js`
* Agregamos en el modelo el string que alacenar谩 la imagen en BD.
````
img: { type: String },
````
En `controllers/uploads.controllers.js`
* Importamos los modelos de __Usuarios__ y __Productos__.
````
const { Usuario, Producto } = require('../models');
````
* En la funci贸n `actualizarImagen()` agregamos el validar si existe algun archivo.
````
if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({ msg: 'No hay archivos subido' });
    return;
  }
````
* Creamos una variable llamada `modelo` que utilizaremos.
* Creamos un __switch__ con 2 casos _(usuarios y productos)_ y 1 por defecto.
* En el `case` de usuarios se le asigna a la variable `modelo` la busqueda del id de usuario, en el caso que no se encuentre un usario con ese id, se enviar谩 un error con __status 400__ al __Frontend__ _(muy similar en productos)_.
* En el caso que se mande un caso que no se tenga, saltara el `default` se enviar谩 un mensaje con __status 500__.
.
````
let modelo;

switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
    break;

    case 'productos':
      modelo = await Producto.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }

    break;

    default:
      return res.status(500).json({ msg: 'Se olvido Validar Esto' });
  }
````
* Usamos la funci贸n de guardar archivo en la aplicaci贸n, y adicionalmente lo guardamos en Base de Datos.
* Finalmente enviamos el modelo actualizado.
````
const nombre = await subirArchivo( req.files, undefined, coleccion );
  modelo.img = nombre; 

  await modelo.save();

  res.json(modelo);
````
#
### 9.- Agregar un Middleware de Subir Archivo (Optimizar Codigo)
En el caso que no se suba un archivo lo que hicimos es copiar una validaci贸n que habiamos hecho en el controlador especificamente en la funci贸n `cargarArchivo()`, para evitar tener codigo repetido se optimizar谩 y se crear谩 un __Middleware__ exclusivo que se utilizar谩 en los diferentes endpoint de `uploads`

Se har谩 lo siguiente:
* Crear un archivo nuevo llamado `middlewares/validar-archivo`.
* Se traspasara la importaci贸n al archivo `middlewares/index.js` para realizar todas las exportaci贸nes.
* Eliminar el codigo repetido en la funci贸n `cargarArchivo()` y `actualizarImagen()` del controlador de `uploads`.
En `middlewares/validar-archivo.js`
* Realizamos la importaci贸n de `response` para apoyarnos con el typado.
* Creamos la funci贸n `validarArchivoSubido()` _(Middleware)_.
* Extraemos el codigo repetido que se ten铆a en el controlador de `uploads`.
* Exportamos la funci贸n.
````
const { response } = require('express');

const validarArchivoSubido = (req, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({ 
            msg: 'No hay archivos subido - validarArchivoSubido'
        });
    }
    next();
}

module.exports = {
    validarArchivoSubido
}
````
En `middleware/index.js`
* Agregamos la importaci贸n de `validarArchivoSubido`.
````
const validarArchivoSubido   = require('../middlewares/validar-archivo');
````
* Realizamos la exportaci贸n de `validarArchivoSubido`
````
module.exports = {
    ...
    ...validarArchivoSubido,
}
````
En `controllers/uploads.controllers.js`
* Finalmente se elimina el codigo repetitivo que se ten铆a.
#
### 10.- Borrar archivos del servidor 
Este borrado es cuando se intenta actualizar la imagen del usuario o producto, para que cada registro tenga 1 imagen asociada, ya que en este punto se puede actualizar la imagen, pero todas las imagenes quedan almacenadas

En `controllers/uploads.controllers.js`
* Se realiz谩 la importaci贸n del path propia de __Node.js__ para ir a la carpeta donde se encuentra el archivo de la imagen y proximamente borrarla.
* Importacion de fs _(file system)_ para borrar la imagen.
````
const path = require('path');
const fs = require('fs');
````
* En la funci贸n `actualizarImagen()` despues del __switch__, realizamos una validaci贸n si el registro en BD tiene una imagen asignada. 
* En el caso que se tenga una imagen en el registro, se buscar谩 en la 馃搨carpeta `uploads/`  el registro con ese nombre _(El nombre es la uuid asignada con su extensi贸n)_, en el caso que sea `true` esto quiere decir que existe el registro, entonces se eliminar谩 el registro con `fs.unlinkSync()`.  
````
  if( modelo.img ){
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );

    if( fs.existsSync( pathImagen ) ){
      fs.unlinkSync( pathImagen ); 
    }
  }
````
Una vez eliminado la imagen que existia en la 馃搨carpeta `uploads/` se guardar谩 otra imagen remplazando la imagen antigua.
#
### 11.- Servicio de mostrar imagen - GET
En este punto se crea el endpoint para obtener la imagen del servidor. 

En `controllers/loads.controllers.js`
* Se crea la funci贸n `mostrarImagen()`.
````
const mostrarImagen = async(req, res = response) => {
...
}
````
* Reutilizamos el switch de la funci贸n `actualizarImagen()` _([8.- Actualizar Imagen de Usuario y Producto (En BD)](https://github.com/Paserno/node-express-restserver-fst#8--actualizar-imagen-de-usuario-y-producto---en-bd))_.
````
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }
      break;

    default:
      return res.status(500).json({ msg: 'Se olvido Validar Esto' });
  }
````
* A comparaci贸n de la funci贸n `actualizarImagen()` aqu铆 no se eliminar谩 el archivo, si no mostrar.
* Creamos el __path__ `pathImagen`, verificamos si existe y luego lo retornamos como respuesta al __Frontend__ con `res.sendFile()`.
* Descargamos una imagen por defecto que almacenaremos en la carpeta `assets/` que se creo, en el caso que el registro no tenga una imagen, se enviar谩 una imagen por defecto _(no-image.jpg)_.
````
  if( modelo.img ){

    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
    if( fs.existsSync( pathImagen ) ){
      return res.sendFile( pathImagen );
    }
  }


  const pathImagen = path.join( __dirname, '../assets/no-image.jpg');
  res.sendFile(pathImagen);
````
En el ejemplo se muestra la imagen por defecto que mostrar谩n los registros que no tengan imagenes.

<img align="center" width="500" src="https://res.cloudinary.com/dptnoipyc/image/upload/v1641432827/ig2o7atzywpcegpamnwh.png" />

#
### 12.- Carga de Im谩genes a Cloudinary 
Primero hacemos la instalaci贸n del paquete de __Cloudinary__, para luego crear o iniciar una cuenta en la pagina oficial de __[Cloudinary](https://cloudinary.com)__, una vez hecho extraeremos la variable de entorno que nos ofrece y la colocaremos en nuestra aplicaci贸n

En `.env`
* En nuestras archivo donde manejamos las variables de entorno pegamos lo que nos ofrecio __Cloudinary__. 
````
CLOUDINARY_URL=XXXXXXXXXXXXXXXXXXXX
````
Luego clonamos la funci贸n `actualizarImagen()` del controlador `uplodas`, ya que har谩 lo mismo, pero con la diferencia que se almacenar谩n las im谩genes en __Cloudinary__
* Como ya tenemos instalado el paquete de __Cloudinary__, lo importamos y le mandamos la configuraci贸n con la variable de entorno creada. _(Esto en el controlador de `uploads`)_ 
````
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );
````
* Una vez clonada la funci贸n, actualizamos el nombre a `actualizarImagenCloudinary()`, modificando el codigo que esta abajo del `switch` y borramos el interior de la validaci贸n que tenemos de limpiar la imagen previa, para proximamente borrar la im谩gen en __Cloudinary__.
* Extraemos el Path de `req.files.archivo`.
* Con `cloudinary.uploader.upload()` realizamos la carga del archivo y le pasamos el Path como parametro, esto es una promesa por eso le agregamos el await y de esta respuesta solo necesitaremos el `secure_url`.
* Esto se lo asignamos al modelo de la Base de Datos y lo guardamos en ella, para luego mandarlo como respuesta al __Frontend__.
* No olvidar exportar nuestra nueva funci贸n `actualizarImagenCloudinary()`.
````
const { tempFilePath } = req.files.archivo
const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
modelo.img = secure_url; 

await modelo.save();

res.json(modelo);
````
En `routes/uploads.js`
* Importamos `actualizarImagenCloudinary`.
* En el endpint remplazamos la funci贸n que usaremos, por la nueva que creamos, de esta manera usaremos __Cloudinary__ en vez de la funci贸n `actualizarImagen()` que almacena localmente las imagenes.
````
router.put('/:coleccion/:id', [
...
], actualizarImagenCloudinary);
// ], actualizarImagen);
````
#
### 13.- Borrar im谩gen de Cloudinary
Ahora al momento de hacer la actualizaci贸n es necesario remplazar la imagen y se hace borrando la anterior para subir una nueva, para esto se modificar谩 la validaci贸n que dejamos en blanco

En `controllers/uploads.controllers.js`
* En la funci贸n `actualizarImagenCloudinary()` vamos a la validaci贸n y verificamos si existe datos de la im谩gen en el registro.
* Como ahora guardamos el URL de Cloudinary, necesitamos extraer el nombre del registro, para esto separamos el dato de `modelo.img` por el slash `/`.
* Para luego mandar la ultima posici贸n, esta vendra con la extensi贸n y hacemos una desestructuraci贸n extrayendo el nombre.
* Luego usamos `cloudinary.uploader.destroy()` para eliminar el registro que esta ubicado en la carpeta `node-cafe/${coleccion}` con el nombre que le enviaremos. 
````
if( modelo.img ){
  const nombreArr = modelo.img.split('/');
  const nombre    = nombreArr[ nombreArr.length - 1];
  const [ public_id ]      = nombre.split('.'); 
  cloudinary.uploader.destroy( `node-cafe/${coleccion}/${public_id}` );
}
````
Cremos una nueva funci贸n llamada `mostrarImagenCloudinary()` clonada de `mostrarImagen` que esta solo muestra archivos locales y necesitamos una nueva que muestre lo que este en __Cloudianry__
* Una vez clonada nos vamos a la validaci贸n despues del `switch` para realizr una nueva validaci贸n.
* Esta vez enviaremos el URL que almacenamos en el `modelo.img` para enviarlo al __Frontend__.
* Exportamos nuestra nueva funci贸n `mostrarImagenCloudinary`.
````
if( modelo.img ){

    return res.json({
      img: modelo.img
    });
  }
````
En `routes/uploads.js`
* Importamos la nueva funci贸n.
* Remplazamos por la funci贸n nueva, esta vez para mandar el URL.
````
router.get('/:coleccion/:id', [
  ...
], mostrarImagenCloudinary);
// ], mostrarImagen)
````
#