# REST Server - Carga de Archivo y Protección

Se trabajará con la __Carga de Archivos__ realizando un endpoint que reciba cualquier archivo, ademas con imagenes para los productos y usuarios, elementos utilizados

* __[REST Server con Node.js y Express](https://github.com/Paserno/node-express-restserver-fst/blob/main/README1.md)__  _(Primera versión [V1.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v1.0.0))_
* __[REST Server - CRUD con MongoDB](https://github.com/Paserno/node-express-restserver-fst/blob/main/README2.md)__  _(Segunda versión [V2.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v2.0.0))_

* __[REST Server - Autentificación de usuario - JWT](https://github.com/Paserno/node-express-restserver-fst/blob/main/README3.md)__  _(Tercera versión [V3.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v3.0.0))_

* __[REST Server - Google Sign in - Frontend y Backend](https://github.com/Paserno/node-express-restserver-fst/blob/main/README4.md)__  _(Cuarta versión [V4.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v4.0.0))_

* __[REST Server - Categorías y Productos](https://github.com/Paserno/node-express-restserver-fst/blob/main/README5.md)__  _(Quinta versión anterior [V5.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v5.0.0))_

* __[Express-fileupload](https://www.npmjs.com/package/express-fileupload)__

* __[uuid](https://www.npmjs.com/package/uuid)__

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
### 2.- Subir Archivo
Instalaremos el paquete __Express-fileupload__ para subir archivos, este paquete simplificará a la hora de subir archivos en nuestro __Rest Server__, una vez instalado se harán las configuraciones

Primero configuramos el __Servidor__ `models/server.js`
* Importamos __Express-fileupload__ que recien se instalo.
````
const fileUpload = require('express-fileupload');
````
* Realizamos uso del __[Using useTempFile Options](https://www.npmjs.com/package/express-fileupload)__ que se encuentra en la documentación, esto lo colocamos como un __Middleware__ en nuestra funcion llamada `middlewares()`, esto nos permitirá manejar la carga de archivos.
````
this.app.use( fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
````
Ahora en el controlador de `controllers/uploads.controllers.js`
* Se realizará la importación del `path` para proximamente usarlo al momento de guardar archivos en la aplicación de __Node__.
````
const path = require('path');
````
Utilizaremos el codigo de ejemplo de __Express-fileupload__, para utilizarlo _(modificandolo a nuestra necesidad)_
* El codigo lo sacamos del __[Github de Express-fileupload](https://github.com/richardgirges/express-fileupload/blob/master/example/server.js)__, se utilizará lo del interior del __POST__ y lo pegamos en nuestra función __cargarArchivo__.
* Extraemos la validación, esta validación es para verificar de si viene un archivo, y le agregamos el `!req.files.archivo` para validar que venga con nombre, en el caso que se cumpla una de las condiciones, saltará un __status 400__ con su mensaje.
````
if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
      res.status(400).json({msg: 'No hay archivos que subir'});
      return;
    }
````
* Creamos una constante, donde desestructuramos `archivo` y le enviamos la `request` del archivo.
* Aquí hacemos uso de la importación del __path__, donde se almacenará el archivo, creamos la carpeta `uploads/` en la raíz del proyecto, y usamos el `path.join()` para poder almacenar en la raíz del proyecto en una carpeta creada llamada `../uploads/` y almacenarla con su nombre _(Con el nombre del archivo)_.
* En el caso que exista un error se mandará un __status 500__ al __Frontend__ con el error.
* En el caso que todo sea exitoso, se enviará un mensjae al __Frontend__ diciendo que se almaceno el archivo y en donde. _(En este caso en que parte del servidor o computador)_
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
### 3.- Validar la Extensión
Para realizar este punto, dejamos como comentario la subida de archivo, para realizar la __validacion de la extensiones__. En el controlador de `uploads`
* Agregamos en la función `cargarArchivo()` la validación de las extensiones.
* Para esto buscamos el nombre del archivo y lo separamos por el __Punto " . "__.
* Luego cremos una constante `extension` y le asignamos la ultima posición de `nombreCortado`.
````
const { archivo } = req.files;
const nombreCortado = archivo.name.split('.');
const extension = nombreCortado[ nombreCortado.length - 1 ];
````
* Luego realizamos la validación de las extensiones, como primer paso colocando todas las extensiones que acetaremos en un arreglo.
* Hacemos la validación de que si no incluye la variable `extension` una de las extensiones permitidas que cuenta el arreglo `extensionesValidas`, se mandará un error al __Frontend__ con un __status 400__, en el caso que la incluya se saltara la validación.
````
const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

if( !extensionesValidas.includes(extension) ){
  return res.status(400).json({
    msg: `La extensión ${ extension } no es permitida, ${ extensionesValidas }`
  });
}
````
#
### 4.- Ubicar y Cambiar Nombre de los Archivos
En este punto se __Instalo uuid__ para crear un ID como un valor unico aleatorio, de esta manera nombrar los archivos. Esto se utiliza en el controlador de `uploads`
* Se realiza la importación de __uuid__.
````
const { v4: uuidv4 } = require('uuid');
```` 
* Eliminamos lo que teniamos `res.json(extension);` y descomentamos el codigo anterir para subir archivos.
* Creamos la constante `nombreTemp` y le asginamos el `uuidv4()`, ademas del punto y la extenisón que tenía el archivo.
* Extraemos el `archivo.name` y lo remplazamos por la constante creada `nombreTemp` para almacenarlo con ese nombre _(Que tendria la __uuid__)_ y lo demas queda igual.
````
const nombreTemp = uuidv4() + '.' + extension;
const uploadPath = path.join( __dirname, '../uploads/', nombreTemp);

archivo.mv(uploadPath, (err) => {
  if (err) {
      return res.status(500).json({ err });
  }

res.json({ msg: 'El archivo se subio a ' + uploadPath });
});
````
Aquí un ejemplo de como queda el nombre del archivo al momento de su almacenamiento, con el __uuid__

<img align="center" width="1000" src="https://res.cloudinary.com/dptnoipyc/image/upload/v1641249337/j3tl7makps9jfiiinfwj.png" />

#
### 5.- Helper - SubirArchivo 
En toda la seccion se ha realizado la subida de archivo en el controlador, ya que proximamente necesitaremos subir archivos para el usuario y producto, se necesitará replicar el codigo para subir archivos, para esto es necesario centralizar ese codigo de subida y usarlo desde los diferentes controladores

Para esto creamos un nuevo helper:
* Se crea un `helpers/index.js` donde realizaremos la importación y exportacion de todos los helpers.
* Se crea `helpers/subir-archivo.js` para manejar la subida de archivos.

En `helpers/index.js`
* Realizamos la importación de todos los archivo de la carpeta __helpers__.
````
const dbValidators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');
````
* Realizamos la exportación de todos los archivos de la carpeta __helpers__
````
module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo
}
````
En `helpers/subir-archivo.js`
* Extreameos la importación del `path` y `uuid` del controlador de `uploads` y lo usamos en el helper nuevo.
````
const path = require('path');
const { v4: uuidv4 } = require('uuid');
````
* Extraemos todo el codigo de __subir archivo__ del controlador de `uploads`.
* Creamos nuestra nueva función `subirArchivo()` que le pasaremos los parametros que necesitaremos, el `files` que es el archivo nos envian, `extensionesValidas` que le agregamos un arreglo por defecto de imagenes y `carpeta` en el caso que lo querramos almacenar en una carpeta adicional.
* Retornamos una nueva promesa, donde encerraremos todo el codgio que se extrajo del controlador _(para la subida de archivos)_.  
````
const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'], carpeta = '' ) => {

    return new Promise((resolve, reject) => {

      ...
    });

}
````
* Las primeras 3 lineas las dejamos igual, es para extraer la extensión.
* En la validación se remplaza el `res.status(400).json()` por un `reject()` con el mismo mensaje.
* Las siguientes lineas las dejamos igual hasta llegar al `if(err)`, en vez de mandar un `res.status(500).json()` enviamos un `reject()` con el error.
* Y al final en vez de un `res.json()` con el mensaje que se subio el archivo, se envia un `resolve()` con el nombre del archivo y su extensión, a diferencia de antes que se enviaba la dirección completa de donde se almacenaba, pero no es necesario ya que al cliente no puede acceder a esa dirección del servidor.
````
const { archivo } = files;
const nombreCortado = archivo.name.split('.');
const extension = nombreCortado[nombreCortado.length - 1];


if (!extensionesValidas.includes(extension)) {
    return reject(`La extensión ${extension} no es permitida ${extensionesValidas}`);
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
* Dejamos la validación de que si viene un archivo o no.
* Luego la función la hacemos asincrona, creamos una constante `nombre` y despues de importar la función de `subirArchivo()` la utilizamos con el `await` y le asignamos `req.files`.
* Luego mandamos al __Frontend__ la constante creada. 
```` 
    const nombre = await subirArchivo( req.files )
    
    res.json({ nombre })
````
#
### 6.- Crear Carpetas de Destino
Para crear carpetas se usara una configuración de __Express-fileupload__ llamada __[createParentPath](https://www.npmjs.com/package/express-fileupload)__, esta por defecto tiene un valor `false` hay que pasarlo a `true`

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
* Encerramos en un __Try-Catch__ para controlar los errores, en el caso que no se envié un formato deseado por ejemplo.
* En este ejemplo queremos que solo se admitan formatos `.txt` y `.md`, ademas que cree una carpeta llamada `textos`, gracias a la configuración anterior se podrá crear.
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
### 7.- Ruta para Actualizar Imágenes de Usuario y Producto
A continuación se creará el endpoit para validar las rutas para las imagenes
En `helpers/db-validators.js`
* Crearemos la validación de las colecciones permitidas, con una función `coleccionesPermitidas()` que recibira como parametros la `coleccion` que vendrá del __Frontend__ y la `colecciones` como un arreglo que se perimitiran, esta ya estarán definidas en el endpoint.
* En el caso que no se incluya se enviará un error.
* No olvidar exportar la función.
````
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );
    if( !incluida ){
        throw new Error(`La colección ${ coleccion } no es permitida: ${ colecciones } `);
    }
    return true;
}
````
En `controllers/uploads.controllers.js`
* Crearemos la función de actualizar asincrona.
* Que simplemente recibira el id y la colección para luego enviarla al __Frontend__.
````
const actualizarImagen = async(req, res = response) => {

  const { id, coleccion } = req.params;

  res.json({id, coleccion})
}
````
En `routes/uploads.js`
* Creamos el nuevo endpoit __PUT__ para la actualización, que recibirá la colección y el id.
* Validar si el id es de __MongoDB__.
* Validar la colección, de una manera personalizada usando la función crada en `helpers/db-validators.js`, viendo si lo que se recibe por el __Frontend__ es una coleccion valida, segun lo que se tenga en el arreglo, en el caso que no se enviará un error _(importamos `coleccionesPermitidas`)_.
* Agregamos el `validarCampos` y usamos la función del controlador de `uploads`.
````
router.put('/:coleccion/:id', [
    check('id', 'El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], actualizarImagen);
````
#
### 8.- Actualizar Imagen de Usuario y Producto (En BD)
Se actualizará el modelo de __Producto__ para almacenar imagenes y modificar el controlador de __Actualizar__ imagenes, tanto de los Usuarios como Productos

En `models/producto.js`
* Agregamos en el modelo el string que alacenará la imagen en BD.
````
img: { type: String },
````
En `controllers/uploads.controllers.js`
* Importamos los modelos de __Usuarios__ y __Productos__.
````
const { Usuario, Producto } = require('../models');
````
* En la función `actualizarImagen()` agregamos el validar si existe algun archivo.
````
if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({ msg: 'No hay archivos subido' });
    return;
  }
````
* Creamos una variable llamada `modelo` que utilizaremos.
* Creamos un __switch__ con 2 casos _(usuarios y productos)_ y 1 por defecto.
* En el `case` de usuarios se le asigna a la variable `modelo` la busqueda del id de usuario, en el caso que no se encuentre un usario con ese id, se enviará un error con __status 400__ al __Frontend__ _(muy similar en productos)_.
* En el caso que se mande un caso que no se tenga, saltara el `default` se enviará un mensaje con __status 500__.
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
* Usamos la función de guardar archivo en la aplicación, y adicionalmente lo guardamos en Base de Datos.
* Finalmente enviamos el modelo actualizado.
````
const nombre = await subirArchivo( req.files, undefined, coleccion );
  modelo.img = nombre; 

  await modelo.save();

  res.json(modelo);
````
#
### 9.- Agregar un Middleware de Subir Archivo (Optimizar Codigo)
En el caso que no se suba un archivo lo que hicimos es copiar una validación que habiamos hecho en el controlador especificamente en la función `cargarArchivo()`, para evitar tener codigo repetido se optimizará y se creará un __Middleware__ exclusivo que se utilizará en los diferentes endpoint de `uploads`

Se hará lo siguiente:
* Crear un archivo nuevo llamado `middlewares/validar-archivo`.
* Se traspasara la importación al archivo `middlewares/index.js` para realizar todas las exportaciónes.
* Eliminar el codigo repetido en la función `cargarArchivo()` y `actualizarImagen()` del controlador de `uploads`.
En `middlewares/validar-archivo.js`
* Realizamos la importación de `response` para apoyarnos con el typado.
* Creamos la función `validarArchivoSubido()` _(Middleware)_.
* Extraemos el codigo repetido que se tenía en el controlador de `uploads`.
* Exportamos la función.
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
* Agregamos la importación de `validarArchivoSubido`.
````
const validarArchivoSubido   = require('../middlewares/validar-archivo');
````
* Realizamos la exportación de `validarArchivoSubido`
````
module.exports = {
    ...
    ...validarArchivoSubido,
}
````
En `controllers/uploads.controllers.js`
* Finalmente se elimina el codigo repetitivo que se tenía.
#