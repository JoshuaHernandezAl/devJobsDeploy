const {Router} = require('express');
const {check} = require('express-validator');
const { autenticarUsuario, mostrarPanel, verificarUsuario, cerrarSesion, formRestablecerPassword, enviarToken, reestablecerPassword, guardarPassword } = require('../controllers/auth.controller');
const { mostrarTrabajos } = require('../controllers/home.controller');
const { formCrearCuenta, crearUsuario, formIniciarSesion, editarPerfil, formEditarPerfil } = require('../controllers/usuarios.controller');
const { formularioNuevaVacante, agregarVacante, mostrarVacante, editarVacante, formEditarVacante, eliminarVacante, contactar, mostrarCandidatos, buscarVacantes } = require('../controllers/vacantes.controller');
const { validarCampos } = require('../middlewares/validacion-campos');
const { matchPassword, renderUsuario, renderPerfil, subirImagen,  } = require('../middlewares/validacion-usuario');
const { renderVacante, subirCV, renderVacanteCandidato } = require('../middlewares/validacion-vacantes');
const router=Router();


router.get('/',mostrarTrabajos);
router.get('/vacantes/:url',[],mostrarVacante);


router.get('/vacantes/nueva',[verificarUsuario],formularioNuevaVacante);
router.post('/vacantes/nueva',[
    verificarUsuario,
    check('titulo','Agrega un titulo a la vacante').not().isEmpty().escape(), 
    check('empresa','Agrega una empresa a la vacante').not().isEmpty().escape(), 
    check('ubicacion','Agrega una ubicacion a la vacante').not().isEmpty().escape(), 
    check('contrato','Agrega un contrato a la vacante').not().isEmpty().escape(), 
    check('skills','Agrega al menos una skill a la vacante').not().isEmpty().escape(),
    validarCampos,
    renderVacante
    ],agregarVacante);


router.get('/vacantes/editar/:url',[verificarUsuario],formEditarVacante);
router.post('/vacantes/editar/:url',[
    verificarUsuario,
    check('titulo','Agrega un titulo a la vacante').not().isEmpty().escape(), 
    check('empresa','Agrega una empresa a la vacante').not().isEmpty().escape(), 
    check('ubicacion','Agrega una ubicacion a la vacante').not().isEmpty().escape(), 
    check('contrato','Agrega un contrato a la vacante').not().isEmpty().escape(), 
    check('skills','Agrega al menos una skill a la vacante').not().isEmpty().escape(),
    validarCampos,
    renderVacante
    ],editarVacante);
router.delete('/vacantes/eliminar/:id',[],eliminarVacante);


router.get('/crear-cuenta',formCrearCuenta);
router.post('/crear-cuenta',[
    check('nombre','El nombre es obligatorio').not().isEmpty().escape(),
    check('email','El email no es valido').isEmail().escape(),
    check('password','La contraseña  es obligatoria').not().isEmpty().escape(),
    check('confirmar','Confirma tu contraseña').not().isEmpty().escape(),
    check('confirmar').custom((confirmar,{req},)=>(matchPassword(confirmar,req))),
    validarCampos,
    renderUsuario
],crearUsuario);
router.get('/iniciar-sesion',formIniciarSesion);
router.post('/iniciar-sesion',autenticarUsuario);
router.get('/cerrar-sesion',[verificarUsuario],cerrarSesion);


router.get('/reestablecer-password',[],formRestablecerPassword);
router.post('/reestablecer-password',[],enviarToken);
router.get('/reestablecer-password/:token',reestablecerPassword)
router.post('/reestablecer-password/:token',guardarPassword);


router.get('/administracion',[verificarUsuario],mostrarPanel);
router.get('/editar-perfil',[verificarUsuario],formEditarPerfil);
router.post('/editar-perfil',[
    verificarUsuario,
    subirImagen,
    check('nombre','El nombre no puede ir vacio').not().isEmpty().escape(),
    check('email','El email no puede ir vacio').isEmail().escape(),
    validarCampos,
    renderPerfil
    ],editarPerfil);


router.post('/vacantes/:url',[
    subirCV,
    check('nombre','El nombre no puede ir vacio').not().isEmpty().escape(),
    check('email','El email no puede ir vacio').isEmail().escape(),
    validarCampos,
    renderVacanteCandidato
],contactar)

router.get('/candidatos/:id',[
    verificarUsuario,
],mostrarCandidatos);


router.post('/buscador',[],buscarVacantes);


module.exports=router;