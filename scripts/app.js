// dom queries
const noteList = document.querySelector('.note-list');
const newNoteForm = document.querySelector('.new-note');
const search = document.querySelector('#search');

const addNote = (note, id) => {
    const when = dateFns.distanceInWordsToNow(
        note.created_at.toDate(),
        { addSuffix: true }
    );
    let html = `
     <li class="jumbotron" data-id="${id}">
         <h4 class="list-title search">${note.title}</h4>
         <div class="time">${when}</div>
         <p class="list-body">${note.body}</p>
         <button class="btn btn-success btn-sm my-2" value="edit">edit</button>    
         <button class="btn btn-danger btn-sm my-2" value="delete">delete</button>
     </li>
    `;

    if(note.important == true){
        noteList.innerHTML += html;
    }
    else{
        console.log(note.title + " is not an important note")
    }
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
    if(e.target.value === 'delete'){
        const id = e.target.parentElement.getAttribute('data-id');
        db.collection('notes').doc(id).delete().then(() => {
            console.log('note deleted');
        });
    }
});

// edit a note


// search
search.addEventListener("keyup", () => {
    let filter = search.value.toUpperCase();
    let lis = document.querySelectorAll('.search');

    lis.forEach((name)=>{
        if (name.innerText.toUpperCase().indexOf(filter) >= 0) {
           
            name.parentElement.style.display = 'list-item'; 
        } else{
            name.parentElement.style.display = 'none'; 
        }    
    })
})