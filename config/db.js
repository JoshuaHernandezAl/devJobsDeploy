const mongoose= require('mongoose');
const dbConnection=async()=>{
    try{
        await mongoose.connect(process.env.DATABASE,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex:true,
            useFindAndModify:false,
        });
        console.log('Conexion a base de datos exitosa');
        // require('../models/Vacante');
    }catch(err){
        console.log(err);
        throw new Error('Error en la conexion de a la base de datos');
    }
}



module.exports={
    dbConnection,
}