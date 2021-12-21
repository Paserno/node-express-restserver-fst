# REST Server - Autentificación de usuario - JWT

Esto es posterior a __[REST Server - CRUD con MongoDB](https://github.com/Paserno/node-express-restserver-fst/blob/main/README2.md)__, Este REST Server tendra autentificación con Token (JWT). Se utilizaron los siguientes elementos:
* __[REST Server con Node.js y Express](https://github.com/Paserno/node-express-restserver-fst/blob/main/README1.md)__  _(Primera versión [V1.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v1.0.0))_
* __[REST Server - CRUD con MongoDB](https://github.com/Paserno/node-express-restserver-fst/blob/main/README2.md)__  _(Segunda versión anterior [V2.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v2.0.0))_
* __[JWT](https://www.npmjs.com/package/jsonwebtoken)__ - [Pagina Oficial](https://jwt.io)

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
* Realizamos una desestructuración de lo que recibiremos el correo y contraseña. _(fuera del trycatch)_
````
const { correo, password } = req.body;
````
Realizaremos algunas validación
* Realizamos la validación del correo, si esque existe o no.
* Enviamos un mensaje 400 en el caso que no exista y un mensaje para informarnos cual fue el error. _(Enviamos el mensaje de correo para saber cual poderia ser el problema, pero luego lo borraremos)_
````
const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son validos - correo'
            })
        }
````
* Validar si en la base de dato esta con __"Eliminación Logica"__.
````
if( !usuario.estado ){
    return res.status(400).json({
        msg: 'Usuario / Password no son validos - estado: false'
    })
}
````
* Verificar la contraseña, no olvidar hacer la importación de `bcryptjs`, enviaremos la contraseña que recibiremos con la que esta en la BD para compararla.
````
const contraseñaValida = bcryptjs.compareSync( password, usuario.password );
        if( !contraseñaValida){
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
Creamos un archivo en 📂`helprers/generar-jwt.js` 
* Realizamos una importación de __JWT__, que recien instalamos.
````
const jwt = require('jsonwebtoken');
````
* Necesitamos pasar nuestro __Callback__ a una __Promesa__, para esto creamos una función `generarJWT()` la cual le entregamos un `uid` que lo definimos como un string vacio.
* Rotornamos una __Promesa__ con sus argumentos.
* En nuestra constante llamada `payload` _(el cuerpo del token)_ le asignamos el `uid`._(Se le puede asignar mas elementos al __Payload__, pero no es recomendable mandar una contraseña)_
* Tenemos que generar el JWT con `jwt.sign()`, para esto le mandamos el `payload` y la firma que generamos en las variables de entorno `.env`, ademas de el tiempo de expiración del token, en este caso asginamos __8 horas__.
* Luego viene el __Callback__ que recibiremos el error `err` y el __token__.
* Realizamos un condición en el caso que exista un error _(con los argumentos de la promesa)_. 
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
* Relizamos la exportación de `generarJWT`.
````
module.exports = {
    generarJWT
}
````
En `controllers/auth.controllers.js` con la función __login__
* Realizamos la importación de la función que creamos anteriormente.
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
### 4.- Cambiar Visualización _id por uid en Mongoose
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
Creamos un validador de __JWT__, el ejemplo que se mostrará es del borrar un usuario, ya que alguien tendra que estar registrado para borrar a un usuario _(en el futuro tendra que ser el rol de ADMIN el que pueda borrar un usuario)_
#### En el controllador `controllers/user.controllers.js` en la función `userDelete`
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
* Creamos una función que enviamos los elementos de un __Middlewares__ _(req, res, next)_.
* Lo encerramos en un __try-catch__ en el caso de que no nos envie un Token valido, enviandole un error 401 _(No autorizada)_.
* Capturamos el token que nos enviaran en el header `req.header` con el nombre __"x-token"__.
* Hacemos una condicion, en el caso que no sea enviado el __"x-token"__, saltara el error con el mensaje correspondiente.
* Realizamos la verificación del __JWT__, le enviamos el elemento del __header__, y la firma.
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
* Realizamos la importación de nuestra función creada.
````
const { validarJWT } = require('../middlewares/validar-jwt');
````
* Insertamos en el __Delete__ la validación del token.
````
router.delete('/:id', [
    validarJWT,...])
````
#
### 5.- Obtener información del usuario autenticado - Validaciones 
* Leer el usuario que corresponde al __uid__, de esta manera obtenemos todos los datos de quien eliminara.
* No olvidar importar del __modelo de usuario__ `require('../models/usuario');`.
````
const {uid} = jwt.verify(token, process.env.JWT_KEY);

const usuario = await Usuario.findById(uid);
````
* Realizamos una validación en el caso que tengamos un Token correcto pero el usuario fue eliminado recientemente de la BD _"Eliminacion Fisica"_.
````
if( !usuario){
    return res.status(401).json({
        msg: 'Token no válido - usuario no existe en DB'
    })
}
````
* Verificar si el __uid__ tiene estado en true, esto quiere decir que el usuario no este elimiando _"Eliminación Logica"_.
* Se remplazo `req.uid = uid;` por __usuario__.
````
if( !usuario.estado){
    return res.status(401).json({
        msg: 'Token no válido - usuario con estado false'
    })
}
req.usuario = usuario;
````
En `controllers/user.controllers.js` 
* Eliminamos los cambios que se tengan, de mandar el `uid`, solamente era para comprobar quien era el usuario que elimino.
#
### 6.- Middleware: Verificar Rol de administrador
Es necesario tener un rol de Administrador para realizar algunos cambios, como la eliminación de un usuario, para esto realizaremos algunas validaciones
#### Se Crea `middlewares/validar-roles.js`
* Se realiza la importación de __Express__ para tener una ayuda de tipado.
* se crea la función `esAdminRole`, el cual necesitamos el "req, res y next".
````
const { response } = require("express")

const esAdminRole = ( req, res = response, next) => {...}
````
* Verificamos si existe `req.usuario`, ya que eso se crea en el `middlewares/validar-jwt.js`, en el caso que todo salga bien el las validaciones del __JWT__.
* Realizamos una validación para comprobar que primero se verifique el toquen y luego que se realize la verificación del __rol Admin__.
* Para esta validación enviamos un error tipo __500__, para dar a conocer que es un error del servidor, por no verificar primero el token.
````
if( !req.usuario ){
        return res.status(500).json({
            msg: 'Se quiere verificar el role, sin validar el token Primero'
        })
    }
````
* Ya que se creo el `req.usuario` en el validadro de __JWT__, nos traemos el rol y nombre de la persona que quiere realizar la eliminación del usuario.
* Realizamos una validación, si la persona que quiere eliminar al usuario, tiene el rol de __ADMIN_ROLE__, en el caso que no lo tenga se enviará un error __401__, con un mensaje.
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
* Crearemos un __Middleware__ _(Función)_ para validar otros tipos de roles. _(una vez creado lo importamos)_
````
 validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
````
En `middlewares/validar-roles.js`
* Utilizaremos el __Opreador Rest__ para recibir el resto de operaciones _(En el caso que se envien mas de 1 rol)_.
* No olvidar hacer la exportacion de la función.
````
const tieneRole = ( ...roles ) => {...}
````
* Retornamos la función con los diferentes elementos de un __Middleware__ _( req, res y next )_.
* En el caso que pase las validaciónes que mencionaremos despues, pasara al siguiente __Middleware__ con `next()`.
````
return (req, res = response, next) => {
    ...
   next();
}
````
* Realizamos la validación de que si tenemos validado el token antes.
````
if( !req.usuario ){
    return res.status(500).json({
        msg: 'Se quiere verificar el role, sin validar el token Primero'
    });
}
````
* Realizamos la validación de que si el rol que esta haciendo la eliminación `req.usuario.rol` tiene algun rol permitido para hacer este tipo de eliminacion `!roles.includes` en este caso solo `tieneRole('ADMIN_ROLE', 'VENTAS_ROLE')`.
* En el caso que no cuente con esos roles asignados, saltará el return con un __status 401__ y un mensaje de error. 
````
if( !roles.includes( req.usuario.rol )){
    return res.status(401).json({
        msg: `El servicio requiere uno de estos roles ${ roles }`
    });
}
````
#