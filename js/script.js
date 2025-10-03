// Variable global para almacenar el estado de acceso
let accesoConcedido = false;

// 1. Lógica de Acceso y Carga Inicial
// Se ejecuta inmediatamente al cargar el script.
(function iniciarBlog() {
    let pass = prompt("Introduce la contraseña para acceder al blog:");
    const passwordCorrecta = "5432";

    if (pass !== passwordCorrecta) {
        // Acceso Denegado: Limpia el cuerpo de la página
        document.body.innerHTML = "<h1>Acceso denegado ❌</h1>";
    } else {
        // Acceso Concedido: Establece el estado y continúa
        accesoConcedido = true;
        
        // Usamos addEventListener para cargar los comentarios SOLO cuando el HTML esté listo.
        document.addEventListener('DOMContentLoaded', function() {
            const comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
            comentariosGuardados.forEach(c => mostrarComentario(c));
        });
    }
})(); // Función autoejecutable para iniciar el prompt inmediatamente.


// ----------------------------------------------------------------------------------
// Función principal para agregar comentario
// ----------------------------------------------------------------------------------
function agregarComentario() {
    // Si el acceso fue denegado, detenemos la función aquí
    if (!accesoConcedido) {
        alert("Acceso no autorizado para publicar.");
        return;
    }

    const nombre = document.getElementById('nombre').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    const imagenInput = document.getElementById('imagen');

    // 1. Validación de campos vacíos
    if (!nombre || !mensaje) {
      alert('Por favor escribe tu nombre y comentario.');
      return;
    }

    // 2. VALIDACIÓN: Nombre mínimo 3 caracteres
    if (nombre.length < 3) {
        alert('El nombre debe tener al menos 3 caracteres.');
        return; 
    }

    // 3. VALIDACIÓN: Mensaje máximo 200 caracteres
    if (mensaje.length > 200) {
        alert('El mensaje no puede exceder los 200 caracteres.');
        return; 
    }

    const fecha = new Date();
    const fechaTexto = fecha.toLocaleString();
    let imagenData = null;
    
    // Genera un ID único para el comentario (Timestamp + Random)
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2); 

    if (imagenInput.files && imagenInput.files[0]) {
      const lector = new FileReader();
      lector.onload = function(e) {
        imagenData = e.target.result;
        // El nuevo comentario incluye el 'id' y 'likes: 0'
        guardarYMostrar({ id, nombre, mensaje, fechaTexto, imagenData, likes: 0 }); 
      }
      lector.readAsDataURL(imagenInput.files[0]);
    } else {
      // El nuevo comentario incluye el 'id' y 'likes: 0'
      guardarYMostrar({ id, nombre, mensaje, fechaTexto, imagenData, likes: 0 }); 
    }

    // Limpia los campos del formulario
    document.getElementById('nombre').value = '';
    document.getElementById('mensaje').value = '';
    imagenInput.value = '';
}

// ----------------------------------------------------------------------------------
// Función para guardar y mostrar el comentario
// ----------------------------------------------------------------------------------
function guardarYMostrar(comentario) {
    const comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
    comentariosGuardados.push(comentario);
    localStorage.setItem('comentarios', JSON.stringify(comentariosGuardados));
    mostrarComentario(comentario);
}

// ----------------------------------------------------------------------------------
// Función para pintar el comentario en el HTML
// ----------------------------------------------------------------------------------
function mostrarComentario({ id, nombre, mensaje, fechaTexto, imagenData, likes }) { 
    const comentariosDiv = document.getElementById('comentarios');
    // Aseguramos que 'comentariosDiv' exista antes de manipularlo
    if (!comentariosDiv) return; 

    const comentarioDiv = document.createElement('div');
    comentarioDiv.classList.add('comment');
    comentarioDiv.setAttribute('data-id', id); // Asigna el ID al elemento HTML

    // Inserta el contenido y el nuevo botón de "Me Gusta"
    comentarioDiv.innerHTML = `
      <strong>${nombre}</strong>
      <p>${mensaje}</p>
      <small>${fechaTexto}</small>
      <div class="actions">
        <button onclick="darLike('${id}')" class="like-btn">👍 Me gusta (<span id="likes-count-${id}">${likes}</span>)</button>
      </div>
    `;

    if (imagenData) {
      const img = document.createElement('img');
      img.src = imagenData;
      comentarioDiv.insertBefore(img, comentarioDiv.querySelector('.actions'));
    }

    comentariosDiv.appendChild(comentarioDiv);
}

// ----------------------------------------------------------------------------------
// Función: Maneja el clic en "Me Gusta"
// ----------------------------------------------------------------------------------
function darLike(idComentario) {
    let comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
    
    // Busca el índice del comentario
    const indice = comentariosGuardados.findIndex(c => c.id === idComentario);

    if (indice !== -1) {
        // Incrementa el contador de likes y actualiza LocalStorage (Persistencia)
        comentariosGuardados[indice].likes = (comentariosGuardados[indice].likes || 0) + 1;
        localStorage.setItem('comentarios', JSON.stringify(comentariosGuardados));

        // Actualiza la vista
        const likesSpan = document.getElementById(`likes-count-${idComentario}`);
        if (likesSpan) {
            likesSpan.textContent = comentariosGuardados[indice].likes;
        }
    }
}

// ----------------------------------------------------------------------------------
// Función para borrar todos los comentarios
// ----------------------------------------------------------------------------------
function borrarComentarios() {
    if (confirm("¿Estás seguro de borrar todos los comentarios?")) {
      localStorage.removeItem('comentarios');
