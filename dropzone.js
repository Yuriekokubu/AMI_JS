var dropzone = document.getElementById('dropzone');
var dropzone_input = dropzone.querySelector('.dropzone-input');
var multiple = dropzone_input.getAttribute('multiple') ? true : false;

['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (event) {
    dropzone.addEventListener(event, function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
});

dropzone.addEventListener('dragover', function (e) {
    this.classList.add('dropzone-dragging');
}, false);

dropzone.addEventListener('dragleave', function (e) {
    this.classList.remove('dropzone-dragging');
}, false);

dropzone.addEventListener('click', function (e) {
    dropzone_input.click();
});



