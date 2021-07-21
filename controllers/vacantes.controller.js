const Vacante = require('../models/Vacante');

const {response} = require('express');
const { verificarAutor } = require('../helpers/verificarAutor');



const formularioNuevaVacante=(req,res=response)=>{
    res.render('nuevaVacante',{
        nombrePagina:'Nueva Vancante',
        tagline:'Llana el formulario y publica tu vacante',
        cerrarSesion:true,
        nombre:req.user.nombre,
    });
}
const agregarVacante=async(req,res=response)=>{
    const {skills:skill,...body}=req.body;
    const skills=skill.split(',');
    data={...body,skills,autor:req.user._id}
    
    const vacante=new Vacante(data);

    const nuevaVacante=await vacante.save();

    res.redirect(`/vacantes/${nuevaVacante.url}`);
}
const mostrarVacante=async(req,res=response,next)=>{
    const {url}=req.params;
    const vacante=await Vacante.findOne({url}).populate('autor');
    if(!vacante){
        return next();
    }
    if(req.user){
        if(req.user._id==vacante.autor._id.toString()){
            return res.render('vacante',{
                vacante,
                nombrePagina:vacante.titulo,
                barra:true,
                btnEditar:true,
            });
        }
    }
    res.render('vacante',{
        vacante,
        nombrePagina:vacante.titulo,
        barra:true,
        btnEditar:false,
    });
}
const formEditarVacante=async(req,res=response,next)=>{
    const {url}=req.params;
    const vacante=await Vacante.findOne({url});
    if(!vacante){
        next();
    }
    res.render('editar-vacante',{
        vacante,
        nombrePagina:`Editar - ${vacante.titulo}`,
        cerrarSesion:true,
        nombre:req.user.nombre,
        imagen:req.user.imagen,
    });
}
const editarVacante=async(req,res=response)=>{
    const {url}=req.params;
    const {skills:skill,...vacanteActualizada}=req.body;
    const skills=skill.split(',');
    const data={...vacanteActualizada,skills};
    const vacante=await Vacante.findOneAndUpdate({url},data,{
        new:true,
        runValidators:true,
    });

    res.redirect(`/vacantes/${vacante.url}`);
}
const eliminarVacante=async(req,res=response)=>{
    const {id}=req.params;
    
    const vacante=await Vacante.findById(id);

    if(verificarAutor(vacante,req.user)){
        vacante.remove();
        res.status(200).send('Vacante Eliminada Correctamente');
    }else{
        res.status(403).send('Error');
    }
    
}
const contactar=async(req,res=response,next)=>{
    const {url}=req.params;
    const vacante=await Vacante.findOne({url});
    if(!vacante){
        return next();
    }
    const {nombre,email}=req.body;
    const nuevoCandidato={
        nombre,
        email,
        cv:req.file.filename,
    }

    vacante.candidatos=[...vacante.candidatos,nuevoCandidato];
    await vacante.save();

    req.flash('correcto','CV envidado');
    res.redirect('/');
}

const mostrarCandidatos=async(req,res=response,next)=>{
    const {id}=req.params;
    const vacante=await Vacante.findById(id);
    if(vacante.autor!=req.user._id.toString()){
        return next();
    }
    if(!vacante){
        return next();
    }
    res.render('candidatos', {
        nombrePagina:`Candidatos Vacante- ${vacante.titulo}`,
        cerrarSesion:true,
        nombre:req.user.nombre,
        imagen:req.user.imagen,
        candidatos:vacante.candidatos,
    });
}
const buscarVacantes=async(req,res=response)=>{
    const vacantes=await Vacante.find({
        $text:{
            $search:req.body.q,
        }
    });
    res.render('home',{
        nombrePagina:"Resultados:",
        barra:true,
        vacantes,
    })
}



module.exports={
    formularioNuevaVacante,
    agregarVacante,
    mostrarVacante,
    formEditarVacante,
    editarVacante,
    eliminarVacante,
    contactar,
    mostrarCandidatos,
    buscarVacantes
}