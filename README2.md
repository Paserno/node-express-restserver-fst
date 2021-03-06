# REST Server - CRUD con MongoDB
Este es un Rest Server - con adiciones como un CRUD hecho con MongoDB. Se utilizaron los siguientes elementos:
* __[REST Server con Node.js y Express](https://github.com/Paserno/node-express-restserver-fst/blob/main/README1.md)__ _(Elemetos que se habian utilizado aqu铆 +)_
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
* Le a帽adimos un tercer argumento a nuesta ruta POST, esto significa que le mandaremos un __Middleware__.
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