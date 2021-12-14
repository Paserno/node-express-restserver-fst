> __Elemento Anterior 👀:__ __[Creación de un Webserver](https://github.com/Paserno/node-express-webserver-first)__
# REST Server con Node.js y Express
Rest Server Básico para aprender a configurar, se utilizaron los siguientes elementos:
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
### 8.- 