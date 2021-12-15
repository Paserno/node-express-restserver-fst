> __Elemento Anterior 👀:__ __[Creación de un Webserver](https://github.com/Paserno/node-express-webserver-first)__
# REST Server con Node.js y Express
Este es un Rest Server Básico que sirve como cascarón y para aprender a configurarlo. Se utilizaron los siguientes elementos:
* __[Express](https://www.npmjs.com/package/express)__ - [Pagina Oficial](https://expressjs.com)
* __[Doenv](https://www.npmjs.com/package/dotenv)__
* __[Cors](https://www.npmjs.com/package/cors)__
#
#### Para reconstruir los modulos de node ejecute el siguiente comando.
````
npm install
````
#
### 1.- Express Basado en Clase
Creamos lo mismo de __[Creación de un Webserver](https://github.com/Paserno/node-express-webserver-first#uso-de-express-)__ pero con clase esta vez.
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
* Con `listen(){...}` es el puerto que utilizaremos para levantar la aplicación.
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
* No olvidar realizar la exportación de la clase
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
### 3.- Usando codigo de respuesta HTTP con Express 🔲
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
__"CORS o Intercambio de recursos entre orígenes. Es un mecanismo para permitir o restringir los recursos solicitados en un servidor web dependiendo de dónde se inició la solicitud HTTP. Esta política se utiliza para proteger un determinado servidor web del acceso de otro sitio web o dominio"__
* Hay que instalar el cors para su uso, para luego realizar la importación.
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
Se crearon 2 📂carpetas, una llamada __📂routes__ y __📂controllers__, de esta manera no tenemos todo el codigo en la clase __Server__
* Quitamos los elementos que teniamos en el metodo `routes()` de la clase __Server__, y lo guardamos en el nuevo archivo llamado `user.js` que se encuenta en la carpeta __📂routes__.
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
Nos vamos a la nueva carpeta __📂controllers__ y creamos el archivo `user.controllers.js`
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
* Luego realizamos la exportación de todas las funciones creadas en el controlador.
````
module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete,
    userPatch
}
````
Volvemos al la archivo `user.js` de la 📂carpeta  __routers__ 
* Realizamos la importación de los diferentes elementos del controlador.
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


* Para esto utilizaremos `express.json()` que esto hará una serialización a un formato __JSON__.
````
// Lectura y parser del body
this.app.use( express.json() );
````
Ahora vamos al controladore de __usuario__
* En el función de POST, tenemos que extraer los elementos que nos quieren mandar.
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
* Ahí mostramos el resultado de la petición por POST
<br>

<img align="center" width="500" src="https://res.cloudinary.com/dptnoipyc/image/upload/v1639438121/fhlw7s9co5eotv4s5nya.png" />
<br><br>

#
### 7.- Parametros de segmento y query
En el caso que queramos mandar alguna id en particular, para actualizar un registro, o dato a travez de la __URL__, necesitaremos tomar esos datos de alguna forma...
* En este caso estamos en la 📂carpeta __routes__ con `user.js`, este ejemplo sera PUT, en el caso que queramos actualizar un dato, de por si __Express__ nos ayuda con esto y le mandamos la `/:id`.
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
* Con __Postman__ mandamos en la url `/50` que se capturaria por la función PUT como la id.
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
# REST Server - CRUD con MongoDB
Este es un Rest Server - con adiciones como un CRUD hecho con MongoDB. Se utilizaron los siguientes elementos:
* __[REST Server con Node.js y Express](https://github.com/Paserno/node-express-restserver-fst#rest-server-con-nodejs-y-express)__ _(Elemetos que se habian utilizado aquí +)_
* __[MongoDB Atlas](https://www.mongodb.com/atlas/database)__
* __[Mongoose](https://mongoosejs.com)__
* __[Bcryptjs](https://www.npmjs.com/package/bcryptjs)__
* __[Express-validator](https://www.npmjs.com/package/express-validator)__ _([docs](https://express-validator.github.io/docs/))_

#
### 1.- Conexion a la Base de Datos con Mongoose
Nos vamos al archivo que se encuentra en la raiz llamado `.env`, para establecer la conexión a la base de datos.
* Donde teniamos definido el puerto, creamos una variable de entorno nueva, y ahi ponemos el enlace para conectarnos a la base de datos, en este caso a la de __MongoDB Atlas__.
````
PORT=8081
MONGODB_CNN= XXXXXXXXXXXXXXXX
````
Se creo una 📂carpeta llamada __database/__ con un archivo `config.js`
* Se realiza la importación a mongoose recien instalado.
* En el archivo `config.js` se creo una función asincrona para realizar la conexión.
* Realizamos la exportacion de la función recien creada.
````
const mongoose = require('mongoose');

const dbConnection = async() => {...}

module.exports = {
    dbConnection
}
````

* Se creo un __try-catch__ dentro de la función __dbConnection__ en caso de presentar un error de conexión a la base de datos.
* Realizamos la conexión gracias a __mongoose__, y realizamos una impresión por consola si nos encontramos conectado a la base de dato.
* Para lego hace la impreción del `error` y un mensaje de que no se pudo conectar a la base de dato dentro del __catch__.
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
* Importamos la función de __database/`config.js`__.
````
const { dbConnection } = require('../database/config');
````
* Creamos un metodo asincrono llamado `conectarDB()`, donde llamamos la función recine importada. 
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
Aquí crearemos el primer modelo de usuario
* Realizamos las importaciones de __Mongoose__ y los elementos que necesitaremos _(esquema, modelo)_.
* Creamos el objeto litaral que usaremos para los usuarios `UsuarioSchema`.
* Exportamos la función `model` de __Mongoose__ con el nombre que le pondremos a la colección en BD __Usuario__ y el objeto literario `UsuarioSchema`.
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
        required: [true, 'El contraseña es obligatorio'],
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
Estamos en el __Controlador de Usuarios__ (`controllers/user.controlers.js`) para realizar la inserción a la BD de MongoDB
* Para esto es necesario importar nuestro modelo de usuario (`models/usuario.js`) a nuestra __coleccion de usuario__. 
````
const Usuario = require('../models/usuario');
````
En la función __userPost__ realizaremos los cambios, para recibir al nuevo usuario en BD _(convertir la función a una asincrona)_
* Capturamos los elementos en nuestra constante `body`.
* Creamos una nueva instancia de `Usuario`, enviandole lo que recibimos en `body`.
* Realizamos un guardado en base de datos de lo que recibiremos por POST `.save()`, poner el `await` para esperar el guardado de los datos.
* Luego le hacemos una impresión de los datos que se guardaron en `usuario`  a travez de `msg:`. 
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

* Recibimos la impresión de los datos. 
<br>
<img align="center" width="500" src="https://res.cloudinary.com/dptnoipyc/image/upload/v1639529895/qgyvqduxk5zfmv9fthbr.png" />
<br>

* Y finalmente tenemos el guardado del dato en la BD creada.
<br>
<img align="center" width="370" src="https://res.cloudinary.com/dptnoipyc/image/upload/v1639529980/feftwogwm1puqdhzl5at.png" />
<br>

#
### 4.- Bcryptjs - Encripar Contraseñas
* Una vez realizada la instalacion de __Bcryptjs__ realizamos la importación.
````
const bcryptjs = require('bcryptjs');
````
* En la función `userPost` realizamos la desestructuración de lo que recibiremos.
````
const {nombre, correo, password, rol}    = req.body;
const usuario = new Usuario( {nombre, correo, password, rol} );
````
* Antes de guardar en base de datos realizamos la encriptación de la contraseña.
* Para esto usamos el metodo propio de __Bcryptjs__ el cual es `genSaltSync`, esto es el numero de vuelta que se le dara a la encriptacion "dificultad", pero por defecto es 10, entre mayor sea mas tiempo tomara.
* Utilizamos la encripación de una sola via con `.hashSync()` este metodo necesita la propiedad que queremos incriptar, en este caso el `password` y su "dificultad" con nuestra constante `salt`.
````
const salt = bcryptjs.genSaltSync();
usuario.password = bcryptjs.hashSync( password, salt );
````
#
### 5.- Validar Campos Obligatorios - Email
Es necesario hacer algunas validaciones dentro de nuestra aplicación, en este caso nos enfocaremos en el correo para realizar las validaciones correspondientes, aqui utilizaremos __Express-validator__ <br>
Estamos en el __controlador de usuarios__
* Realizamos una valizacion en el controlador, en la metodo `userPost`, para validar si existe el correo que fue enviado.
* En el caso que exista retornara un codigo __400__ _(Petición incorrecta)_ con un mensaje diciendo que existe el correo enviado.
````
const existeEmail = await Usuario.findOne({correo});
    if( existeEmail ){
        return res.status(400).json({
            msg: 'Este correo ya esta registrado'
        });
    }
````
En el archivo que se encuentra en la 📂carpeta `routers/user.js`
* Instalamos __Express-validator__ y lo importamos en `routers/user.js`.
````
const { check } = require('express-validator');
````
* Buscamos la ruta del POST donde tenemos la referencia del __controlador de usuario__.
* Le añadimos un tercer argumento a nuesta ruta POST, esto significa que le mandaremos un __Middlewares__.
* Utilizamos el metodo `check` de __Express-validator__, esto hara que se revisen los elementos en este caso el __correo__ que fue enviado.
````
router.post([
    check('correo', 'El correo no es válido').isEmail(),
], userPost); 
````
Ahora en el __controlador de usuario__ _(📂`controllers/user.controllers.js`)_
* Realizamos la importacion de __Express-validator__.
````
const { validationResult } = require('express-validator');
````
* En nuestro función `userPost` revisamos si existe algun error y mandamos el metodo `validationResult` y le enviamos la solicitud `req`.
* En el caso que haya errores enviaremos un status __400__ _(Petición incorrecta)_ y mandamos los errores creados por el __Express-validator__.
````
const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json(errors);
    }
````
#
### 6.- Validar Todos los Campos Necesarios
Ahora realizaremos todas las validaciones que necesita para la función POST _(nombre, contraseña y rol)_, ademas de que es necesario que se realizen mas validaciones dentro de la aplicacion por ejemplo en las funciones que asignamos para GET - PUT - DELETE, para no realizar muchos __Copy-Paste__ haremos una función separada para realizar las validaciones. 

<br>
Creamos una nueva 📂carpeta llamada __middlewares__ y agregamos un archivo llamado `validar-campos.js` 

* Importamos __Express-validator__ y lo sacamos de `user.controllers.js`.
````
const { validationResult } = require('express-validator');
````
* Creamos nuestra nueva función `validarCampos()` necesitamos los diferentes parametros `( req, res, next )`.
* Necesitaremos el parametro `next()` para cuando pase nuestra validación siga al siguiente __"Middleware"__.
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
* En la __contraseña__ establecemos un largo minimo de  6 con `.isLength({ min:6 }`.
* Y en el __rol__ buscaremos entre las 2 opciones que necesitamos `.isIn(['ADMIN_ROLE', 'USER_ROLE'])`.
* Finalmente enviamos el __Middlewares__ `validarCampos`, para que en el caso que exista un error llegue hasta el validador del campo y no pase a la función POST.
````
router.post('/', [ 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe ser mas de 6 letras').isLength({ min:6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos
], userPost);
````
#
### 7.- Validar Rol contra la Base de Datos
Ahora realizamos la validación del rol hacia la base de datos, ya que si la tenemos el dato en "duro", puede que en el día de mañana necesitemos agregar un nuevo rol y para esto tendriamos que detener la aplicación, por este motivo es mejor manejarlo por __Base de Dato__

<br>

Creamos un nuevo __modelo__ llamado `role.js` 
* Creamos la referencia a __Mongoose__ ya que necesitamos el __esquema y el modelo__.
````
const { Schema, model } = require('mongoose');
````
* Creamos el objeto `RoleSchema` donde tendremos el rol.
* Este rol sera requerido.
* Realizamos la exportación con el nombre __Role__
````
const RoleSchema = Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio'],
    }
});

module.exports = model( 'Role', RoleSchema );
````
Ahora en 📂`routes/user.js`
* Modificamos nuestra validacion de rol en la función POST.
* Colocamos el __Middelware__ `check` para evaluar el `rol`, le mandaremos el `.custom()` para realizar una __verificación personalizada__.
* Creamos una función asincrona `async(rol = '')` el cual el rol evaluara lo que se mande por el __body__ de la petición __POST__ y le definimos un __String__ vacío en el caso que no venga.
* Realizamos una validación de que si existe el __Rol__ con el `.findOne({ rol })` que nos enviarán en el __body__.
* En el caso que no exista entrará en nuestra condición, mandando un __Error__.
````
check('rol').custom( async(rol = '') => {
        const existeRol = await Role.findOne({ rol });
        if( !existeRol ){
            throw new Error(`El rol (${ rol }) no está registrado en la BD`)
        }
    }),
````
#
### 8.- Centralizar la Validación de Rol
Sacaremos la validación hecha en la parte anterior, para centralizarla para esto creamos un 📂carpeta __helper/__ con su archivo `db-validators.js`.

<br>

Extrayendo lo recien creado en la función POST especificamente en la validació del __rol__
* Esto lo tomamos y lo dejamos en nuestro nuevo archivo `db-validators.js`.
* Extraemos la importacion de __Role__.
* Creamos una constante `esRolValido` donde almacenaremos la función que se extrajo de la validación de __rol__.
* Realizamos la exportación de la función creada.
````
const Role = require('../models/role');

const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if( !existeRol ){
        throw new Error(`El rol (${ rol }) no está registrado en la BD`)
    }
}

module.exports = {
    esRolValido
}
````
En `routes/user.js`
* Importamos la función recien creada __esRolValido__.
````
const { esRolValido } = require('../helpers/db-validators');
````
* Y en la validación del __rol__ colocamos nuestra importación. _(Lo del ejemplo es equivalente a esto `.custom(rol => esRolValido(rol))`)_
````
check('rol').custom( esRolValido ),
````
Para quitar la contraseña de nuestra respuesta al __POST__ de una forma global, iremos a nuestro modelo de `usuario.js`
* Sobrescribiremos el `.toJSON`, necesitaremos una función normal, para utilizar el `this` para dar una referencia a una instancia creada.
* Realizamos la desestructuracion de la versión `__v`, la contraseña `password` y lo demas utilizando el operador spread `...usuario`
* El `this.toObject()` genera una instancia con sus valores respectivo, como si fuera un objeto literar de JavaScript.
* Finalmente retornamos el `usuario`, dando asi todo el contenido exepto la contraseña y la versión.
````
UsuarioSchema.methods.toJSON = function()  {
    const { __v, password, ...usuario} = this.toObject();
    return usuario;
}
````
* Así se muestra el contenido, exeptuando la contraseña y la versión.

<br>

<img align="center" width="500" src="https://res.cloudinary.com/dptnoipyc/image/upload/v1639555719/lztzzljo1uvw1snjingc.png" />
<br>

#