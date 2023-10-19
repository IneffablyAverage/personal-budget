
const postContent = `
<form id="new-envelope" action="http://localhost:3000/envelopes/" method="POST">
                
    <label for="name">Name</label>
    <input type="text" name="name" required> <br>

    <label for="balance">Balance</label>
    <input type="number" name="balance" required> <br>

    <label for="submit-new-envelope">NEW Envelope</label>
    <input type="submit" name="submit-new-envelope"> <br>

</form>
`

let homeButton = document.querySelector('#home');
let buttonsBar = document.querySelector('#buttons');
let content = document.querySelector('#dynamic');
let postButton = document.querySelector('#post');
let testMessage = document.querySelector('#test-message');
let newEnvelopeForm = document.querySelector('#new-envelope');

const getTestData = async () => {
    let response = await fetch("http://localhost:3000/envelopes/");
    const data = await response.json();
    return data;
}

postButton.onclick = () => {
    content.innerHTML = postContent;
    buttonsBar.setAttribute('style', 'display: none');
    homeButton.setAttribute('style', 'display: block');
}

homeButton.onclick = () => {
    content.innerHTML = '';
    homeButton.setAttribute('style', 'display: none');
    buttonsBar.setAttribute('style', 'display: block');
}

newEnvelopeForm.onsubmit = () => {

}
