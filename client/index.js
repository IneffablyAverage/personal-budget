const homeContent = ``

const postContent = `
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
<form id="envelope-form" action="http://localhost:3000/envelopes/" method="GET">

    <label for="id">ID</label>
    <input type="number" name="id"> <br>

    <label for="submit-get-envelope">Get envelope</label>
    <input type="submit" name="submit-get-envelope"> <br>

</form>
`

const deleteContent = `
<form id="envelope-form" action="http://localhost:3000/envelopes/" method="DELETE">
                
    <label for="id">ID</label>
    <input type="text" name="id" required> <br>

    <label for="submit-delete-envelope">DELETE Envelope</label>
    <input type="submit" name="submit-delete-envelope"> <br>

</form>
`

let buttonsBar = document.querySelector('#buttons');
let buttons = buttonsBar.children;
let homeButton = buttonsBar.querySelector('#home');
let deleteButton = buttonsBar.querySelector('#delete');
let postButton = buttonsBar.querySelector('#post');
let getButton = buttonsBar.querySelector('#get');


let content = document.querySelector('#dynamic');

let testMessage = document.querySelector('#test-message');
let envelopeForm = document.querySelector('#envelope-form');

let heldResponse ='';

const getData = async (url) => {
    let response = await fetch(url);
    if (response.ok) {
        // If the response was successful, parse it as JSON
        console.log('returning json');
        return await response.json();
    } else {
        // If the response was an error, parse it as text
        console.log('returning text');
        return await response.text();
    }
}

const deleteData = async (url) => {
    let response = await fetch(url, {method: 'DELETE'});
    // parse the response as text
    console.log('returning text');
    return await response.text();
}

const postData = async (url, data) => {
    let response = await fetch(url, {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data});
    return await response.text();

}

function jsonArrayToTable(data){
    let table = `<table class="table-container"><tr>`;
    let keys = Object.keys(data[0]);
    for(let key of keys){
        table += `<th>${key}</th>`;
    }
    table += `</tr>`;
    for(let element of data){
        table += `<tr>`;
        for(let key of keys){
            table += `<td>${element[key]}</td>`
        }
        table += `</tr>`;
    }
    table += `</table>`;
    return table;
}

function resetHome(){
    heldResponse ='';
}

function adjustButtons(buttonNum){
    for(let i = 0; i < buttons.length; i++){
        if (i === buttonNum){
            buttons[i].setAttribute('style', 'display: none');
        } else{
            buttons[i].setAttribute('style', 'display: inline');
        }
    }
}

homeButton.onclick = () => {
    content.innerHTML = homeContent;
    adjustButtons(0);
}

function postPage(){
    content.innerHTML = postContent + heldResponse;
    adjustButtons(2);

    //select form from dom
    envelopeForm = document.querySelector('#envelope-form');

    //set the function to be called when form is submitted
    envelopeForm.onsubmit = async (event) => {
        console.log('preventing default');
        event.preventDefault();
        
        let name = envelopeForm.elements['name'].value;
        let balance = envelopeForm.elements['balance'].value;
        let data = {
            name: `${name}`,
            balance: `${balance}`
        };
        data = JSON.stringify(data);
        console.log(data);
        //typical form submission would redirect the user to a new page (the action URL)
        //we don't want that in this case. I want a single dynamic webpage.
        //we accomplish this by using a function (getData) that uses the fetch API
        heldResponse = await postData(envelopeForm.action, data);
        envelopeForm.action = "http://localhost:3000/envelopes/";
        //call postPage again to reset all statuses except for any recieved data
        heldResponse += jsonArrayToTable(await getData(envelopeForm.action));
        postPage();
    }
}
postButton.onclick = postPage;



function getPage(){
    content.innerHTML = getContent + heldResponse;
    adjustButtons(3);

    //select form from dom
    envelopeForm = document.querySelector('#envelope-form');

    //set the function to be called when form is submitted
    envelopeForm.onsubmit = async (event) => {
        console.log('preventing default');
        event.preventDefault();
        
        let id = envelopeForm.elements['id'].value;
        
        envelopeForm.action += `${id}`;
        console.log(envelopeForm.action);

        //typical form submission would redirect the user to a new page (the action URL)
        //we don't want that in this case. I want a single dynamic webpage.
        //we accomplish this by using a function (getData) that uses the fetch API
        heldResponse = jsonArrayToTable(await getData(envelopeForm.action));
        envelopeForm.action = "http://localhost:3000/envelopes/";
        //call getPage again to reset all statuses except for any recieved data
        getPage();
    }

}
getButton.onclick = getPage;

function deletePage(){
    content.innerHTML = deleteContent + heldResponse;
    adjustButtons(1);
    //select form from dom
    envelopeForm = document.querySelector('#envelope-form');

    //set the function to be called when form is submitted
    envelopeForm.onsubmit = async (event) => {
        console.log('preventing default');
        event.preventDefault();

        let id = envelopeForm.elements['id'].value;
        
        envelopeForm.action += `${id}`;
        console.log(envelopeForm.action);

        //typical form submission would redirect the user to a new page (the action URL)
        //we don't want that in this case. I want a single dynamic webpage.
        //we accomplish this by using a function (deleteData) that uses the fetch API
        heldResponse = await deleteData(envelopeForm.action);
        envelopeForm.action = "http://localhost:3000/envelopes/";
        //call getPage again to reset all statuses except for any recieved data
        heldResponse += jsonArrayToTable(await getData(envelopeForm.action));
        deletePage();
        
    }

}
deleteButton.onclick = deletePage;


// newEnvelopeForm.onsubmit = () => {

// }
