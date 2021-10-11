// dom queries
const noteList = document.querySelector('.note-list');
const newNoteForm = document.querySelector('.new-note');
const noteWindow = document.querySelector('.note-window');

const addNote = (note, id) => {
    const when = dateFns.distanceInWordsToNow(
        note.created_at.toDate(),
        { addSuffix: true }
    );    
    let html = `
     <li data-id="${id}">
         <div class="list-title">${note.title}</div>
         <div class="time">${when}</div>
         <button class="btn btn-danger btn-sm my-2">delete</button>
     </li>
    `;
    noteList.innerHTML += html;
}

const deleteNote = (id) => {
    const notes = document.querySelectorAll('li');
    notes.forEach(note => {
        if(note.getAttribute('data-id') === id){
            note.remove();
        }
    });
}

const viewNote = (note) => {
    let time = note.created_at.toDate();
    let html = `
     <h3 class="view-title">${note.title}</h3>
     <p class="time">${time}</p>
     <p class="view-body">${note.body}</p>
     <button class="btn btn-secondary btn-sm my-2">edit</button>
    `;
    noteWindow = html;
}

// get documents
// real time listener through onSnapshot
// figure out a way to show only those with important == true
const unsub = db.collection('notes').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        const doc = change.doc;
        if(change.type === 'added'){
            addNote(doc.data(), doc.id);
        } else if (change.type === 'removed'){
            deleteNote(doc.id);
        }
    })
});

// add a note
newNoteForm.addEventListener('submit', e => {
    e.preventDefault();
    const now = new Date();
    const vin = newNoteForm.newImportant.checked;
    const note = {
        title: newNoteForm.newTitle.value,
        created_at: firebase.firestore.Timestamp.fromDate(now),
        body: newNoteForm.newBody.value,
        important: vin ? true : false
    };

    db.collection('notes').add(note).then(() => {
        console.log('note added');
        newNoteForm.reset();
    }).catch(err => {
        console.log(err);
    });
});

// View a note
noteList.addEventListener('click', e => {
    if(e.target.className === 'list-title'){
        const id = e.target.parentElement.getAttribute('data-id');
        console.log(id);
        // clear the view window
        // Find which doc id corresponds to the id and run viewNote
    }
})

// Delete a note
noteList.addEventListener('click', e => {
    if(e.target.tagName === 'BUTTON'){
        const id = e.target.parentElement.getAttribute('data-id');
        db.collection('notes').doc(id).delete().then(() => {
            console.log('note deleted');
        });
    }
});