
const verificarAutor=(vacante={},usuario={})=>{
    if(!vacante.autor.equals(usuario._id)){
        return false;
    }
    return true;
}

module.exports={
    verificarAutor,
}
