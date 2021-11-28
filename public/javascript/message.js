async function msgFormHandler(event) {
    event.preventDefault();

    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    const content = document.querySelector('textarea[name="message-body"]').value;

    const response = await fetch(`/api/messages/new/${post_id}`, {
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

async function replyFormHandler(event) {
    event.preventDefault();

   
    const chain_id = event.target.getAttribute("data-form");
    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    const content = document.querySelector('textarea[id="message'+chain_id+'-body"]').value;
    
    const response = await fetch(`/api/messages`, {
        method: 'post',
        body: JSON.stringify({
            content,
            chain_id
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

const showReplyForm = (event) =>{
    alert("CODE ME")
}

if(document.querySelector('.message-form'))
document.querySelector('.message-form').addEventListener('submit', msgFormHandler);

Array.from(document.getElementsByClassName("respond")).forEach(function(element) {
    element.addEventListener('click', showReplyForm);
});

Array.from(document.getElementsByClassName('reply-message-btn')).forEach(function(element) {
    element.addEventListener('click', replyFormHandler);
});