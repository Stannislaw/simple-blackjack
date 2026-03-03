// Initially hide the "drawACard" button by setting its visibility to hidden
// This keeps the layout intact
const drawACardButton = document.getElementById("drawACard");
const showdownButton = document.getElementById("showdown");
const playAgainButton = document.getElementById("playAgain");
const registerButton = document.getElementById("registerButton");
const logoutButton = document.getElementById("logoutButton");

if (drawACardButton) drawACardButton.style.visibility = "hidden";
if (showdownButton) showdownButton.style.visibility = "hidden";
if (playAgainButton) playAgainButton.style.visibility = "hidden";
if (logoutButton) logoutButton.style.visibility = "hidden";

//deck objects simulate behavior of a real life card deck
//the same card cannot be drawn twice
//when all the cards are drawn from the deck, no more cards can be drawn
class Deck {
    constructor() {
        let numbers = [...Array(9)].map((_, i) => i + 2);
        numbers = numbers.concat(['J','Q','K','A']);

        let suits = ['♠️','♦️','♣️','♥️'];

        this.cards = [];

        for (let number of numbers) {
            for (let suit of suits) {
                this.cards.push(number + suit);
            }
        }
    }

    draw() {
        if (this.cards.length === 0) return null;

        let n = Math.floor(Math.random() * this.cards.length);
        return this.cards.splice(n, 1)[0];
    }
};
 
//only one deck will be needed for blackjack game
let deck=new Deck();

//variables definitions
let playerCards = [];
let dealerCards = [];
let playerSum=0;
let money=100;
let stake=0; 
let logged_in=false
const apiBase="./"

// Select all elements with the class "cards"
let cardsElements = document.querySelectorAll(".cards");

// Loop through each element and set its visibility to "hidden"
cardsElements.forEach(element => {element.style.visibility = "hidden";});

//access token if it exists in the local storage
function getStoredToken() {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
        return null;
    }
    return token;
}

//update amount of money in database
async function updateMoney() {
    document.getElementById("money").textContent = money;
    const token = getStoredToken();
    if (!token) {
        return
    }

    try {
        const response = await fetch(apiBase + "userData/updateMoney", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ money })
        })

        if (!response.ok) {
            const data = await response.json()
            console.log(data.message || "Failed to update money")
        }
    } catch (error) {
        console.log(error.message)
    }
}

//load the money value from the database. Update local variable and display
async function loadMoney() {
    //check token
    const token = getStoredToken();
    if (!token) {
        document.getElementById("money").textContent = money
        setAuthButtons(false);
        return
    }

    //send API request
    try {
        const response = await fetch(apiBase + "userData/getMoney", {
            headers: {
                'Authorization': token
            }
        })

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("token")
                setAuthButtons(false)
                document.getElementById("money").textContent = money
                return
            }
            const data = await response.json()
            console.log(data.message || "Failed to load money")
            setAuthButtons(false)
            return
        }

        const data = await response.json()

        //update loca lvariable
        if (typeof data.money === 'number') {
            money = data.money
        }

        //update display
        document.getElementById("money").textContent = money

        //update visibility of login/logout buttons
        setAuthButtons(true)
        console.log("money loaded successfully")
    } catch (error) {
        console.log(error.message)
        setAuthButtons(false)
    }
}

//update message on the display
function updateMessage(message) {
    document.getElementById("message").textContent = message;
}

//calculate value of player's hand
function calculateHandSum(cards) {
    let sum = 0;
    let aces = 0;

    for (const card of cards) {
        if (card.startsWith("10")) {
            sum += 10;
            continue;
        }

        const rank = card[0];
        if (rank === 'J' || rank === 'Q' || rank === 'K') {
            sum += 10;
        } else if (rank === 'A') {
            sum += 11;
            aces += 1;
        } else {
            sum += parseInt(rank, 10);
        }
    }

    while (sum > 21 && aces > 0) {
        sum -= 10;
        aces -= 1;
    }

    return sum;
}

//update money display and visibility of cards, buttons
function finishRound() {
    document.getElementById("playAgain").style.visibility = "visible";
    document.getElementById("drawACard").style.visibility = "hidden";
    document.getElementById("showdown").style.visibility = "hidden";
    updateMoney();
}

