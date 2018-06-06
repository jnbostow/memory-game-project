memoryGame();


function memoryGame() {
    let updatePanelAction = updateGamePanel();
    let makeGameCardAction = gameCardAction();
    let gameTimerAction = gameTimer();

    //Calls functions to randomly generate tiles, starts the timer and adds
    // the event listeners
    iconGenerator();
    gameTimerAction.startTime();
    addEventListeners();

    function addEventListeners() {
        const gameCardElems = document.querySelectorAll('.game-card');
        const redoButtonElem = document.querySelector('.redo-button');
        const winButtonElem = document.querySelector('.win-msg button');

        winButtonElem.addEventListener('click', gameReset);

        redoButtonElem.addEventListener('click', gameReset);

        gameCardElems.forEach(function (card) {
            card.addEventListener('click', makeGameCardAction.action);
        });
    }

    //randomly assign icons to tiles and update DOM
    function iconGenerator() {
        let gameIcons = ['frog', 'crown', 'bomb', 'glasses', 'gem', 'kiwi-bird', 'rocket', 'umbrella',
            'frog', 'crown', 'bomb', 'glasses', 'gem', 'kiwi-bird', 'rocket', 'umbrella'];
        const cardIconElems = document.querySelectorAll('.game-card i');
        let randomNum = 0;
        let tempGameIcons = gameIcons.slice();

        cardIconElems.forEach(function (card) {
            const parentGameCardElem = card.parentElement.parentElement.parentElement;

            randomNum = Math.floor(Math.random() * tempGameIcons.length);

            parentGameCardElem.setAttribute('data-card', tempGameIcons[randomNum]);
            parentGameCardElem.setAttribute('data-selected', 'false');
            card.className = 'card-icon fas fa-' + tempGameIcons[randomNum];
            tempGameIcons.splice(randomNum, 1);
        });
    }

    //removes winning game message, generates new random tiles, resets stars
    // and moves in panel, restarts timer
    function gameReset() {
        const winGameElem = document.querySelector('.win-msg-container');
        const gameBoard = document.querySelector('.game-board');
        winGameElem.classList.remove('win-game');
        gameBoard.classList.remove('win-game');
        iconGenerator();
        makeGameCardAction.resetGameActionVars();
        updatePanelAction(0);
        gameTimerAction.startTime();
    }

    //controller for game cards and tracks if they are a match
    function gameCardAction() {
        let prevSelectedCardElem = '';
        let matchCount = 7;

        function action(event) {
            let currSelectedCardElem = event.currentTarget;

            if (currSelectedCardElem.dataset.selected !== 'match'
                && currSelectedCardElem.dataset.selected !== 'true') {
                currSelectedCardElem.dataset.selected = 'true';

                currSelectedCardElem.addEventListener('transitionend', function(e) {
                    currSelectedCardElem.removeEventListener(e.type, arguments.callee);

                    if (prevSelectedCardElem) {

                        if (currSelectedCardElem.dataset.card === prevSelectedCardElem.dataset.card) {

                            currSelectedCardElem.dataset.selected = 'match';
                            prevSelectedCardElem.dataset.selected = 'match';
                            matchCount++;

                            gameWinAction(matchCount);
                        } else {
                            currSelectedCardElem.dataset.selected = 'not-match';
                            prevSelectedCardElem.dataset.selected = 'not-match';
                        }

                        prevSelectedCardElem = '';
                    } else {
                        prevSelectedCardElem = currSelectedCardElem;
                    }
                    updatePanelAction();

                }, false, true);
            }
        }

        function resetGameActionVars() {
            prevSelectedCardElem = '';
            matchCount = 0;
        }

        return {
            action: action,
            resetGameActionVars: resetGameActionVars
        };
    }

    //controller for game panel, updates stars and moves
    function updateGamePanel() {
        let movesCounter = 0;
        const starElems = document.querySelector('.stars');
        const movesCountElem = document.querySelector('[data-movescount]');

        function updateMoves(numOfMoves = null) {
            movesCounter = numOfMoves === null? movesCounter + 1 : numOfMoves ;
            movesCountElem.dataset.movescount = String(Math.floor(movesCounter/2));
            starRating(movesCounter);
        }

        //changes star element icons based on number of moves
        function starRating(numMoves) {
            if (numMoves < 8) {
                starElems.children[0].className = 'fas fa-star';
                starElems.children[1].className = 'fas fa-star';
                starElems.children[2].className = 'fas fa-star';
            }
            else if (numMoves > 8 && numMoves < 20) {
                starElems.children[0].className = 'far fa-star';
                starElems.children[1].className = 'fas fa-star';
                starElems.children[2].className = 'fas fa-star';
            } else if (numMoves > 20 && numMoves < 32) {
                starElems.children[0].className = 'far fa-star';
                starElems.children[1].className = 'far fa-star';
                starElems.children[2].className = 'fas fa-star';
            } else if (numMoves > 32) {
                starElems.children[0].className = 'far fa-star';
                starElems.children[1].className = 'far fa-star';
                starElems.children[2].className = 'far fa-star';
            }
        }

        //exposes function to update moves and stars so variables are private
        return updateMoves;
    }

    //controller for game timer, exposes functions to start and stop timer
    function gameTimer() {
        let timeCounter = 0;
        const timerElem = document.querySelector('.timer');
        let secondsLapsed = 0;
        let minutesLapsed = 0;
        let timeInterval = '';

        //increments time in minutes and seconds format
        //TODO: add a time out message if over 60 minutes
        function incrementTime(timeVar = null) {
            timeCounter = timeVar === null? timeCounter + 1 : timeVar;

            secondsLapsed = Math.floor(timeCounter%60);
            minutesLapsed = Math.floor(timeCounter/60);

            String(secondsLapsed).length < 2 &&  (secondsLapsed = '0' + String(secondsLapsed));
            String(minutesLapsed).length < 2 &&  (minutesLapsed = '0' + String(minutesLapsed));

            timerElem.textContent = minutesLapsed + ':' + secondsLapsed;
        }

        //exposes functions so that variables are private
        return {
            startTime: function() {
                timeInterval && clearInterval(timeInterval);
                incrementTime(0);
                timeInterval = setInterval(incrementTime, 1000);
            },
            stopTime: function() {
                clearInterval(timeInterval);
            }
        }
    }

    //controller for Winning Game Message, displays game message and stops timer
    function gameWinAction(matchNum) {
        let gameBoard = '', winMsgElem = '', winGameDetails = '', scorePanel = '', timer ='';

        if (matchNum === 8) {
            gameTimerAction.stopTime();

            //getting DOM elements
            winMsgElem = document.querySelector('.win-msg-container');
            gameBoard = document.querySelector('.game-board');
            winGameDetails = document.querySelector('.win-game-details');
            scorePanel = document.querySelector('.stars').cloneNode(true);
            timer = document.querySelector('.timer').cloneNode(true);

            //adding class to trigger CSS styles for winning game
            gameBoard.classList.add('win-game');
            winMsgElem.classList.add('win-game');

            //removes any previously added panel elements
            winGameDetails.innerHTML = '';

            //adding cloned elements from game panel to Winning Game message
            winGameDetails.appendChild(scorePanel);
            winGameDetails.appendChild(timer);
        }
    }
}