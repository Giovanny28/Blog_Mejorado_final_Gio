// Cargar comentarios almacenados al iniciar
window.onload = function() { // Se ejecuta automáticamente cuando la página termina de cargar
  const comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || []; // Obtiene los comentarios guardados en localStorage o un array vacío si no hay
  comentariosGuardados.forEach(c => mostrarComentario(c)); // Recorre cada comentario y lo muestra en pantalla
}

let pass = prompt("Introduce la contraseña para acceder al blog:");
const passwordCorrecta = "5432";

if (pass !== passwordCorrecta) {
    document.body.innerHTML = "<h1>Acceso denegado ❌</h1>";
} else {
    // Si la contraseña es correcta, reasigna el window.onload para asegurar que los comentarios carguen después del prompt.
    window.onload = function() {
        const comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
        comentariosGuardados.forEach(c => mostrarComentario(c));
    }
}

function agregarComentario() { // Función que se ejecuta al hacer clic en "Publicar comentario"
    const nombre = document.getElementById('nombre').value.trim(); // Obtiene el nombre del input y elimina espacios extra
    const mensaje = document.getElementById('mensaje').value.trim(); // Obtiene el mensaje del textarea y elimina espacios extra
    const imagenInput = document.getElementById('imagen'); // Obtiene el input de tipo archivo (para imagen)

    // 1. Validación de campos vacíos
    if (!nombre || !mensaje) {
      alert('Por favor escribe tu nombre y comentario.'); // Muestra alerta si falta información
      return; // Detiene la ejecución de la función
    }

    // 2. 🔑 VALIDACIÓN: Nombre debe tener mínimo 3 caracteres
    if (nombre.length < 3) {
        alert('El nombre debe tener al menos 3 caracteres.');
        return; 
    }

    // 3. 🔑 VALIDACIÓN: Mensaje debe tener máximo 200 caracteres
    if (mensaje.length > 200) {
        alert('El mensaje no puede exceder los 200 caracteres.');
        return; 
    }

    const fecha = new Date(); // Crea un objeto con la fecha y hora actual
    const fechaTexto = fecha.toLocaleString(); // Convierte la fecha a un formato legible
    let imagenData = null; // Variable que almacenará la imagen en formato base64 (si existe)

    if (imagenInput.files && imagenInput.files[0]) { // Verifica si se seleccionó un archivo de imagen
      const lector = new FileReader(); // Crea un lector de archivos
      lector.onload = function(e) { // Evento que se ejecuta cuando la imagen termina de cargarse
        imagenData = e.target.result; // Guarda la imagen como cadena base64
        guardarYMostrar({ nombre, mensaje, fechaTexto, imagenData }); // Llama a la función para guardar y mostrar el comentario
      }
      lector.readAsDataURL(imagenInput.files[0]); // Convierte la imagen seleccionada a base64
    } else {
      guardarYMostrar({ nombre, mensaje, fechaTexto, imagenData }); // Si no hay imagen, guarda y muestra solo el texto
    }

    // Limpia los campos del formulario después de publicar
    document.getElementById('nombre').value = '';
    document.getElementById('mensaje').value = '';
    imagenInput.value = '';
}

function guardarYMostrar(comentario) { // Función que guarda el comentario en localStorage y lo muestra
    const comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || []; // Obtiene los comentarios previos
    comentariosGuardados.push(comentario); // Agrega el nuevo comentario al array
    localStorage.setItem('comentarios', JSON.stringify(comentariosGuardados)); // Guarda el array actualizado en localStorage
    mostrarComentario(comentario); // Muestra el comentario en la página
}

function mostrarComentario({ nombre, mensaje, fechaTexto, imagenData }) { // Función que pinta un comentario en el HTML
    const comentariosDiv = document.getElementById('comentarios'); // Obtiene la sección de comentarios
    const comentarioDiv = document.createElement('div'); // Crea un contenedor <div> para el comentario
    comentarioDiv.classList.add('comment'); // Agrega una clase CSS al div

    // Inserta el contenido del comentario (nombre, mensaje y fecha)
    comentarioDiv.innerHTML = `
      <strong>${nombre}</strong>
      <p>${mensaje}</p>
      <small>${fechaTexto}</small>
    `;

    if (imagenData) { // Si el comentario incluye una imagen
      const img = document.createElement('img'); // Crea un elemento <img>
      img.src = imagenData; // Le asigna la imagen en base64 como fuente
      comentarioDiv.appendChild(img); // Inserta la imagen dentro del div del comentario
    }

    comentariosDiv.appendChild(comentarioDiv); // Agrega el comentario completo dentro de la sección de comentarios
}

function borrarComentarios() { // Función para borrar todos los comentarios
    if (confirm("¿Estás seguro de borrar todos los comentarios?")) { // Pide confirmación al
