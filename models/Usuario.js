const { Schema, model } = require("mongoose");
const shortid = require("shortid");
const bcrypt = require("bcrypt");

const UsuarioSchema=new Schema({
    email:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true,
    },
    nombre:{
        type: String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    token:String,
    expira:Date,
    imagen:String,
});
UsuarioSchema.pre("save", async function (next) {
    if(!this.isModified('password')){
        return next();
    }
    const hash=await bcrypt.hash(this.password,12);
    this.password=hash;
    next();
});
UsuarioSchema.post('save',function(error,doc,next){//! este post se ejecuta antes de guardar los valores en la BD pero despues de retificar que todos los campos hayan sido ingresados
    if(error.name==='MongoError' && error.code===11000){//* El error puede tener varios errores con este if comprobamos que se aun error de mongo y que su codigo de error conrresponda al error de duplicidad de un campo marcado como unique
        next('Ese correo ya esta registrado');
    }else{
        next(error);
    }
});
UsuarioSchema.methods={
    compararPassword:function(password){
        return bcrypt.compareSync(password,this.password);
    }
}


module.exports = model("Usuarios",UsuarioSchema);
