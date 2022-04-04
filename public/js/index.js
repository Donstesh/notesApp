let notes = document.querySelectorAll('.note');

notes.forEach(note => {
    note.addEventListener('click', function(e){
        //e.preventDefault();
        //let note = e.target.firstElementChild;

        location.href = note.firstElementChild.href
        //console.log(note.href);

    });
})