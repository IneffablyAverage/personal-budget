let testButton = document.querySelector('#click');
let testMessage = document.querySelector('#test-message');

const getTestData = async () => {
    let response = await fetch("http://localhost:3000/table");
    const data = await response.json();
    return data;

}

testButton.onclick = () => {
    getTestData().then(data => {
        console.log(data);
    })
}