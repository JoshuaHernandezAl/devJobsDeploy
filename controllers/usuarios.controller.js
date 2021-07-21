const Usuario = require('../models/Usuario');

const formCrearCuenta=(req,res=response)=>{
    res.render('crear-cuenta',{
        nombrePagina:'Crea tu cuenta en devJobs',
        tagline:'Comienza a publicar tus vacantes gratis',

    });
}
const crearUsuario=async(req,res=response,next)=>{
    const {body}=req;
    const usuario=new Usuario(body);
    try{
        await usuario.save();
        res.redirect('/iniciar-sesion');
    }catch(error){
        req.flash('error',error);
        res.redirect('/crear-cuenta');
    }

}
const formIniciarSesion=(req,res=response)=>{
    res.render('iniciar-sesion',{
        nombrePagina:'Iniciar Sesion devJobs',
    });
}
const formEditarPerfil=(req,res=response)=>{
    res.render('editar-perfil',{
        nombrePagina:'Edita tu perfil en devJsobs',
        usuario:req.user,
        cerrarSesion:true,
        nombre:req.user.nombre,
        imagen:req.user.imagen,
    });
}

const editarPerfil=async(req,res=response)=>{
    const {nombre,email,password}=req.body;
    const usuario=await Usuario.findById(req.user._id);
    usuario.nombre=nombre;
    usuario.email=email;
    
    if(password){
        usuario.password=password;
    }

    //imagen
    if(req.file){
        usuario.imagen=req.file.filename;
    }


    await usuario.save();
    req.flash('correcto','Cambios guardados correctamente');
    res.redirect('/administracion');
}


module.exports={
    formCrearCuenta,
    crearUsuario,
    formIniciarSesion,
    formEditarPerfil,
    editarPerfil,
}