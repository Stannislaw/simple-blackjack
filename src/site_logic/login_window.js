// import loadMoney from './index.js'
const BASE_URL = ''
let token

//when user clicks 'register' button
function openRegistrationForm() {
    window.location.href = "register_window.html";  
}

//when user clicks 'back to game' button
function backToGame() {
    window.location.href = "index.html";
}

//when user already entered data for login and clicked 'log in' button
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

        //if registration was successfull a verification token is saved in memory
        if(data.token){
            token=data.token
            localStorage.setItem('token',token)
        }else{
            alert("authentication failed")
            throw Error("failed to login")
        }

        //greet the new user and redirect to game window
        alert(`Welcome, ${data.username}!`);
        window.location.href = "index.html";
    } catch (error) {
        //if API request went wrong
        console.log(error.message)
        alert("Cannot connect to backend server. Is it running?");
    }
}