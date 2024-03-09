let burgerButton = document.querySelector(".burger-button");
let incomeButton = "";
let expenseButton = "";
let buttonsBar = document.querySelector('#buttons');
let buttons = buttonsBar.children;
let homeButton = buttonsBar.querySelector('#home');
let deleteButton = buttonsBar.querySelector('#delete');
let postButton = buttonsBar.querySelector('#post');
let updateButton = buttonsBar.querySelector('#put');
let getButton = buttonsBar.querySelector('#get');
let content = document.querySelector('#dynamic');
let testMessage = document.querySelector('#test-message');
let envelopeForm = document.querySelector('#envelope-form');
let heldResponse = '';
let heldName = '';
let heldBalance = '';
let heldId = 0;
let displayBlock = '';
let homeContent = ``;
let currentTable = ``;
let tableRows = [];
let expenseForm = "";
let incomeForm = "";

const homeURL = "http://localhost:3000/envelopes/"

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//document scoped utility functions

function jsonArrayToTable(data){
    let rowId = "0";
    let table = `<table class="table-container"><tr class="header">`;
    let keys = Object.keys(data[0]);

    for(let key of keys){
        table += `<th>${key}</th>`;
    }
    table += `</tr>`;
    for(let element of data){
        table += `<tr id=row${rowId}>`;
        for(let key of keys){
            if (key == "balance"){
                table += `<td>$${element[key]}</td>`;
            } else{
                table += `<td>${element[key]}</td>`;
            }
        }
        rowId++;
        table += `</tr>`;
    }
    table += `</table>`;
    if (!heldId)
        heldId = +data[0]["id"];
    return table;
}

function jsonArrayDisplay(data){
    data = data[0];
    heldBalance = data['balance'];
    heldName = data['name'];
    let block = `
        <div id="display-block">
            <h2 style='display:inline'>${heldName}</h2>
            <button id="expense">Add Expense</button>
            <p>Balance = $${heldBalance}</p>
            <button id="income">Add Income</button>
        </div>
    `
    return block;
}

async function renderButtons(){
    try{
        incomeButton = document.querySelector("#income");
        expenseButton = document.querySelector("#expense");
        displayBlock = document.querySelector("#display-block");
    }catch {};
    try{
        incomeButton.onclick = () =>{
            displayBlock.innerHTML = `
                <h2 style='display:inline'>${heldName}</h2>
                <button id="expense">Add Expense</button>
                <p>Balance = $${heldBalance}</p>
                <form id="income-form" action='${homeURL}'>
                    <label for="income">Income Amount</label>
                    <input type="number" name="income"></input>
                </form>
            `;
            incomeForm = displayBlock.children[3];
            console.log(heldBalance);
            incomeForm.onsubmit = async (event) => {
                event.preventDefault();
                
                let newBalance = heldBalance + (+incomeForm.elements['income'].value);
                await updateData(incomeForm.action, undefined, newBalance, undefined);
                getPage();
            }
            renderButtons();
        }
    } catch{}
    try{
        expenseButton.onclick = () =>{
            expenseButton.style = "display: none";
            displayBlock.innerHTML = `
                <h2 style='display:inline'>${heldName}</h2>
                <button id="income">Add Income</button>
                <p>Balance = $${heldBalance}</p>
                <form id="expense-form" action='${homeURL}'>
                    <label for="expense">Expense Amount</label>
                    <input type="number" name="expense"></input>
                </form>
            `;
            expenseForm = displayBlock.children[3];
            expenseForm.onsubmit = async (event) => {
                event.preventDefault();
                console.log("prevented default");
                let newBalance = heldBalance - expenseForm.elements['expense'].value;
                await updateData(expenseForm.action, undefined, newBalance, undefined);
                getPage();
            } 
            renderButtons();
        }
    } catch{}
        console.log("success!");

}

async function renderRows(){
    tableRows = document.querySelector('tbody').children;
    for(let index = 1; index < tableRows.length; index++){
        tableRows[index].onclick = (event) => {
            heldId = +tableRows[index].children[0].innerHTML;
            getPage(event, index);
        };
    }
}

