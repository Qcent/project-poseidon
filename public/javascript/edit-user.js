async function editFormHandler(event) {
    event.preventDefault();

    const user_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    const username = document.querySelector('#username-edit').value.trim();
    const email = document.querySelector('#email-edit').value.trim();
    const private = document.querySelector('#private-edit').checked || false;
    const password = document.querySelector('#password-edit').value.trim();
    const confirm = document.querySelector('#password-edit2').value.trim();
    const about = document.querySelector('#about-edit').value.trim();

    let updates;

    password !== '' ? updates = JSON.stringify({
        username,
        email,
        private,
        about,
        password
    }) : updates = JSON.stringify({
        username,
        email,
        private,
        about
    })


    if (password === confirm) {
        const response = await fetch('/api/users/' + user_id, {
            method: 'PUT',
            body: updates,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.replace('/');
        } else {
            alert(response.statusText);
        }
    } else {
        alert("Passwords Don't Match!")
    }
}

document.querySelector('.edit-form').addEventListener('submit', editFormHandler);