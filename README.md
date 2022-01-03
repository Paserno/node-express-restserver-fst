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