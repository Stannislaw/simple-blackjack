let username;
let password;
let email;

//base url has to be an empty string. when it is '/' it is not working
const BASE_URL='';

function backToGame() {
    window.location.href = "index.html";
}

function openLoggingInWindow() {
    window.location.href = "login_window.html";
}

async function gatherRegistrationData() {
    //create these for easier acces earlier. Trim to remove unnecessary spaces
    username = document.getElementById("username").value.trim();
    password = document.getElementById("password").value.trim();
    email = document.getElementById("email").value.trim();

    //verify if the inputs make sense
    if (!username || !password || !email) {
        alert("Please fill username, password and email.");
        return;
    }

    if(!email.includes('@')){
        alert("email should include @")
        return;
    }

    //send an api request
    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username:username, password:password, email:email })
        }); 
        //get the verification response
        const data = await response.json();

        //if registration went wrong alert the user
        if (!response.ok) {
            alert(data.message || "Registration failed.");
            return;
        }

        //alert the user everything went correctly and go back to login window
        alert("Account created! You can log in now.");
        window.location.href = "login_window.html";
    } catch (error) {
        alert("Cannot connect to backend server. Is it running?");
    }
}








