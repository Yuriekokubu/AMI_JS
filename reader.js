document.getElementById('inputfile')
    .addEventListener('change', function () {

        var fr = new FileReader();
        fr.onload = function () {
            const firstLine = fr.result
            document.getElementById('output')
                .textContent = firstLine;
        }

        fr.readAsText(this.files[0]);
    })

