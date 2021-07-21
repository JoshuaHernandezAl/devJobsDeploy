const {response}= require('express');
const { validationResult } = require('express-validator');
const multer = require('multer');
const shortid = require('shortid');

const matchPassword=(req,res=response,next)=>{
    const {confirmar,password}=req.body;
    if(confirmar!==password){
        return res.status(401).json({
            msg:'Las contraseñas no coinciden',
        });
    }
    next();
}
const subirImagen=(req,res,next)=>{
    
    upload(req,res,(error)=>{
        if(error){
            if(error instanceof multer.MulterError){
                if(error.code==='LIMIT_FILE_SIZE'){
                    req.flash('error', 'El archivo es muy grande: Máximo 100kb ');
                }else{
                    req.flash('error', error.message);
                }
                
            }else{
                req.flash('error', error.message);
            }
            res.redirect('/editar-perfil');
            return;
        }else{
            return next();
        }
    });
}

const configuracionMulter={
    limits:{fileSize:100000},
    storage:fileStorage=multer.diskStorage({
        destination:(req,file,callback)=>{
            callback(null,__dirname+'../../public/uploads/perfiles');
        },
        filename:(req,file,callback)=>{
            const extension=file.mimetype.split('/')[1];
            callback(null,`${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req,file,cb){
        if(file.mimetype==='image/jpeg' || file.mimetype==='image/png' || file.mimetype==='image/jpg'){
            cb(null,true);
        }else{
            cb(new Error('Formato no valido'),false);
        }
    },
}


const upload=multer(configuracionMulter).single('imagen');




const renderUsuario=(req,res=response,next)=>{
    const err=validationResult(req)//para la validacion, almacenamientos de los middlewares en la req
    if(!err.isEmpty()){
        return res.render('crear-cuenta',{
            nombrePagina:'Crea tu cuenta en devJobs',
            tagline:'Comienza a publicar tus vacantes gratis',
            mensajes:req.flash(),
        });
    }
    next();
}
const renderPerfil=(req,res=response,next)=>{
    const err=validationResult(req)//para la validacion, almacenamientos de los middlewares en la req
    if(!err.isEmpty()){
        return res.render('editar-perfil',{
            nombrePagina:'Edita tu perfil en devJsobs',
            usuario:req.user,
            cerrarSesion:true,
            nombre:req.user.nombre,
            mensajes:req.flash(),
        })
    }
    next();
}


module.exports={
    matchPassword,
    renderUsuario,
    renderPerfil,
    subirImagen,
    
}
