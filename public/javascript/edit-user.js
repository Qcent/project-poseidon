async function editFormHandler(event) {
    event.stopImmediatePropagation();
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
    let avatar = '';
    Array.from(document.querySelectorAll('input[name="avatar"]')).forEach(function(element) {
        if (element.checked == true) avatar = element.value;
    });

    let updates;

    password !== '' ? updates = JSON.stringify({
        username,
        email,
        private,
        about,
        avatar,
        password
    }) : updates = JSON.stringify({
        username,
        email,
        private,
        about,
        avatar
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
            document.location.replace('/user/dashboard');
        } else {
            alert(response.statusText);
        }
    } else {
        alert("Passwords Don't Match!")
    }
}

document.querySelector('.edit-form').addEventListener('submit', editFormHandler);

avatarUpdateHandler = event => {

    Array.from(document.querySelectorAll('input[name="avatar"]')).forEach(function(element) {
        if (document.querySelector('label[for="' + element.id + '"] img').classList)
            document.querySelector('label[for="' + element.id + '"] img').classList.remove("fancy-button");
    });

    document.querySelector('label[for="' + event.target.id + '"] img').classList.add("fancy-button");

}

Array.from(document.querySelectorAll('input[name="avatar"]')).forEach(function(element) {
    element.addEventListener('click', avatarUpdateHandler);
});
const userAvatar = document.querySelector('#userAvatar').value;
Array.from(document.querySelectorAll('#avatarSelect label')).forEach(function(element) {
    if (document.getElementById(element.getAttribute("for")).value == userAvatar) {
        element.querySelector('img').classList.add("fancy-button");
    }
});