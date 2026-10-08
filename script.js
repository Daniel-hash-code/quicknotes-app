const form = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const searchInput = document.querySelector("#search-input");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const clearAllButton = document.querySelector("#clear-all-notes-button");

let notes = [];

const NOTES_KEY = "quicknotes-notes";

function saveNotes() {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function render(notesToDisplay = notes) {
    notesList.innerHTML = "";

    if (notesToDisplay.length ===0 && searchInput.value.trim() !== "") {
        const message = document.createElement("li");
        message.textContent = "No notes found matching your search.";
        notesList.appendChild(message);
        return;
    }

    notesToDisplay.forEach((note) => {
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

        notesList.appendChild(li);
        
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

    if (text.length > 200) {
        errorMessage.textContent = "Notes cannot be longer than 200 characters.";
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

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filteredNotes = notes.filter((note) => 
        note.text.toLowerCase().includes(searchTerm)
    );
    render(filteredNotes);
});

clearAllButton.addEventListener("click", () => {
    if(confirm("Delete all notes?")) {
        notes = [];
        saveNotes();
        render();
    }    
});

const savedNotes = localStorage.getItem(NOTES_KEY);
if (savedNotes) {
    notes = JSON.parse(savedNotes);
}

render();