//VARIABLES
const listaCursos = document.querySelector("#lista-cursos");
let arregloCursos = [];
const listaCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarrito = document.querySelector("#vaciar-carrito");

//EVENTOS
cargarEventos();
function cargarEventos() {
    //Boton Agregar
    listaCursos.addEventListener("click", agregarCurso);
    //Boton Borrar
    listaCarrito.addEventListener("click", borrarCurso)
    //Boton Vaciar
    vaciarCarrito.addEventListener("click", () => {
        limpiarHTML();
        arregloCursos = [];
        agregarLocalStorage();
    });

    //Sincronizamos el LocalStorage en el HTML
    document.addEventListener("DOMContentLoaded", () => {
        arregloCursos = JSON.parse(localStorage.getItem("carrito")) || [];
        agregarCursoHTML();
    })
}


//FUNCIONES
function agregarCurso(e) {
    e.preventDefault();
    if (e.target.classList.contains("agregar-carrito")) {
        const curso = e.target.parentElement.parentElement;

        leerDatosCurso(curso);
    }
}

//Lleemos los datos del curso seleccionado
function leerDatosCurso(curso) {
    const cursoObjeto = {
        imagen: curso.querySelector("img").src,
        titulo: curso.querySelector("h4").textContent,
        precio: curso.querySelector(".precio span").textContent,
        cantidad: 1,
        id: curso.querySelector("a").getAttribute("data-id")
    }

    //Revisamos si existen cursos duplicados
    const duplicado = arregloCursos.some((curso) => {
        return curso.id == cursoObjeto.id;
    })

    if (duplicado) {
        const cursoDuplicado = arregloCursos.map((curso) => {
            if (curso.id == cursoObjeto.id) {
                curso.cantidad++;
                return curso;
            } else {
                return curso;
            }
        });
        arregloCursos = [...cursoDuplicado];

    } else {

        arregloCursos = [...arregloCursos, cursoObjeto];
    }


    agregarCursoHTML();
}

//Hacemos aparecer los cursos en el HTML
function agregarCursoHTML() {

    limpiarHTML();

    arregloCursos.forEach(curso => {
        const nuevoCurso = document.createElement("tr");
        nuevoCurso.innerHTML = `
        <td> <img src=${curso.imagen} width="150px" > </td>
        <td>${curso.titulo}</td>
        <td>${curso.precio}</td>
        <td>${curso.cantidad}</td>
        <td> <a class="borrar-curso" data-id=${curso.id} href="#" >X</td>
        `;

        listaCarrito.appendChild(nuevoCurso);
    });

    agregarLocalStorage();
}

//Limpiamos el HTML a la hora de agregar un curso
function limpiarHTML() {
    while (listaCarrito.firstChild) {
        listaCarrito.removeChild(listaCarrito.firstChild);
    }
}

function borrarCurso(e) {
    const btnBorrar = e.target.classList.contains("borrar-curso");

    if (btnBorrar) {
        arregloCursos = arregloCursos.filter((curso) => {
            return curso.id !== e.target.getAttribute("data-id");
        });

        console.log(arregloCursos)
        agregarCursoHTML();
    };

}

//Sincronizamos el LocalStorage en la terminal
function agregarLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(arregloCursos));
}