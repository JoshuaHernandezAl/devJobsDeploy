const {response} = require('express');
const Vacante = require('../models/Vacante');


const mostrarTrabajos=async(req,res=response,next)=>{
    const vacantes=await Vacante.find();
    
    if(!vacantes){
        return next();
    }

    res.render('home',{
        nombrePagina:'devJobs',
        tagline:'Encuentra y Publica Trabajos para Desarrolladores Web',
        barra:true,
        boton:true,
        vacantes
    })
}


module.exports={
    mostrarTrabajos,
}