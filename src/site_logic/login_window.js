// import loadMoney from './index.js'
const BASE_URL = ''
let token

function openRegistrationForm() {
    window.location.href = "register_window.html";  
}

function backToGame() {
    window.location.href = "index.html";
}

async function gatherLogingData() {
    //gather username and password from texboxes
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    //check if these are not empty strings
    if (!username || !password) {
        alert("Please provide username and password.");
        return;
    } 

    //send an api request
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if(data.token){
            token=data.token
            localStorage.setItem('token',token)
        }else{
            alert("authentication failed")
            throw Error("failed to login")
        }

        alert(`Welcome, ${data.username}!`);
        window.location.href = "index.html";
    } catch (error) {
        console.log(error.message)
        alert("Cannot connect to backend server. Is it running?");
    }
}