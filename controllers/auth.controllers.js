const { response } = require("express");


const login = ( req, res = response) => {

    res.json({
        msg: 'Login ok'
    })

}



module.exports = {
    login
}