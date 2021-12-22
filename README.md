# REST Server - Google Sign in - Frontend y Backend

Ahora se utilizará la autentificación de Google, elementos utilizados

* __[REST Server con Node.js y Express](https://github.com/Paserno/node-express-restserver-fst/blob/main/README1.md)__  _(Primera versión [V1.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v1.0.0))_
* __[REST Server - CRUD con MongoDB](https://github.com/Paserno/node-express-restserver-fst/blob/main/README2.md)__  _(Segunda versión [V2.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v2.0.0))_

* __[REST Server - Autentificación de usuario - JWT](https://github.com/Paserno/node-express-restserver-fst/blob/main/README3.md)__  _(Tercera versión anterior [V3.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v3.0.0))_

#
### 1.- Generar API Key y API secret de Google
Se creo un proyecto en Google, para generar las [APIs](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid) que se utilizarán
* En `.env` se crearon 2 nuevas variables de entornos para utilizar.
````
GOOGLE_CLIENT_ID=
GOOGLE_SECRET_ID=
````
#
### 2.- Usuario de Google - Frontend
Ahora copiaremos las instrucciones que nos sale en la documentación de Google para poner el [boton de Google](https://developers.google.com/identity/gsi/web/guides/display-button)
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
* Agregamos la función de [manejo de credencial con JS](https://developers.google.com/identity/gsi/web/guides/handle-credential-responses-js-functions) y eliminamos la mayoria del contenido, para solo recibir el __Token de Google__
````
<script>
        function handleCredentialResponse(response) {

           console.log('id_token', response.credential);
        }
</script>
````
#
### 4.- Ruta para manejo de autenticación de Google
Crearemos una función en el controlador para manejar lo que recibiremos por la petición POST, en este caso el __Token__, esto lo haremos en el __Backend__ y tendremos que hacer el POST desde el __Frontend__
#### Backend
En `controllers/auth.controllers.js`
* Realizaremos la función la cual recibirá el token que será mandado por el body del endpoint.
* Si sale todo bien, se enviará una respuesta de que todo esta bien y el token.
* No olvidar hacer la exportación de la función creada.
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
* Realizamos la importación de la función recien creada, para su utilización.
````
const { login, googleSignIn } = require('../controllers/auth.controllers');
````
* Creamos otro POST, en este caso será especificamente para Google.
* Verificamos que `id_token` sea recibido, en el caso que no venga, se emitira un mensaje que es requerido.
* Posterior a la validación del campo, pasamos la función creada, para recibir el token.
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
* Realizamos el primero `.then()` par recibir la respuesta de la promesa del __fetch__ y transformarlo en un __JSON__ para luego con el segundo `.then()` recibir la segunda promesa con la respuesta que dará el __JSON__ que vendra el contenido que se nos mando del __Backend__, el cual es el mensaje y el __Token__.
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