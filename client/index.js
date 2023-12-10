let buttonsBar = document.querySelector('#buttons');
let buttons = buttonsBar.children;
let homeButton = buttonsBar.querySelector('#home');
let deleteButton = buttonsBar.querySelector('#delete');
let postButton = buttonsBar.querySelector('#post');
let getButton = buttonsBar.querySelector('#get');
let content = document.querySelector('#dynamic');
let testMessage = document.querySelector('#test-message');
let envelopeForm = document.querySelector('#envelope-form');
let heldResponse = '';
let homeContent = ``;
let currentTable = ``;

const homeURL = "http://localhost:3000/envelopes/"

function jsonArrayToTable(data){
    let table = `<table class="table-container"><tr class="header">`;
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

function adjustButtons(buttonNum){
    for(let i = 0; i < buttons.length; i++){
        if (i === buttonNum){
            buttons[i].setAttribute('style', 'display: none');
        } else{
            buttons[i].setAttribute('style', 'display: inline');
        }
    }
}
async function resetHome(){
    content.innerHTML = jsonArrayToTable(await getData(homeURL));

}
async function homePage(){
    try{
        currentTable = jsonArrayToTable(await getData(homeURL));
    } catch {}
    content.innerHTML = homeContent + currentTable;
    heldResponse = '';
    currentTable = ``;
    adjustButtons(0);
}

async function postPage(){
    try{
        currentTable = jsonArrayToTable(await getData(homeURL));
    } catch(err){}
    content.innerHTML = postContent + heldResponse + currentTable;
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
        envelopeForm.action = homeURL;
        //call postPage again to reset all statuses except for any recieved data
        postPage();
    }
}

async function getPage(){
    try{
        currentTable = jsonArrayToTable(await getData(homeURL));
    } catch(err){}
    content.innerHTML = getContent + heldResponse + currentTable;
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
        envelopeForm.action = homeURL;
        //call getPage again to reset all statuses except for any recieved data
        getPage();
    }
    
}

async function deletePage(){
    try{
        currentTable = jsonArrayToTable(await getData(homeURL));
    } catch(err){}
    content.innerHTML = deleteContent + heldResponse + currentTable;
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
        envelopeForm.action = homeURL;
        //call getPage again to reset all statuses except for any recieved data
        deletePage();
        
    }
    
}

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

window.onload = resetHome();
const postContent = `
<form id="envelope-form" action=${homeURL} method="POST">
    
    <h2>NEW Envelope</h2>
                
    <label for="name">Name</label>
    <input type="text" name="name" required> <br>

    <label for="balance">Balance</label>
    <input type="number" name="balance" required> <br>

    <input type="submit" name="submit-new-envelope"> <br>

</form>
`
const getContent = `
<form id="envelope-form" action=${homeURL} method="GET">

    <h2>SELECT Envelope</h2>

    <label for="id">ID</label>
    <input type="number" name="id"> <br>

    <input type="submit" name="submit-get-envelope"> <br>

</form>
`

const deleteContent = `
<form id="envelope-form" action=${homeURL} method="DELETE">
                
    <h2>DELETE Envelope</h2>

    <label for="id">ID</label>
    <input type="text" name="id" required> <br>

    <input type="submit" name="submit-delete-envelope"> <br>

</form>
`




homeButton.onclick = homePage;
postButton.onclick = postPage;
getButton.onclick = getPage;
deleteButton.onclick = deletePage;



