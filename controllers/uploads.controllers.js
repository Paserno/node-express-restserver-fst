const { response } = require('express');
const { subirArchivo } = require('../helpers');

const { Usuario, Producto } = require('../models');


const cargarArchivo = async (req, res = response) => {

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({ msg: 'No hay archivos subido' });
    return;
  }

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

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({ msg: 'No hay archivos subido' });
    return;
  }
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

  const nombre = await subirArchivo( req.files, undefined, coleccion );
  modelo.img = nombre; 

  await modelo.save();

  res.json(modelo);
}

module.exports = {
  cargarArchivo,
  actualizarImagen
}