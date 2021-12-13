require('dotenv').config();

const port = process.env.PORT;

const express = require('express')
const app = express()
 
app.get('/', function (req, res) {
  res.send('Hello World')
});
 
app.listen( port, () =>{
    console.log('Servidor corriendo en el puerto', port);
} );