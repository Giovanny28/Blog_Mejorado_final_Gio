<script>
// Cargar comentarios almacenados al iniciar
window.onload = function() {
  const comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
  comentariosGuardados.forEach((c, index) => mostrarComentario(c, index));
}

let pass = prompt("Introduce la contraseña para acceder al blog:");
const passwordCorrecta = "5432";

if (pass !== passwordCorrecta) {
    document.body.innerHTML = "<h1>Acceso denegado ❌</h1>";
} else {
    window.onload = function() {
        const comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
        comentariosGuardados.forEach((c, index) => mostrarComentario(c, index));
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
  mostrarComentario(comentario, comentariosGuardados.length - 1);
}

function mostrarComentario({ nombre, mensaje, fechaTexto, imagenData }, index) {
  const comentariosDiv = document.getElementById('comentarios');
  const comentarioDiv = document.createElement('div');
  comentarioDiv.classList.add('comment');

  // Crear contenido base
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

  // ----- Botón de "Me gusta" -----
  const likeBtn = document.createElement('button');
  likeBtn.textContent = "👍 Me gusta";
  likeBtn.style.marginRight = "8px";

  const likeCount = document.createElement('span');
  likeCount.id = `likes-${index}`;

  // Obtener likes guardados de localStorage
  const likesGuardados = JSON.parse(localStorage.getItem('likes')) || {};
  likeCount.textContent = likesGuardados[index] || 0;

  likeBtn.onclick = function() {
    let likes = JSON.parse(localStorage.getItem('likes')) || {};
    if (!likes[index]) likes[index] = 0;

    // Toggle: si ya tiene "mi like", lo quito, si no, lo pongo
    const userLiked = localStorage.getItem(`liked-${index}`) === "true";

    if (userLiked) {
      likes[index]--;
      localStorage.setItem(`liked-${index}`, "false");
    } else {
      likes[index]++;
      localStorage.setItem(`liked-${index}`, "true");
    }

    localStorage.setItem('likes', JSON.stringify(likes));
    likeCount.textContent = likes[index];
  };

  comentarioDiv.appendChild(likeBtn);
  comentarioDiv.appendChild(likeCount);
  // -------------------------------

  comentariosDiv.appendChild(comentarioDiv);
}

function borrarComentarios() {
  if (confirm("¿Estás seguro de borrar todos los comentarios?")) {
    localStorage.removeItem('comentarios');
    localStorage.removeItem('likes'); 
    document.getElementById('comentarios').innerHTML = '<h3>Comentarios</h3>';
  }
}
</script>

