const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    // 'proca',
    'roles'
]

const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); // true

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const countUsuario = await Usuario.count({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: [{ cantidad: countUsuario }, usuarios]
    });
}

const buscarCategorias = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); // true

    if (esMongoID) {
        const categoria = await Categoria.findById(termino)
            .populate('usuario', 'nombre');
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }
    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({ nombre: regex, estado: true })
        .populate('usuario', 'nombre');

    res.json({
        results: categorias
    });
}
const buscarProductos = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); // true

    if (esMongoID) {
        const producto = await Producto.findById(termino)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }
    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({ nombre: regex, estado: true })
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');
   
    
    const countProductos = await Producto.count({ nombre: regex, estado: true });

    res.json({
        results: [{ cantidad: countProductos }, productos]
    });
}

// const buscarProCa = async(termino = '', res = response) => {
    
//         const isMongoID = ObjectId.isValid( termino )
     
//         if ( isMongoID ) {
//             const producto = await Producto.find( { categoria: ObjectId( termino ) } )
//                                            .populate('usuario', 'nombre')
//                                            .populate('categoria', 'nombre')
     
//             return res.json( {
//                 results: ( producto ) ? [ producto ] : []
//             })
//         }
     
//         const regex = new RegExp( word, 'i' )
     
//         const categorias = await Category.find({ nombre: regex, estado: true})
        
//         const productos = await Producto.find({
//             $or: [...categorias.map( categoria => ({
//                 categoria: categoria._id
//             }))],
//             $and: [{ estado: true }]
//         }).populate('usuario', 'nombre')
//           .populate('categoria', 'nombre');
     
         
//      const hola = 'hgola'
//         res.json({
//             results: productos
//         })
     
    
// }

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);

            break;
        case 'categorias':
            buscarCategorias(termino, res);


            break;
        case 'productos':
            buscarProductos(termino, res);


            break;
        // case 'proca':
        //     buscarProCa(termino, res);


        //     break;

        default:
            res.status(500).json({
                msg: 'Se olvido hacer esta búsqueda'
            })
    }
}



module.exports = {
    buscar
}