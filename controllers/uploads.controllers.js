const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require('express');
const { subirArchivo } = require('../helpers');

const { Usuario, Producto } = require('../models');


const cargarArchivo = async (req, res = response) => {

  try {
    // Formato de Imagenes  // txt, md // nombre de la carpeta
    // const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos' );
    const nombre = await subirArchivo(req.files, undefined, 'imgs');
    res.json({ nombre });

  } catch (msg) {
    res.status(400).json({ msg })
  }
}

const actualizarImagen = async (req, res = response) => {

  const { id, coleccion } = req.params;

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
  
  //todo: Limpiar Imagenes Previas
  if( modelo.img ){
    // Hay que borrar la imagen del servidor
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
    if( fs.existsSync( pathImagen ) ){
      fs.unlinkSync( pathImagen ); 
    }
  }

  const nombre = await subirArchivo( req.files, undefined, coleccion );
  modelo.img = nombre; 

  await modelo.save();

  res.json(modelo);
}
/////////////////////////////////////////////
const actualizarImagenCloudinary = async (req, res = response) => {

  const { id, coleccion } = req.params;

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
  
  //todo: Limpiar Imagenes Previas
  if( modelo.img ){
    const nombreArr = modelo.img.split('/');
    const nombre    = nombreArr[ nombreArr.length - 1];
    const [ public_id ]      = nombre.split('.'); 
    cloudinary.uploader.destroy( `node-cafe/${coleccion}/${public_id}` );
  }

  const { tempFilePath } = req.files.archivo
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath, { folder: `node-cafe/${coleccion}`} );
  modelo.img = secure_url; 

  await modelo.save();

  res.json(modelo);
}
////////////////////////////////////////////


const mostrarImagen = async(req, res = response) => {

  const { id, coleccion } = req.params;

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
  
  
  if( modelo.img ){

    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
    if( fs.existsSync( pathImagen ) ){
      return res.sendFile( pathImagen );
    }
  }


  const pathImagen = path.join( __dirname, '../assets/no-image.jpg');
  res.sendFile(pathImagen);

}

///////////////////////////////////////
const mostrarImagenCloudinary = async(req, res = response) => {

  const { id, coleccion } = req.params;

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
  

  if( modelo.img ){

    return res.json({
      img: modelo.img
    });
  }


  const pathImagen = path.join( __dirname, '../assets/no-image.jpg');
  res.sendFile(pathImagen);

}
///////////////////////////////////////


module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
  mostrarImagenCloudinary
}