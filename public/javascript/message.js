async function msgFormHandler(event) {
    event.preventDefault();

    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    const content = document.querySelector('textarea[name="message-body"]').value;

    const response = await fetch(`/api/messages`, {
        method: 'post',
        body: JSON.stringify({
            content,
            post_id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
       document.location.replace('/post/'+post_id);
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.message-form').addEventListener('submit', msgFormHandler);