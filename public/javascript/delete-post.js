async function deleteFormHandler(event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    const post_id = event.target.getAttribute("data-val") || window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    const response = await fetch('/api/posts/' + post_id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/user/dashboard');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.delete-post-btn').addEventListener('click', deleteFormHandler);