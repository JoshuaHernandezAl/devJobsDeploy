const {response}= require('express');
const Vacante = require('../models/Vacante');
const { validationResult } = require('express-validator');
const multer = require('multer');
const  shortid = require('shortid');


const subirCV=(req,res=response,next)=>{
    upload(req,res,(error)=>{
        if(error){
            if(error instanceof multer.MulterError){
                if(error.code==='LIMIT_FILE_SIZE'){
                    req.flash('error', 'El archivo es muy grande: Máximo 500kb ');
                }else{
                    req.flash('error', error.message);
                }
                
            }else{
                req.flash('error', error.message);
            }
            res.redirect('back');
            return;
        }else{
            return next();
        }
    });
}

const configuracionMulter={
    limits:{fileSize:500000},
    storage:fileStorage=multer.diskStorage({
        destination:(req,file,callback)=>{
            callback(null,__dirname+'../../public/uploads/cv');
        },
        filename:(req,file,callback)=>{
            const extension=file.mimetype.split('/')[1];
            callback(null,`${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req,file,cb){
        if(file.mimetype==='application/pdf'){
            cb(null,true);
        }else{
            cb(new Error('Formato no valido'),false);
        }
    },
}
const upload=multer(configuracionMulter).single('cv');


const renderVacante=async(req,res=response,next)=>{
    const {url}=req.params;
    const err=validationResult(req)//para la validacion, almacenamientos de los middlewares en la req
    if(!err.isEmpty()){
        if(!url){
            return res.render('nuevaVacante',{
                nombrePagina:'Nueva Vancante',
                tagline:'Llena el formulario y publica tu vacante',
                cerrarSesion:true,
                nombre:req.user.nombre,
                mensajes:req.flash(),
            });
        }else{
            const vacante=await Vacante.findOne({url});
            return res.render('editar-vacante',{
                vacante,
                nombrePagina:`Editar - ${vacante.titulo}`,
                cerrarSesion:true,
                nombre:req.user.nombre,
                mensajes:req.flash(),
            });
        }
    }
    next();
    
}
const renderVacanteCandidato=async(req,res=response,next)=>{
    const {url}=req.params;
    const err=validationResult(req)//para la validacion, almacenamientos de los middlewares en la req
    const vacante=await Vacante.findOne({url}).populate('autor');
    if(!err.isEmpty()){
        return res.render('vacante',{
            vacante,
            nombrePagina:vacante.titulo,
            barra:true,
            mensajes:req.flash(),
        });
    }
    next();
}

module.exports={
    renderVacante,
    subirCV,
    renderVacanteCandidato,
}