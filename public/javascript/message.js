async function dMsgFormHandler(event) {
    event.stopImmediatePropagation();

    const receiver_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    const content = document.querySelector('textarea[name="message-body"]').value;

    const response = await fetch(`/api/messages/new/0`, {
        method: 'post',
        body: JSON.stringify({
            content,
            receiver_id
        }),
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
async function msgFormHandler(event) {
    event.stopImmediatePropagation();

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
        document.location.replace('/post/' + post_id);
    } else {
        alert(response.statusText);
    }
}

async function replyFormHandler(event) {
    event.stopImmediatePropagation();
    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    const chain_id = event.target.getAttribute("data-form");
    const content = document.querySelector('textarea[id="message' + chain_id + '-body"]').value;

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
        if (post_id == 'dashboard') document.location.replace('/user/' + post_id);
        else document.location.replace('/post/' + post_id);
    } else {
        alert(response.statusText);
    }
}

const delConvoHandler = async(event) => {
    const chain_id = event.target.getAttribute("data-val");
    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    const response = await fetch(`/api/messages/chain`, {
        method: 'delete',
        body: JSON.stringify({
            chain_id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        if (post_id == 'dashboard') document.location.replace('/user/' + post_id);
        else document.location.replace('/post/' + post_id);
    } else {
        alert(response.statusText);
    }
}

const showReplyForm = (event) => {
    const chain_id = event.target.getAttribute("data-val");
    document.getElementById("reply-box" + chain_id).style.display = document.getElementById("reply-box" + chain_id).style.display == 'block' ? 'none' : 'block';
}

if (document.querySelector('.message-form'))
    document.querySelector('.message-form').addEventListener('submit', msgFormHandler);

if (document.querySelector('.dmessage-form'))
    document.querySelector('.dmessage-form').addEventListener('submit', dMsgFormHandler);

Array.from(document.getElementsByClassName("respond")).forEach(function(element) {
    element.addEventListener('click', showReplyForm);
});

Array.from(document.getElementsByClassName('reply-message-btn')).forEach(function(element) {
    element.addEventListener('click', replyFormHandler);
});

Array.from(document.getElementsByClassName('delete-convo')).forEach(function(element) {
    element.addEventListener('click', delConvoHandler);
});