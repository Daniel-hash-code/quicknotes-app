const form = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const searchInput = document.querySelector("#search-input");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const clearAllButton = document.querySelector("#clear-all-notes-button");

const NOTES_KEY = "quicknotes-notes";
const MAX_LENGTH = 200;

function loadNotes() {
    const savedNotes = localStorage.getItem(NOTES_KEY);
    if (!savedNotes) {
        return [];
    }
    try {      
        return JSON.parse(savedNotes);
    } catch (error) {
        console.error("Saved notes could not be loaded. Starting fresh...", error);
        return [];
    }
}

let notes = loadNotes();

function saveNotes() {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function createNoteElement(note) {
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

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");

    deleteButton.addEventListener("click", () => {
        deleteNote(note.id);
    });

    li.appendChild(text);
    li.appendChild(category);
    li.appendChild(date);
    li.appendChild(deleteButton);

    return li;
}

function render() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const visibleNotes = notes.filter((note) => note.text.toLowerCase().includes(searchTerm));
    
    notesList.innerHTML = "";

    if (notes.length > 0 && visibleNotes.length === 0) {
        const message = document.createElement("li");
        message.textContent = "No notes match your search.";
        notesList.appendChild(message);  
    }

    visibleNotes.forEach((note) => {
        notesList.appendChild(createNoteElement(note));
    });

    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}

function deleteNote(id) {
    notes = notes.filter((note) => note.id !== id);
    saveNotes();
    render();
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    if (text.length > MAX_LENGTH) {
        errorMessage.textContent = `Notes must be ${MAX_LENGTH} characters or fewer.`;
        return;
    }

    const note = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString(),
    };

    notes.push(note);
    saveNotes();
    render();

    noteInput.value = "";
    errorMessage.textContent = "";
});

searchInput.addEventListener("input", render);

clearAllButton.addEventListener("click", () => {
    if (confirm("Delete all notes?")) {
        notes = [];
        saveNotes();
        render();
    }    
});

render();