const form = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const searchInput = document.querySelector("#search-input");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

let notes = [];

function render() {
    notesList.innerHTML = "";

    notes.forEach((note) => {
        const li = document.createElement("li");
        li.classList.add("note", `category-${note.category}`);
        
        const text = document.createElement("p");
        text.classList.add("note-text");
        text.textContent = note.text;
        
        const category = document.createElement("span");
        category.classList.add("category-label");
        category.textContent = note.category;

        const date = document.createElement("p");
        date.classList.add("note-date");
        date.textContent = note.createdAt;

        li.appendChild(text);
        li.appendChild(category);
        li.appendChild(date);

        notesList.appendChild(li);
        
    });
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    const note = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString(),
    };

    notes.push(note);
    render();
    noteInput.value = "";

});

render();