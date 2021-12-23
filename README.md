# REST Server - Google Sign in - Frontend y Backend

Ahora se utilizará la autentificación de Google, elementos utilizados

* __[REST Server con Node.js y Express](https://github.com/Paserno/node-express-restserver-fst/blob/main/README1.md)__  _(Primera versión [V1.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v1.0.0))_
* __[REST Server - CRUD con MongoDB](https://github.com/Paserno/node-express-restserver-fst/blob/main/README2.md)__  _(Segunda versión [V2.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v2.0.0))_

* __[REST Server - Autentificación de usuario - JWT](https://github.com/Paserno/node-express-restserver-fst/blob/main/README3.md)__  _(Tercera versión anterior [V3.0.0](https://github.com/Paserno/node-express-restserver-fst/tree/v3.0.0))_

* __[Google Auth Library](https://www.npmjs.com/package/google-auth-library)__ _([Guia de Google](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token))_

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
### 3.- Ruta para manejo de autenticación de Google
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
### 4.- Validar Token de Google - Backend
Una vez instalado __google-auth-library__ podemos realizar la verificación del Token
* Se crea un archivo en los __Helpres__ llamado `helpers/google-verify.js`, la cual le pegamos la información extraida de [aquí en la parte de Node.js](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token).
* Donde estaba el `CLIENT_ID` lo remplazamos por nuestra variable de entorno.
* Le cambiamos el nombre de `verify()` a `googleVerify()` y le pasaremos el __Token__.
* Creamos una constante desestructurada, donde tomaremos el `name, picture, email`.
* Luego lo retornamos con los nombres que usaremos en la BD.
* Finalmente realizamos la exportación de la función creada.
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
* Realizamos la importación de la función.
````
const { googleVerify } = require("../helpers/google-verify");
````
* En la función `googleSignIn()` le insertamos un __Try-Catch__ en el caso que se produzca un error.
* Del token de google se lo mandamos a la función para que extraiga el nombre, img y correo.
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
        res.status(400).json({
            ok: false,
            msg: 'El Token no se pudo verificar'
        })
    }
````
#
### 5.- Crear un usuario personalizado con las credenciales de Google
Se realizaran algunas validaciones y un registro a la BD en el caso que el usuario no exista
* En nuestra función `googleSignIn()` del controlador de `auth.controllers.js`, en el __Try__.
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
* Verificamos si el estado del usuario es `false`, si es así le mandamos un mensaje de que el usuario esta bloqueado.
````
 if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }
````
* Mandamos como respuesta al Frontend el usuario con el token que se generó.
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
* Y nos creamos una función para salirnos de la sesión, para esto buscamos el id del boton.
* Realizamos un evento `onclick` y es necesario realizar el `disableAutoSelect()` para registrar el estado de las [cookies](https://developers.google.com/identity/gsi/web/reference/js-reference).
* Es necesario usar el `revoke()` para [remover](https://developers.google.com/identity/gsi/web/guides/revoke) la sesión de google, para esto tambien llamamos el limpiar el __LocalStorage__ y recargar la pagina.
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