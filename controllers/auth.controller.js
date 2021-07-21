const passport = require('passport');
const Vacante = require('../models/Vacante');
const Usuarios=require('../models/Usuario');
const enviarEmail=require('../handlers/email');
const crypto=require('crypto');

const autenticarUsuario=passport.authenticate('local',{
    successRedirect:'/administracion',
    failureRedirect:'/iniciar-sesion',
    failureFlash:true,
    badRequestMessage:'Ambos campos son obligatorios',
});

const verificarUsuario=(req,res=response,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/iniciar-sesion');
}


const mostrarPanel=async(req,res=response)=>{
    const autor=req.user._id;
    const vacantes=await Vacante.find({autor});

    res.render('administracion',{
        nombrePagina:'Panel de administracion',
        tagline:"Crea y administra tus vancantres desde aqui",
        vacantes,
        cerrarSesion:true,
        nombre:req.user.nombre,
        imagen:req.user.imagen,
    });
}
const cerrarSesion=(req,res=response)=>{
    req.logout();
    req.flash('correcto','Hasta luego ');
    return res.redirect('/iniciar-sesion');
}

const formRestablecerPassword=(req,res=response,next)=>{
    res.render('reestablecer-password',{
        nombrePagina:'Reestablecer contraseña',
        tagline:'Si olvidaste tu contraseña, coloca tu email',
    });
}
const enviarToken=async(req,res=response)=>{
    const usuario = await Usuarios.findOne({ email: req.body.email });

    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        return res.redirect('/iniciar-sesion');
    }

    // el usuario existe, generar token
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expira = Date.now() + 3600000;

    // Guardar el usuario
    await usuario.save();
    const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;

    // console.log(resetUrl);

    // Enviar notificacion por email
    await enviarEmail.enviar({
        usuario,
        subject : 'Password Reset',
        resetUrl,
        archivo: 'reset'
    });

    // Todo correcto
    req.flash('correcto', 'Revisa tu email para las indicaciones');
    res.redirect('/iniciar-sesion');
};

const reestablecerPassword=async(req,res=response)=>{
    const usuario=await Usuarios.findOne({
        token:req.params.token,
        expira:{
            $gt:Date.now()
        }
    });
    if(!usuario){
        req.flash('error','Codigo invalido');
        return res.redirect('/reestablecer-password');
    }
    res.render('nuevo-password',{
        nombrePagina:'Contaseña nueva',
    });
}

const guardarPassword=async(req,res=response)=>{
    const usuario=await Usuarios.findOne({
        token:req.params.token,
        expira:{
            $gt:Date.now()
        }
    });
    if(!usuario){
        req.flash('error','Codigo invalido');
        return res.redirect('/reestablecer-password');
    }
    usuario.password=req.body.password;
    usuario.token=undefined;
    usuario.expira=undefined;
    await usuario.save();
    req.flash('correcto','Constaseña modificada correctamente');
    res.redirect('/iniciar-sesion');
}

module.exports={    
    autenticarUsuario,
    mostrarPanel,
    verificarUsuario,
    cerrarSesion,
    formRestablecerPassword,
    enviarToken,
    reestablecerPassword,
    guardarPassword
}