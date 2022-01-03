const path = require('path');

const { response } = require('express');


const cargarArchivo = (req, res = response) => {
  
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
      res.status(400).json({msg: 'No hay archivos que subir'});
      return;
    }
    
     const { archivo } = req.files;
    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[ nombreCortado.length - 1 ];

    // Validar la extension
    const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if( !extensionesValidas.includes(extension) ){
      return res.status(400).json({
        msg: `La extensión ${ extension } no es permitida, ${ extensionesValidas }`
      });
    }

    
    res.json(extension);

    // ? Subir Archivos
    // const uploadPath = path.join( __dirname, '../uploads/', archivo.name);
  
    // archivo.mv(uploadPath, (err) => {
    //   if (err) {
    //      return res.status(500).json({ err });
    //   }
  
    //   res.json({ msg: 'El archivo se subio a ' + uploadPath });
    // });
}

module.exports = {
    cargarArchivo
}