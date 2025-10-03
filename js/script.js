// 🔑 Contraseña
const pass = prompt("Introduce la contraseña para acceder al blog:");
const passwordCorrecta = "5432";

if (pass !== passwordCorrecta) {
  document.body.innerHTML = "<h1>Acceso denegado ❌</h1>";
} else {
  // Cargar comentarios guardados al iniciar
  window.addEventListener("load", () => {
    const comentariosGuardados = JSON.parse(localStorage.getItem("comentarios")) || [];
    comentariosGuardados.forEach(c => mostrarComentario(c));
  });
}

// 📌 Agregar comentario
function agregarComentario() {
  const nombre = document.getElementById("nombre").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();
  const imagenInput = document.getElementById("imagen");

  if (!nombre || !mensaje) {
    alert("Por favor escribe tu nombre y comentario.");
    return;
  }
  if (nombre.length < 3) {
    alert("El nombre debe tener al menos 3 caracteres.");
    return;
  }
  if (mensaje.length > 200) {
    alert("El mensaje no puede exceder los 200 caracteres.");
    return;
  }

  const fechaTexto = new Date().toLocaleString();
  let imagenData = null;

  const comentario = {
    id: Date.now() + "-" + Math.floor(Math.random() * 1000), // ID único
    nombre,
    mensaje,
    fechaTexto,
    imagenData
  };

  if (imagenInput.files && imagenInput.files[0]) {
    const lector = new FileReader();
    lector.onload = function (e) {
      comentario.imagenData = e.target.result;
      guardarYMostrar(comentario);
    };
    lector.readAsDataURL(imagenInput.files[0]);
  } else {
    guardarYMostrar(comentario);
  }

  document.getElementById("nombre").value = "";
  document.getElementById("mensaje").value = "";
  imagenInput.value = "";
}

// 📌 Guardar en localStorage y mostrar
function guardarYMostrar(comentario) {
  const comentariosGuardados = JSON.parse(localStorage.getItem("comentarios")) || [];
  comentariosGuardados.push(comentario);
  localStorage.setItem("comentarios", JSON.stringify(comentariosGuardados));
  mostrarComentario(comentario);
}

// 📌 Mostrar un comentario en pantalla
function mostrarComentario({ id, nombre, mensaje, fechaTexto, imagenData }) {
  const comentariosDiv = document.getElementById("comentarios");
  const comentarioDiv = document.createElement("div");
  comentarioDiv.classList.add("comment");

  comentarioDiv.innerHTML = `
    <strong>${nombre}</strong>
    <p>${mensaje}</p>
    <small>${fechaTexto}</small>
  `;

  if (imagenData) {
    const img = document.createElement("img");
    img.src = imagenData;
    comentarioDiv.appendChild(img);
  }

  // 👍 Botón "Me gusta"
  const likeBtn = document.createElement("button");
  likeBtn.textContent = "👍 Me gusta";
  likeBtn.style.marginRight = "8px";

  const likeCount = document.createElement("span");
  likeCount.id = `likes-${id}`;

  const likesGuardados = JSON.parse(localStorage.getItem("likes")) || {};
  likeCount.textContent = likesGuardados[id] || 0;

  likeBtn.onclick = function () {
    let likes = JSON.parse(localStorage.getItem("likes")) || {};
    let userLiked = localStorage.getItem(`liked-${id}`) === "true";

    if (!likes[id]) likes[id] = 0;

    if (userLiked) {
      likes[id]--;
      localStorage.setItem(`liked-${id}`, "false");
    } else {
      likes[id]++;
      localStorage.setItem(`liked-${id}`, "true");
    }

    localStorage.setItem("likes", JSON.stringify(likes));
    likeCount.textContent = likes[id];
  };

  comentarioDiv.appendChild(likeBtn);
  comentarioDiv.appendChild(likeCount);

  comentariosDiv.appendChild(comentarioDiv);
}

// 📌 Borrar todos los comentarios
function borrarComentarios() {
  if (confirm("¿Estás seguro de borrar todos los comentarios?")) {
    localStorage.removeItem("comentarios");
    localStorage.removeItem("likes");
    document.getElementById("comentarios").innerHTML = "<h3>Comentarios</h3>";
  }
}

