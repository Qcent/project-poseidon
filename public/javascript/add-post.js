async function newFormHandler(event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    var form = document.getElementById('new-post-form'); // give the form an ID
    var xhr = new XMLHttpRequest(); // create XMLHttpRequest
    var data = new FormData(form); // create formData object

    xhr.onload = function() {
        const response = JSON.parse(this.responseText);
        if (response.ok) {
            document.location.replace('/user/dashboard');
        } else {
            alert(response.errors[0].message);
        }
    }

    xhr.open("post", form.action); // open connection
    xhr.send(data); // send data
}

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);

window.addEventListener('load', function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            var img = document.querySelector('#uploadedImg');
            img.onload = () => {
                URL.revokeObjectURL(img.src); // no longer needed, free memory
            }

            img.src = URL.createObjectURL(this.files[0]); // set src to blob url
        }
    });
});