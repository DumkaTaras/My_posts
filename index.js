const API_URL = `http://localhost:3000/posts`;

const inpPost = document.getElementById('input');
const addButton = document.getElementById('addBtn');
const mainText_posts = document.getElementById('mainContent_post');
const sectionPosts = document.querySelector('.notes-list');

let updated = false;
let currentId = null;


document.addEventListener("DOMContentLoaded", getAllPosts);

addButton.addEventListener('click', () => {
    const titlePost = inpPost.value.trim();
    const textPost = mainText_posts.value.trim();

    if (!titlePost || !textPost) return;

    if (updated === false) {

        savePost(titlePost, textPost);
    } else {
        updatePost(currentId, titlePost, textPost);
        updated = false;
        currentId = null;
        addButton.textContent = "Додати";
    }

    inpPost.value = "";
    mainText_posts.value = "";
});

function savePost(title, text) {
    const newPost = { title, text };

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
    })
        .then(res => res.json())
        .then(data => renderPost(data))
        .catch(err => console.error("Помилка збереження:", err));
}

function getAllPosts() {
    fetch(API_URL)
        .then(res => res.json())
        .then(posts => {
            sectionPosts.innerHTML = "";
            posts.forEach(post => renderPost(post));
        })
        .catch(err => console.error("Помилка завантаження:", err));
}

function renderPost(post) {
    const savePost = document.createElement('div');
    savePost.classList.add('note-card');

    const headerText = document.createElement('h3');
    headerText.innerText = post.title;

    const maintext = document.createElement('p');
    maintext.innerText = post.text;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('deleteButton');
    deleteButton.textContent = "Видалити";

    const updateButton = document.createElement('button');
    updateButton.classList.add('updateButton');
    updateButton.textContent = "Виправити";

    deleteButton.addEventListener('click', () => deletePost(post.id));

    updateButton.addEventListener('click', () => {
        inpPost.value = post.title;
        mainText_posts.value = post.text;
        addButton.textContent = "Додати оновлений текст";
        updated = true;
        currentId = post.id;
    });

    savePost.append(headerText, maintext, deleteButton, updateButton);
    sectionPosts.append(savePost);
}

function deletePost(id) {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(() => getAllPosts())
        .catch(err => console.error("Помилка видалення:", err));
}

function updatePost(id, newTitle, newText) {
    const updatedPost = {
        title: newTitle,
        text: newText
    };

    fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost)
    })
        .then(res => res.json())
        .then(() => getAllPosts())
        .catch(err => console.error("Помилка оновлення:", err));
}