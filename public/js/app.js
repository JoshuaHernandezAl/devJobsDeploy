import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded',()=>{
    const skills=document.querySelector('.lista-conocimientos');

    //limpiar alertas
    let alertas=document.querySelector('.alertas');
    if(alertas){
        limpiarAlertas();
    }

    if(skills){
        skills.addEventListener('click',agregarSkills);

        //* para agregar los valores al input hidden  de editar
        skillSeleccionados();
    }
    const vacantesListado=document.querySelector('.panel-administrador');
    if(vacantesListado){
        vacantesListado.addEventListener('click',accionesListado);
    }
});

const skills=new Set();

const agregarSkills=(e)=>{
    if(e.target.tagName==='LI'){
        const skill=e.target;
        if(!skill.classList.contains('activo')){
            skills.add(skill.textContent);
            skill.classList.add('activo');
        }else{
            skills.delete(skill.textContent);
            skill.classList.remove('activo');
        }
    }
    const skillsArray=[...skills];
    document.querySelector('#skills').value=skillsArray;
}
const skillSeleccionados=()=>{
    const seleccionadas=Array.from(document.querySelectorAll('.lista-conocimientos .activo'));
    //* Array.from convierte un nodeList a un array normal sobre el cual se pueda iterar
    
    //* agregarlo al hidden
    seleccionadas.forEach(seleccionada=>{
        skills.add(seleccionada.textContent);
    });
    const skillsArray=[...skills];
    document.querySelector('#skills').value=skillsArray;
};
const limpiarAlertas=()=>{
    const alertas=document.querySelector('.alertas');
    const interval=setInterval(()=>{
        if(alertas.children.length>0){
            alertas.removeChild(alertas.children[0]);
        }else if(alertas.children.length===0){
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval);
        }
    },2000);
}

const accionesListado = (e)=>{
    e.preventDefault();
    if(e.target.dataset.eliminar){
        //Elimiar por axios
        Swal.fire({
            title: '¿Confirmar Eliminación?',
            text: "Esta accion es definitiva, no podras recuperar la vacante!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si,eliminar!',
            cancelButtonText:'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const url=`${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;
                axios.delete(url,{params:{url}})
                .then((res)=>{
                    if(res.status===200){
                        Swal.fire(
                            'Borrado!',
                            res.data,
                            'success'
                        );
                        e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
                    }
                })
                .catch(()=>{
                    Swal.fire({
                        type:'error',
                        title:"Hubo un error",
                        text:"No se pudo eliminar la vacante"
                    });
                });
                
            }
        })
    }else if(e.targer.tagName=='A'){
        window.location.href=e.target.href;
    }
}