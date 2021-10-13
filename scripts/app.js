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
     <li class="jumbotron" data-id="${id}">
         <h3 class="list-title search">${note.title}</h3>
         <div class="time">${when}</div>
         <p class="list-body">${note.body}</p>
         <button class="btn btn-secondary btn-sm my-2">edit</button>    
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

// Delete a note
noteList.addEventListener('click', e => {
    if(e.target.tagName === 'BUTTON'){
        const id = e.target.parentElement.getAttribute('data-id');
        db.collection('notes').doc(id).delete().then(() => {
            console.log('note deleted');
        });
    }
});