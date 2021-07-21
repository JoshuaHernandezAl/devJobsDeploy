const mongoose = require('mongoose');
const {dbConnection}=require('./config/db');

// const bodyParser = require('body-parser');
const handlebars = require('handlebars');
const express = require('express');
const hbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const flash = require('connect-flash');
const passport = require('./config/passport');
const createError=require('http-errors');

const MongoStore = require('connect-mongo');
require('dotenv').config();
const app=express();

const PORT=process.env.PUERTO;

const conectarDB=async()=>{
    await dbConnection();
}




//VIstas
app.engine('handlebars',hbs({
    handlebars: allowInsecurePrototypeAccess(handlebars),
    defaultLayout:'layout',
    helpers:require('./helpers/handlebars'),
}));
app.set('view engine','handlebars');

app.use(express.static(path.join(__dirname,'public')));

//sesiones

//conectar db
conectarDB();

//middlewares
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());
app.use(session({
    secret: process.env.SECRETO,
    key:process.env.KEY,
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({mongoUrl:process.env.DATABASE}),
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

//Middleware propios
app.use((req,res,next) =>{
    res.locals.mensajes=req.flash();
    next();
});


app.use('/',require('./routes/index.routes'));

app.use((req,res,next)=>{
    next(createError(404,'No encontrado'));
});

//administracion de errores
app.use((error,req,res,next)=>{
    res.locals.mensaje=error.message;
    res.render('error');
});

const host='0.0.0.0';
const port=process.env.PORT

app.listen(port,host,()=>{
    console.log('Servidor en el puerto:', port);
});