function adjustButtons(buttonNum){
    console.log("adjusting buttons");
    for(let i = 0; i < buttons.length; i++){
        if (i === buttonNum){
            buttons[i].setAttribute('style', 'display: none');
        } else{
            buttons[i].setAttribute('style', 'display: inline-block');
        }
    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Page Functions

async function homePage(){
    buttonsBar.style.transform = "translateY(-200%)";
    setTimeout(() => {buttonsBar.style.display = "none";}, 500);
    try{
        currentTable = jsonArrayToTable(await getData(homeURL));
    } catch {}
    content.innerHTML = homeContent + currentTable;
    renderRows();

    heldResponse = '';
    currentTable = ``;
    adjustButtons(0);
    renderButtons();
}
async function postPage(){
    try{
        currentTable = jsonArrayToTable(await getData(homeURL));
    } catch(err){}
    content.innerHTML = postContent + heldResponse + currentTable;
    renderRows();
    adjustButtons(2);
    renderButtons();
    incomeButton = document.querySelector("#income");
    expenseButton = document.querySelector("#expense");


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
async function updatePage(){
    try{
        currentTable = jsonArrayToTable(await getData(homeURL));
    } catch(err){}
    content.innerHTML = updateContent + heldResponse + currentTable;
    renderRows();
    adjustButtons(4);
    renderButtons();
    
    //select form from dom
    envelopeForm = document.querySelector('#envelope-form');

    envelopeForm.elements['id'].value = heldId;

    //set the function to be called when form is submitted
    envelopeForm.onsubmit = async (event) => {
        console.log('preventing default');
        event.preventDefault();
        
        let newName = envelopeForm.elements['name'].value;
        let newBalance = envelopeForm.elements['balance'].value;
        if (!newName){
            newName = undefined;
        }
        if (!newBalance){
            newBalance = undefined;
        }
        let id = +envelopeForm.elements['id'].value;
        //console.log(data);
        //typical form submission would redirect the user to a new page (the action URL)
        //we don't want that in this case. I want a single dynamic webpage.
        //we accomplish this by using a function (getData) that uses the fetch API
        heldResponse = await updateData(envelopeForm.action, newName, newBalance, id);
        envelopeForm.action = homeURL;
        //call postPage again to reset all statuses except for any recieved data
        updatePage();
    }
}
async function getPage(){
    try{
        currentTable = jsonArrayToTable(await getData(homeURL));
    } catch(err){}
    adjustButtons(3);
    let response = jsonArrayDisplay(await getData(homeURL + `${heldId}`));
    if (heldResponse !== response){
        heldResponse = response;
    }
    content.innerHTML = getContent + heldResponse + currentTable;
    renderRows();
    renderButtons();

}
async function deletePage(){
    try{
        currentTable = jsonArrayToTable(await getData(homeURL));
    } catch(err){}
    content.innerHTML = deleteContent + heldResponse + currentTable;
    renderRows();
    adjustButtons(1);
    renderButtons();
    //select form from dom
    envelopeForm = document.querySelector('#envelope-form');
    envelopeForm.elements['id'].value = heldId;
    //set the function to be called when form is submitted
    console.log(heldId);
    envelopeForm.onsubmit = async (event) => {
        console.log('preventing default');
        event.preventDefault();

        heldId = +envelopeForm.elements['id'].value;
        console.log(heldId);
        envelopeForm.action += `${heldId}`;
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Data Retrieval Functions

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
const updateData = async (url, newName=heldName, newBalance=heldBalance, id=heldId) => {
    let newData = {
        name: `${newName}`,
        balance: `${newBalance}`,
        id: id
    };
    newData = JSON.stringify(newData);

    console.log(newData, heldBalance, heldId, heldName);
    let response = await fetch(url, {method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: newData});
    return await response.text();
}
const postData = async (url, data) => {
    let response = await fetch(url, {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data});
    return await response.text();

}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//string representations of page content


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
const updateContent = `
<form id="envelope-form" action=${homeURL} method="POST">
    
    <h2>UPDATE Envelope</h2>
    
    <label for="id">ID</label>
    <input type="number" name="id" required> <br>
                
    <label for="name">New Name</label>
    <input type="text" name="name"> <br>

    <label for="balance">New Balance</label>
    <input type="number" name="balance"> <br>

    <input type="submit" name="submit-new-info"> <br>

</form>
`
const getContent = `
`
const deleteContent = `
<form id="envelope-form" action=${homeURL} method="DELETE">
                
    <h3>Are you sure you want to DELETE Envelope with:</h3>

    <label for="id">ID</label>
    <input type="text" name="id" required> <br>

    <input type="submit" name="submit-delete-envelope"> <br>

</form>
`

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//DOM event handlers

homeButton.onclick = homePage;
postButton.onclick = postPage;
getButton.onclick = getPage;
deleteButton.onclick = deletePage;
updateButton.onclick = updatePage;

//the functions below are not working because nothing has been 
//rendered to the expense button or the income button



burgerButton.onclick = () => {
    console.log(buttonsBar.style.transform);
    if(buttonsBar.style.transform == "" || buttonsBar.style.transform == "translateY(-200%)"){
        buttonsBar.style.display = "block";
        setTimeout(() => {buttonsBar.style.transform = "translateY(0%)";}, 5);
    } else{
        buttonsBar.style.transform = "translateY(-200%)";
        setTimeout(() => {buttonsBar.style.display = "none";}, 500);
    }

}

window.onload = async () =>{
    content.innerHTML = jsonArrayToTable(await getData(homeURL));
    renderRows();
};

