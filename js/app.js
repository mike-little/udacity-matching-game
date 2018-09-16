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

let restartBtn = document.querySelector('.restart');
let stars = document.querySelector('.stars');
let movesCtrl = document.querySelector('.moves');
let theDeck = document.querySelector('.deck');

let moveCount = 0;
let matchCount = 0;

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
    matchCount = 0;
    resetDeckHtml();
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

function resetDeckHtml() {
    for (let i = (theDeck.children.length -1); i >= 0; i--) {
        theDeck.removeChild(theDeck.children[i]);
    }
}

restartBtn.addEventListener('click', function(event) {
    play();
});

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

function openCard(card) {
    card.className += ' open show';
    openCardList.push(card.children[0].className);
}

function clearOpenCardList() {
    if (openCardList.length > 0) {
        for (var i = (openCardList.length - 1); i >= 0; i--) {
            openCardList.splice(i, 1);
        }
    }
}

function lockCard(card, otherOpenCardIndex) {
    card.className =  card.className.replace(' open show', ' match');
    for (let i=0; i < theDeck.children.length; i++) {
        let cardDetail = theDeck.children[i].className;
        theDeck.children[i].className = cardDetail.replace(' open show', ' match');
    }
    clearOpenCardList();
}

function closeCards() {
    for (let i=0; i < theDeck.children.length; i++) {
        let cardDetail = theDeck.children[i].className;
        theDeck.children[i].className = cardDetail.replace(' open show', '');
    }
    clearOpenCardList();
}

function showMoveCount() {
    moveCount++;
    movesCtrl.innerHTML = moveCount;
}

function showWinner() {
    if (matchCount === 8) {
        window.alert("Way to go, you won!!! in " + moveCount);
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
    if (event.srcElement.className === 'card') {
        let card = event.srcElement;
        let cardDetail = card.children[0];
        showMoveCount();
        if (!(card.className.includes('open show') ||
              card.className.includes('match'))) {
            let openCardIndex = openCardList.indexOf(cardDetail.className);
            openCard(card);
            if (openCardIndex != -1) { // match
              lockCard(card, openCardIndex);
              matchCount++;
            } else if (openCardList.length > 1) {
              closeCards();
            }
            showWinner();
        }
    }

});
