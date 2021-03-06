async function editFormHandler(event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    const title = document.querySelector('input[name="post-title"]').value;
    const content = document.querySelector('textarea[name="post-content"]').value;

    const response = await fetch('/api/posts/' + post_id, {
        method: 'PUT',
        body: JSON.stringify({
            title,
            content
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/user/dashboard');
    } else {
        alert(response.message);
    }
}
async function soldFormHandler(event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    const response = await fetch('/api/posts/' + post_id, {
        method: 'PUT',
        body: JSON.stringify({
            sold: true
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/user/dashboard');
    } else {
        alert(response.message);
    }
}

document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);
document.querySelector('.sold-post-btn').addEventListener('click', soldFormHandler);