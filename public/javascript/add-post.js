async function newFormHandler(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="post-title"]').value;
    const content = document.querySelector('textarea[name="post-content"]').value;
    const user_id = document.querySelector('input[name="user-id"]').value;
    const category_id = document.querySelector('#post-category').value;

    alert(category_id)
    const response = await fetch(`/api/newPost`, {
        method: 'POST',
        body: JSON.stringify({
            title,
            content,
            user_id,
            category_id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);