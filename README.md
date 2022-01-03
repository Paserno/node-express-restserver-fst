# REST Server - Carga de Archivo y Protección

Se trabajará con la __Carga de Archivos__ realizando un endpoint que reciba cualquier archivo, ademas con imagenes para los productos y usuarios, elementos utilizados

* __[REST Server con Node.js y Express](https://github.com/Paserno/node-express-restserver-fst/blob/main/README1.md)__  _(Primera versión [V1.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v1.0.0))_
* __[REST Server - CRUD con MongoDB](https://github.com/Paserno/node-express-restserver-fst/blob/main/README2.md)__  _(Segunda versión [V2.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v2.0.0))_

* __[REST Server - Autentificación de usuario - JWT](https://github.com/Paserno/node-express-restserver-fst/blob/main/README3.md)__  _(Tercera versión [V3.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v3.0.0))_

* __[REST Server - Google Sign in - Frontend y Backend](https://github.com/Paserno/node-express-restserver-fst/blob/main/README4.md)__  _(Cuarta versión [V4.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v4.0.0))_

* __[REST Server - Categorías y Productos](https://github.com/Paserno/node-express-restserver-fst/blob/main/README5.md)__  _(Quinta versión anterior [V5.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v5.0.0))_

* __[Express-fileupload](https://www.npmjs.com/package/express-fileupload)__

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