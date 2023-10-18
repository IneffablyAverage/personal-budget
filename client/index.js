

let testButton = document.querySelector('#click');
let testMessage = document.querySelector('#test-message');

const getTestData = async () => {
    let response = await fetch("http://localhost:3000/envelopes/");
    const data = await response.json();
    return data;
    
}

testButton.onclick = () => {
    getTestData().then(data => {
        let string = '';
        data.forEach((element, index) => {
            string += data[index].name + '<br>';
        });
        testMessage.innerHTML = string;
        console.log(data[0].name);
    })
}