// Variables globales
const uploadForm = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const usernameInput = document.getElementById("username");
const galleryGrid = document.getElementById("galleryGrid");

// Cargar videos previamente guardados en localStorage
window.onload = () => {
    const savedItems = JSON.parse(localStorage.getItem('galleryItems')) || [];
    savedItems.forEach(item => {
        createGalleryItem(item.file, item.username);
    });
};

// Función para crear un elemento en la galería
function createGalleryItem(file, username) {
    const galleryItem = document.createElement("div");
    galleryItem.classList.add("gallery-item");

    const content = document.createElement("div");
    if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        content.appendChild(img);
    } else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.controls = true;
        content.appendChild(video);
    }

    const info = document.createElement("div");
    info.classList.add("info");
    info.innerHTML = `Publicado por: <b>${username}</b> (${new Date().toLocaleString()})`;

    const commentSection = document.createElement("div");
    commentSection.classList.add("comment-section");

    const commentForm = document.createElement("form");
    commentForm.innerHTML = `
        <input type="text" placeholder="Escribe un comentario" required>
        <button type="submit">Comentar</button>
    `;
    commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const commentText = e.target.querySelector("input").value;
        const comment = document.createElement("div");
        comment.classList.add("comment");
        comment.innerHTML = `<b>${username}</b>: ${commentText} 
                             <br><small>${new Date().toLocaleString()}</small>`;
        commentSection.appendChild(comment);
        e.target.reset();
    });

    const reactions = document.createElement("div");
    reactions.classList.add("reactions");

    // Reacciones: solo se puede reaccionar una vez por persona
    const reactionsData = ["👍", "❤️", "😂"];
    reactionsData.forEach((emoji) => {
        const reaction = document.createElement("span");
        reaction.classList.add("reaction");
        reaction.textContent = emoji;
        reaction.dataset.reaction = emoji;
        reaction.addEventListener("click", (e) => handleReaction(e, username));
        reactions.appendChild(reaction);
    });

    galleryItem.appendChild(content);
    galleryItem.appendChild(info);
    galleryItem.appendChild(commentSection);
    galleryItem.appendChild(commentForm);
    galleryItem.appendChild(reactions);

    galleryGrid.appendChild(galleryItem);

    // Guardar en localStorage
    saveGalleryItem(file, username);
}

// Función para manejar las reacciones
function handleReaction(event, username) {
    const reaction = event.target.dataset.reaction;

    // Verificar si el usuario ya reaccionó
    if (event.target.classList.contains("reacted")) {
        alert("Ya has reaccionado a este contenido.");
        return;
    }

    const reactionItem = document.createElement("li");
    reactionItem.classList.add("reaction-item");
    reactionItem.innerHTML = `<span class="reaction-username">${username}</span><span>${reaction}</span>`;
    const commentSection = event.target.closest(".gallery-item").querySelector(".comment-section");
    commentSection.appendChild(reactionItem);

    // Marcar como reaccionado
    event.target.classList.add("reacted");
    event.target.style.pointerEvents = "none";  // Deshabilitar la reacción
}

// Subir contenido
uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const file = fileInput.files[0];
    const username = usernameInput.value.trim();
    if (file && username) {
        createGalleryItem(file, username);
        uploadForm.reset();
    } else {
        alert("Por favor, completa todos los campos.");
    }
});

// Guardar el item en localStorage
function saveGalleryItem(file, username) {
    const galleryItems = JSON.parse(localStorage.getItem('galleryItems')) || [];
    galleryItems.push({ file, username });
    localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
}