function resetGame() {
    console.log("Resetting game...");
    updateMessage("Let's win some money!");
    playerCards = [];
    dealerCards = [];
    playerSum = 0;
    stake = 0;
    
    document.getElementById("drawACard").style.visibility = "hidden";
    document.getElementById("showdown").style.visibility = "hidden";
    document.getElementById("betButton").style.visibility = "visible";
    document.getElementById("stake").style.visibility = "visible";
    document.getElementById("playAgain").style.visibility = "hidden";
    document.getElementById("yourCards").textContent = playerCards.join(" , ");
    document.getElementById("dealerCards").textContent = dealerCards.join(" , ");
    document.getElementById("yourCards").style.visibility = "hidden";
    document.getElementById("dealerCards").style.visibility = "hidden";
    updateMoney();
    document.getElementById("bet").textContent = "0";

    if(money===0){
        money=100;
        updateMoney();
        updateMessage("You've run out of money! Here's a fresh 100 to keep playing.");
    }


}


//when the player already entered the stake, start game
function StartGame() {
    console.log("Starting game with stake:", stake);
    document.getElementById("yourCards").style.visibility = "visible";
    document.getElementById("dealerCards").style.visibility = "visible";
    playerCards = [];
    dealerCards = [];
    playerSum = 0;

    if (!deck || deck.cards.length < 10) {
        deck = new Deck();
    }

    DrawCard();
    DrawCard();

    dealerCards.push(deck.draw());
    dealerCards.push(deck.draw());

    document.getElementById("dealerCards").textContent = dealerCards[0] + " , ??";
}


//draw a player's card
function DrawCard(){
    if (!deck) return;

    const card = deck.draw();
    if (!card) return;

    playerCards.push(card);
    document.getElementById("yourCards").textContent = playerCards.join(" , ");
    playerSum = calculateHandSum(playerCards);
    console.log("Player sum:", playerSum);

    if(playerSum>21) {
        updateMessage("You lose! Your sum exceeded 21.");
        finishRound();
    }
}

//check if the player entered a valid stake value. start game
function betMoneyBtn() {
    //get the stake
    let stakeInput = document.getElementById("stake");
    stake = parseInt(stakeInput.value, 10);

    //check if the stake is correct. if it is so, start the game
    if (!isNaN(stake) && stake > 0 && stake <= money) {
        document.getElementById("bet").textContent = stake;

        money -= stake;
        updateMoney();

        stakeInput.value = "";

        document.getElementById("betButton").style.visibility = "hidden";
        document.getElementById("stake").style.visibility = "hidden";
        document.getElementById("drawACard").style.visibility = "visible";
        document.getElementById("showdown").style.visibility = "visible";
        cardsElements.forEach(element => {element.style.visibility = "visible";});
        StartGame();
    } else {
        updateMessage("Invalid stake. Please enter a valid amount that is less than or equal to your available money.");
    }
}

function drawACardBtn(){
        DrawCard();
}

function playAgainBtn() {
        resetGame();
}

//calculate the winner of the game and update player money
function showdownBtn(){
    let dealerSum = calculateHandSum(dealerCards);

    while (dealerSum < 17) {
        const card = deck.draw();
        if (!card) {
            break;
        }
        dealerCards.push(card);
        dealerSum = calculateHandSum(dealerCards);
    }

    document.getElementById("dealerCards").textContent = dealerCards.join(" , ");

    if (dealerSum > 21 || playerSum > dealerSum) {
        updateMessage("You win!");
        money += stake * 2;
    } else if (dealerSum === playerSum) {
        updateMessage("Push! It's a tie.");
        money += stake;
    } else {
        updateMessage("You lose!");
    }

    console.log("Dealer sum:", dealerSum);
    console.log("money:", money);

    finishRound();
}

function openRegisterBtn() {
    window.location.href = "login_window.html";
}

//sets visibility of login/logout buttons when the user logs in or out
function setAuthButtons(isLoggedIn) {
    const shouldShowLogout = Boolean(isLoggedIn);
    if (registerButton) registerButton.style.visibility = shouldShowLogout ? "hidden" : "visible";
    if (logoutButton) logoutButton.style.visibility = shouldShowLogout ? "visible" : "hidden";
    console.log("button visibility updated")
}

//log out
function logoutBtn() {
    localStorage.removeItem("token");
    money = 100;
    resetGame();
    setAuthButtons(false);
    updateMessage("Logged out.");
}

//when the page is opened load auth buttons visibility and update money display and value
document.addEventListener("DOMContentLoaded", () => {
    console.log("info from function listening to entering this page")
    setAuthButtons(false);
    loadMoney();
})