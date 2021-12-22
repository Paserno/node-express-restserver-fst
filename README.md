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