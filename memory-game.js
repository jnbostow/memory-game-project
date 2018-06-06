memoryGame();


function memoryGame() {
    let updatePanelAction = updateGamePanel();
    let makeGameCardAction = gameCardAction();
    let gameTimerAction = gameTimer();

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

    function updateGamePanel() {
        let movesCounter = 0;
        const starElems = document.querySelector('.stars');
        const movesCountElem = document.querySelector('[data-movescount]');

        function updateMoves(numOfMoves = null) {
            movesCounter = numOfMoves === null? movesCounter + 1 : numOfMoves ;
            movesCountElem.dataset.movescount = String(Math.floor(movesCounter/2));
            starRating(movesCounter);
        }

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

        return updateMoves;
    }

    function gameTimer() {
        let timeCounter = 0;
        const timerElem = document.querySelector('.timer');
        let secondsLapsed = 0;
        let minutesLapsed = 0;
        let timeInterval = '';

        function incrementTime(timeVar = null) {
            timeCounter = timeVar === null? timeCounter + 1 : timeVar;

            secondsLapsed = Math.floor(timeCounter%60);
            minutesLapsed = Math.floor(timeCounter/60);

            String(secondsLapsed).length < 2 &&  (secondsLapsed = '0' + String(secondsLapsed));
            String(minutesLapsed).length < 2 &&  (minutesLapsed = '0' + String(minutesLapsed));

            timerElem.textContent = minutesLapsed + ':' + secondsLapsed;
        }

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

    function gameWinAction(matchNum) {
        let gameBoard = '';
        if (matchNum === 8) {
            gameTimerAction.stopTime();

            winMsgElem = document.querySelector('.win-msg-container');
            gameBoard = document.querySelector('.game-board');
            winGameDetails = document.querySelector('.win-game-details');
            scorePanel = document.querySelector('.stars').cloneNode(true);
            timer = document.querySelector('.timer').cloneNode(true);

            gameBoard.classList.add('win-game');
            winMsgElem.classList.add('win-game');

            winGameDetails.innerHTML = '';

            winGameDetails.appendChild(scorePanel);
            winGameDetails.appendChild(timer);
        }
    }
}