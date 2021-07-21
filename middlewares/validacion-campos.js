const { validationResult } = require('express-validator');


const validarCampos=(req,res,next)=>{
    const err=validationResult(req)//para la validacion, almacenamientos de los middlewares en la req
    if(!err.isEmpty()){
        const errores=err.errors
        req.flash('error',errores.map(error=>error.msg));
    }
    next();
}
module.exports ={
    validarCampos,
}