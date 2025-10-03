// Cargar comentarios almacenados al iniciar
window.onload = function() {
  const comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
  comentariosGuardados.forEach(c => mostrarComentario(c));
}

let pass = prompt("Introduce la contraseña para acceder al blog:");
const passwordCorrecta = "5432";

if (pass !== passwordCorrecta) {
    document.body.innerHTML = "<h1>Acceso denegado ❌</h1>";
} else {
    window.onload = function() {
        const comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
        comentariosGuardados.forEach(c => mostrarComentario(c));
    }
}

function agregarComentario() {
  const nombre = document.getElementById('nombre').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();
  const imagenInput = document.getElementById('imagen');

  if (!nombre || !mensaje) {
    alert('Por favor escribe tu nombre y comentario.');
    return;
  }

  if (nombre.length < 3) {
    alert('El nombre debe tener al menos 3 caracteres.');
    return;
  }

  if (mensaje.length > 200) {
    alert('El mensaje no puede exceder los 200 caracteres.');
    return;
  }

  const fecha = new Date();
  const fechaTexto = fecha.toLocaleString();
  let imagenData = null;

  if (imagenInput.files && imagenInput.files[0]) {
    const lector = new FileReader();
    lector.onload = function(e) {
      imagenData = e.target.result;
      guardarYMostrar({ nombre, mensaje, fechaTexto, imagenData });
    }
    lector.readAsDataURL(imagenInput.files[0]);
  } else {
    guardarYMostrar({ nombre, mensaje, fechaTexto, imagenData });
  }

  document.getElementById('nombre').value = '';
  document.getElementById('mensaje').value = '';
  imagenInput.value = '';
}

function guardarYMostrar(comentario) {
  const comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
  comentariosGuardados.push(comentario);
  localStorage.setItem('comentarios', JSON.stringify(comentariosGuardados));
  mostrarComentario(comentario);
}

function mostrarComentario({ nombre, mensaje, fechaTexto, imagenData }) {
  const comentariosDiv = document.getElementById('comentarios');
  const comentarioDiv = document.createElement('div');
  comentarioDiv.classList.add('comment');

  comentarioDiv.innerHTML = `
    <strong>${nombre}</strong>
    <p>${mensaje}</p>
    <small>${fechaTexto}</small>
  `;

  if (imagenData) {
    const img = document.createElement('img');
    img.src = imagenData;
    comentarioDiv.appendChild(img);
  }

  comentariosDiv.appendChild(comentarioDiv);
}

function borrarComentarios() {
  if (confirm("¿Estás seguro de borrar todos los comentarios?")) {
    localStorage.removeItem('comentarios');
    document.getElementById('comentarios').innerHTML = '<h3>Comentarios</h3>';
  }
}


