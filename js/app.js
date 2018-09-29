/*
 * Create a list that holds all of your cards
 */
let cardsAvailable = ['fa fa-diamond', 
                      'fa fa-paper-plane-o', 
                      'fa fa-anchor', 
                      'fa fa-bolt',
                      'fa fa-cube',
                      'fa fa-leaf',
                      'fa fa-bicycle',
                      'fa fa-bomb'];
let openCardList = [];
const starClassName = "fa fa-star";

let restartBtn = document.querySelector('.restart');
let stars = document.querySelector('.stars');
let movesCtrl = document.querySelector('.moves');
let theDeck = document.querySelector('.deck');

let moveCount = 0;
let matchCount = 0;
let secondsExpired = 0;
let theGameTimer = setInterval(gameTimer, 1000);
let showingFail = false;

/*
 * Go
 */
play();

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function play() {
    moveCount = 0;
    showingFail = false;
    resetTimer();
    movesCtrl.innerHTML = moveCount + ' moves';
    matchCount = 0;
    resetDeckHtml();
    updateStars(translateMovesToStars());
    let cards = cardsAvailable.concat(cardsAvailable);
    cards = shuffle(cards);
    for (let i = 0; i < cards.length; i++) {
        let card = document.createElement("LI");
        card.className = 'card';
        let cardDetail = document.createElement("LI");
        cardDetail.className = cards[i];
        card.appendChild(cardDetail);
        theDeck.appendChild(card);
    }
}

//
// Determine how many stars to show based on how many moves the player
// has taken.
//
function translateMovesToStars() {
    let starCount = 3;
    if (moveCount > 17 && moveCount < 25 ) {
        starCount = 2;
    } else if (moveCount > 25) {
        starCount = 1;
    }
    return starCount;
}

//
// Updates the stars displayed to the player
//
function updateStars(numStarsToDisplay) {
    stars.innerHTML = '';
    for (let i = 0; i < numStarsToDisplay; i++) {
        stars.innerHTML += '<i class=\"fa fa-star\"></>';
    }
}

//
// Reset the deck of cards for a new game
//
function resetDeckHtml() {
    for (let i = (theDeck.children.length -1); i >= 0; i--) {
        theDeck.removeChild(theDeck.children[i]);
    }
}

//
// Add event listener for restart button to start a new game
//
restartBtn.addEventListener('click', function(event) {
    play();
});

//
// Shuffle the deck of cards for each new game
//
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//
// Start timer over for new game
//
function resetTimer() {
    clearInterval(theGameTimer);
    theGameTimer = setInterval(gameTimer, 1000);
    secondsExpired = 0;
    let timerDiv = document.getElementById("timer");
    timerDiv.innerHTML = secondsExpired + 's';
}

//
// Gets called every second while the game is in progress to keep
// track of how long the player takes to complete the game
//
function gameTimer() {
    secondsExpired++;
    let timerDiv = document.getElementById("timer");
    timerDiv.innerHTML = secondsExpired + 's';
}

//
// Show this card to the user
//
function openCard(card) {
    card.className += ' open show';
    openCardList.push(card.children[0].className);
}

//
// Close the cards that are open that do not match
//
function clearOpenCardList() {
    if (openCardList.length > 0) {
        for (var i = (openCardList.length - 1); i >= 0; i--) {
            openCardList.splice(i, 1);
        }
    }
}

//
// Lock this card in the open position
//
function lockCard(card, otherOpenCardIndex) {
    card.className =  card.className.replace(' open show', ' match');
    for (let i=0; i < theDeck.children.length; i++) {
        let cardDetail = theDeck.children[i].className;
        theDeck.children[i].className = cardDetail.replace(' open show', ' match');
    }
    clearOpenCardList();
}

//
// Close the cards that are open that do not match
//
function closeCards() {
    for (let i=0; i < theDeck.children.length; i++) {
        let cardDetail = theDeck.children[i].className;
        theDeck.children[i].className = cardDetail.replace(' open show', '');
    }
    clearOpenCardList();
}

//
// Display the number of moves the player has taken so far
//
function showMoveCount() {
    moveCount++;
    movesCtrl.innerHTML = moveCount + ' moves';
    updateStars(translateMovesToStars());
}

//
// Display a winning message to the user
//
function showWinner() {
    if (matchCount === 8) {
        if (confirm("Way to go, you won with " + moveCount + " moves in " + 
                     secondsExpired + " seconds. Rating = " + 
                     translateMovesToStars() + "\n\t Play again?")) {
            play();
        } else {
            resetTimer();
        }
    }
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
theDeck.addEventListener('click', function (event) {
    if (event.srcElement.className === 'card' && (showingFail === false)) {
        let card = event.srcElement;
        let cardDetail = card.children[0];
        if (!(card.className.includes('open show') ||
              card.className.includes('match'))) {
            let openCardIndex = openCardList.indexOf(cardDetail.className);
            openCard(card);
            if (openCardIndex != -1) { // match
              showMoveCount();
              lockCard(card, openCardIndex);
              matchCount++;
            } else if (openCardList.length > 1) {
              showMoveCount();
              showingFail = true;
              setTimeout( function () {closeCards(); showingFail = false;}, 750);
            }
            showWinner();
        }
    }

});
