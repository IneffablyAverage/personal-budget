const homeContent = `
<div id="buttons">
    <button id="delete">Delete Envelope</button>
    <button id="post">New Envelope</button>
    <button id="get">Display Envelope(s)</button>
</div>
`
const postContent = `
<div id="buttons">
    <button id="home">Back To HomePage</button>
    <button id="delete">Delete Envelope</button>
    <button id="get">Display Envelope(s)</button>
</div>
<form id="envelope-form" action="http://localhost:3000/envelopes/" method="POST">
                
    <label for="name">Name</label>
    <input type="text" name="name" required> <br>

    <label for="balance">Balance</label>
    <input type="number" name="balance" required> <br>

    <label for="submit-new-envelope">NEW Envelope</label>
    <input type="submit" name="submit-new-envelope"> <br>

</form>
`
const getContent = `
<div id="buttons">
    <button id="home">Back To HomePage</button>
    <button id="delete">Delete Envelope</button>
    <button id="get">Display Envelope(s)</button>
</div>
<form id="envelope-form" action="http://localhost:3000/envelopes/" method="GET">

    <label for="id">ID</label>
    <input type="number" name="id"> <br>

    <label for="submit-get-envelope">Get envelope</label>
    <input type="submit" name="submit-get-envelope"> <br>

</form>
`

const deleteContent = `
<div id="buttons">
    <button id="home">Back To HomePage</button>
    <button id="delete">Delete Envelope</button>
    <button id="get">Display Envelope(s)</button>
</div>
<form id="envelope-form" action="http://localhost:3000/envelopes/" method="DELETE">
                
    <label for="name">Name</label>
    <input type="text" name="name" required> <br>

    <label for="balance">Balance</label>
    <input type="number" name="balance" required> <br>

    <label for="submit-new-envelope">NEW Envelope</label>
    <input type="submit" name="submit-new-envelope"> <br>

</form>
`

let buttonsBar = document.querySelector('#buttons');
let content = document.querySelector('#dynamic');
let homeButton;
let deleteButton = document.querySelector('#delete');
let postButton = document.querySelector('#post');
let getButton = document.querySelector('#get');

let testMessage = document.querySelector('#test-message');
let envelopeForm = document.querySelector('#envelope-form');

const getData = async (url) => {
    let response = await fetch(url);
    if (response.ok) {
        // If the response was successful, parse it as JSON
        return await response.json();
    } else {
        // If the response was an error, parse it as text
        return await response.text();
    }
}

function resetHome(){
    heldResponse ='';
    homeButton = document.querySelector('#home')
    homeButton.onclick = () => {
        content.innerHTML = homeContent;
        postButton = document.querySelector('#post');
        postButton.onclick = postPage;
        getButton = document.querySelector('#get');
        getButton.onclick = getPage;
        deleteButton = document.querySelector('#delete');
        deleteButton.onclick = deletePage;
    }
}

function postPage(){
    content.innerHTML = postContent;

    resetHome();
}
postButton.onclick = postPage;

let heldResponse ='';

function getPage(){
    content.innerHTML = getContent + heldResponse;
    //select form from dom
    envelopeForm = document.querySelector('#envelope-form');
    //reinitialize buttons
    resetHome();

    //set the function to be called when form is submitted
    envelopeForm.onsubmit = async (event) => {
        console.log('preventing default');
        event.preventDefault();
        
        let id = envelopeForm.elements['id'].value;
        
        envelopeForm.action += `${id}`;
        console.log(envelopeForm.action);
        heldResponse = await getData(envelopeForm.action);
        heldResponse = JSON.stringify(heldResponse);
        envelopeForm.action = "http://localhost:3000/envelopes/";
        //call getPage again to reset all statuses except for any recieved data
        getPage();
    }

}
getButton.onclick = getPage;

function deletePage(){
    content.innerHTML = deleteContent;
    resetHome();
}
deleteButton.onclick = deletePage;


// newEnvelopeForm.onsubmit = () => {

// }
