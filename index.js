const API_URL = 'https://crudcrud.com/api/8f4eddef309949f998f92e205908748a/addnote';
let totalNotes = 0;
let showingCount = 0;
const searchInput = document.getElementById('searchNote');
const notesList = document.getElementById('addnotee');

document.addEventListener('DOMContentLoaded', fetchNotes);
searchInput.addEventListener('keyup', filterNotes);

async function fetchNotes() {
    try {
        const response = await axios.get(API_URL);
        const notes = response.data;
        notes.forEach(note => {
            displayNoteOnScreen(note);
            totalNotes++;
        });
        updateShowingCount(0);
    } catch (error) {
        console.error('Error fetching notes:', error);
    }
}

async function addNote(event) {
    event.preventDefault();
    const note = {
        NoteTitle: event.target.NoteTitle.value,
        NoteDesc: event.target.NoteDesc.value,
    };

    try {
        const response = await axios.post(API_URL, note);
        displayNoteOnScreen(response.data);
        updateShowingCount(1);
        event.target.reset();
    } catch (error) {
        console.log('Error adding note:', error);
    }
}

function displayNoteOnScreen(note) {
    const userItem = document.createElement('li');
    userItem.innerHTML = `
        <h2>${note.NoteTitle}</h2>
        <p>${note.NoteDesc}</p>
        <button>Delete</button>
    `;

    notesList.appendChild(userItem);

    userItem.querySelector('button').addEventListener('click', async () => {
        try {
            await axios.delete(`${API_URL}/${note._id}`);
            userItem.remove();
            updateShowingCount(-1);
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    });
}

function updateShowingCount(change) {
    totalNotes += change;
    showingCount = totalNotes; 
    document.getElementById('totalNotes').textContent = `Total notes: ${totalNotes}`;
    document.getElementById('showingNotes').textContent = `Showing: ${showingCount}`;
}

function filterNotes() {
    const searchTerm = searchInput.value.toLowerCase();
    const notes = notesList.querySelectorAll('li');
    showingCount = 0;

    notes.forEach(note => {
        const noteTitle = note.querySelector('h2').textContent.toLowerCase();
        if (noteTitle.includes(searchTerm)) {
            note.style.display = 'block';
            showingCount++;
        } else {
            note.style.display = 'none';
        }
    });
    document.getElementById('showingNotes').textContent = `Showing: ${showingCount}`;
}
