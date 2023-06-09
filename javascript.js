// Gameboard Module
const gameBoard = (() => {
    let gameArray = [];

    const initializeArray = () => {
        for (i = 0; i <= 8; i++) {
            gameArray.push({value: '', written: false, position: i});
        }
    }

    const getArray = () => gameArray;

    const writeArray = (index, value, written) => {
        gameArray[index].value = value;
        gameArray[index].written = written;
    }
    
    const generate = () => {
        initializeArray();
        let gbDiv = document.getElementById('gameBoard');
        gameArray.forEach((item, index) => {
            let gameSquare = document.createElement('div');
            gameSquare.classList.add('gameBoardDiv');
            gameSquare.classList.add('unwritten')
            gameSquare.id = index
            gameSquare.dataset.value = item.value
            gameSquare.dataset.written = item.written
            gameSquare.innerHTML = item.value;
            gbDiv.appendChild(gameSquare);
            // On click
            gameSquare.addEventListener('click', a => {
                if (item.written == true) {
                } else if(playerChoice === playerTurn && versusAI){
                    a.target.innerHTML = playerChoice
                    a.target.dataset.value = playerChoice
                    a.target.dataset.written = true
                    a.target.classList.remove('unwritten');
                    gameBoard.writeArray(a.target.id, playerChoice, true);
                    controller.winChecker(a);
                    if (winReached || drawReached) {
                        controller.winnerDetermined();
                        return;
                    };
                    playerTurn = player2Choice
                    if (playerTurn == 'X') {
                        document.getElementById('currentPlayer').innerHTML = "<";
                        document.getElementById('playerX').classList.add('currentTurn');
                        document.getElementById('playerO').classList.remove('currentTurn');
                        playerAI.takeTurn();
                    }
                    if (playerTurn == 'O') {
                        document.getElementById('currentPlayer').innerHTML = ">";
                        document.getElementById('playerO').classList.add('currentTurn');
                        document.getElementById('playerX').classList.remove('currentTurn');
                        playerAI.takeTurn();
                    }
                } else if (!versusAI) {
                    console.log('PvP')
                    a.target.innerHTML = playerTurn;
                    a.target.dataset.value = playerTurn
                    a.target.dataset.written = true
                    a.target.classList.remove('unwritten');
                    gameBoard.writeArray(a.target.id, playerTurn, true);
                    controller.winChecker(a);
                    if (winReached || drawReached) {
                        controller.winnerDetermined();
                        return;
                    };
                    playerTurn == playerChoice ? playerTurn = player2Choice : playerTurn = playerChoice;
                    if (playerTurn == 'X') {
                        document.getElementById('currentPlayer').innerHTML = "<";
                        document.getElementById('playerX').classList.add('currentTurn');
                        document.getElementById('playerO').classList.remove('currentTurn');
                    }
                    if (playerTurn == 'O') {
                        document.getElementById('currentPlayer').innerHTML = ">";
                        document.getElementById('playerO').classList.add('currentTurn');
                        document.getElementById('playerX').classList.remove('currentTurn');
                    }
                }
            }) 
        })
    }

    const erase = () => {
        Array.from(document.getElementById('gameBoard').children).forEach( (item, index) => {
            item.dataset.value = '';
            item.dataset.written = false;
            item.classList.add('unwritten');
            item.innerHTML = '';
        })

        let gameArray = gameBoard.getArray();
        gameArray.forEach(item => {
            item.value = '';
            item.written = false;
        })
    }

    return {getArray, writeArray, generate, erase};
})();

//Controller Module//
const controller = (() => {
    const initialize = () => {
        let controllerDiv = document.getElementById('controller')
        let playerX = document.createElement('div');
        playerX.classList = 'player';
        playerX.id = 'playerX'
        playerX.innerHTML = 'X'
        controllerDiv.appendChild(playerX);
        let currentPlayer = document.createElement('div');
        currentPlayer.classList = 'player';
        currentPlayer.id = 'currentPlayer';
        currentPlayer.innerHTML = '<';
        controllerDiv.appendChild(currentPlayer);
        let playerO = document.createElement('div');
        playerO.classList = 'player';
        playerO.id = 'playerO'
        playerO.innerHTML = 'O'
        controllerDiv.appendChild(playerO);
        document.getElementById('resetButton').addEventListener('click', a => {
            gameBoard.erase();
            resetting = true;
            document.getElementById('difficultyText').innerHTML = '';
            playerChoice = '';
            player2Choice = '';
            player2Difficulty = 0;
            playerTurn = 'X';
            victor = '';
            document.getElementById('playerO').classList.remove('currentTurn');
            document.getElementById('playerX').classList.remove('currentTurn');
            controller.chooseMode();

        })

    }

    // Vertical Win Checker
    const verticalWC = (targPos, gameArray) => {
        switch (true) {
            case [0,1,2].includes(targPos):
                if (gameArray[targPos+3].value == gameArray[targPos].value && gameArray[targPos+6].value == gameArray[targPos].value) {winReached = true; victor = playerTurn};
                break;
            case [3,4,5].includes(targPos):
                if (gameArray[targPos-3].value == gameArray[targPos].value && gameArray[targPos+3].value == gameArray[targPos].value) {winReached = true; victor = playerTurn};
                break;
            case [6,7,8].includes(targPos):
                if (gameArray[targPos-3].value == gameArray[targPos].value && gameArray[targPos-6].value == gameArray[targPos].value) {winReached = true; victor = playerTurn};
                break;
        };
    };
    // Checks for horizontal wins based on checkers
    const horizontalWC = (targPos, gameArray) => {
        switch (true) {
            case [0,3,6].includes(targPos):
                if (gameArray[targPos+1].value == gameArray[targPos].value && gameArray[targPos+2].value == gameArray[targPos].value) {winReached = true; victor = playerTurn};
                break;
            case [1,4,7].includes(targPos):
                if (gameArray[targPos-1].value == gameArray[targPos].value && gameArray[targPos+1].value == gameArray[targPos].value) {winReached = true; victor = playerTurn};
                break;
            case [2,5,8].includes(targPos):
                if (gameArray[targPos-2].value == gameArray[targPos].value && gameArray[targPos-1].value == gameArray[targPos].value) {winReached = true; victor = playerTurn};
                break;
        };
    };
    // Checks for Diagonal Wins based on Position
    const diagWC = (targPos, gameArray) => {
        switch(true) {
            case targPos == 0:
                if (gameArray[targPos+4].value == gameArray[targPos].value && gameArray[targPos+8].value == gameArray[targPos].value) {winReached = true; victor = playerTurn};
                break;
            case targPos == 2:
                if (gameArray[targPos+2].value == gameArray[targPos].value && gameArray[targPos+6].value == gameArray[targPos].value) {winReached = true; victor = playerTurn};
                break;
            case targPos == 4:
                if (gameArray[targPos-2].value == gameArray[targPos].value && gameArray[targPos+2].value == gameArray[targPos].value) {
                    winReached = true;
                    victor = playerTurn;
                    break;
                }
                if (gameArray[targPos-4].value == gameArray[targPos].value && gameArray[targPos+4].value == gameArray[targPos].value) {
                    winReached = true;
                    victor = playerTurn;
                    break
                }
            case targPos == 6:
                if (gameArray[targPos-2].value == gameArray[targPos].value && gameArray[targPos-4].value == gameArray[targPos].value) {winReached = true; victor = playerTurn};
                break;
            case targPos == 8:
                if (gameArray[targPos-4].value == gameArray[targPos].value && gameArray[targPos-8].value == gameArray[targPos].value) {winReached = true; victor = playerTurn};
                break;

        };
    };

    //Win Checker.  Combines the three functions above.
    const winChecker = (a) => {
        let gameArray = gameBoard.getArray();
        let targPos = Number(a.target.id)
        verticalWC(targPos, gameArray);
        horizontalWC(targPos, gameArray);
        diagWC(targPos, gameArray);
        if (!winReached) {
            let movesLeft = gameArray.filter(a => a.written == false)
            if (movesLeft.length === 0) {
                drawReached = true;
                winReached = true;
            };
        }

    }

    const modal = () => {
        let modalBKG = document.createElement('div');
        modalBKG.classList = 'modal'
        modalBKG.id = 'modal';
        document.body.appendChild(modalBKG)
    }

    const choosePlayer = () => {
        let modalWindow = document.createElement('modal-window');
        let modalBKG = document.getElementById('modal');
        modalWindow.id = 'modal-window'
        modalBKG.appendChild(modalWindow);
        let choosePlayer = document.createElement('div');
        choosePlayer.classList = 'choiceText';
        choosePlayer.innerHTML = 'Make Your Choice:';
        modalWindow.appendChild(choosePlayer);
        let chooseX = document.createElement('div');
        chooseX.classList = 'choose';
        chooseX.id = 'chooseX'
        chooseX.innerHTML = 'X';
        modalWindow.appendChild(chooseX);
        let chooseO = document.createElement('div');
        chooseO.classList = 'choose';
        chooseO.innerHTML = 'O';
        chooseO.id = 'chooseO'
        modalWindow.appendChild(chooseO);

        document.getElementById('chooseO').addEventListener('click', () => {
            resetting = false;
            playerChoice = 'O';
            player2Choice = 'X';
            document.getElementById('modal').remove();
            document.getElementById('playerX').classList.add('currentTurn');
            playerAI.takeTurn();
        });

        document.getElementById('chooseX').addEventListener('click', () => {
            resetting = false;
            playerChoice = 'X';
            player2Choice = 'O';
            document.getElementById('modal').remove();
            document.getElementById('playerX').classList.add('currentTurn');

        });


    }

    const chooseDifficulty = () => {
        let modalWindow = document.createElement('modal-window');
        let modalBKG = document.getElementById('modal');
        modalWindow.id = 'modal-window'
        modalBKG.appendChild(modalWindow);
        let choosePlayer = document.createElement('div');
        choosePlayer.classList = 'choiceText';
        choosePlayer.innerHTML = 'Difficulty:';
        modalWindow.appendChild(choosePlayer);
        let chooseX = document.createElement('div');
        chooseX.classList = 'choose';
        chooseX.id = 'chooseEasy'
        chooseX.innerHTML = 'Easy';
        modalWindow.appendChild(chooseX);
        let chooseO = document.createElement('div');
        chooseO.classList = 'choose';
        chooseO.innerHTML = 'Hard';
        chooseO.id = 'chooseHard'
        modalWindow.appendChild(chooseO);
        let chooseImp = document.createElement('div');
        chooseImp.classList = 'choose';
        chooseImp.innerHTML = 'Impossible';
        chooseImp.id = 'chooseImp'
        modalWindow.appendChild(chooseImp);

        document.getElementById('chooseEasy').addEventListener('click', () => {
            player2Difficulty = 0;
            document.getElementById('modal-window').remove();
            document.getElementById('difficultyText').innerHTML = 'Easy Mode'
            controller.choosePlayer();
        });

        document.getElementById('chooseHard').addEventListener('click', () => {
            player2Difficulty = 1;
            document.getElementById('modal-window').remove();
            document.getElementById('difficultyText').innerHTML = 'Hard Mode'
            controller.choosePlayer();
        });


        document.getElementById('chooseImp').addEventListener('click', () => {
            player2Difficulty = 2;
            document.getElementById('modal-window').remove();
            document.getElementById('difficultyText').innerHTML = 'Impossible Mode'
            controller.choosePlayer();
        });
    }

    const chooseMode = () => {
        modal();
        let modalWindow = document.createElement('modal-window');
        let modalBKG = document.getElementById('modal');
        modalWindow.id = 'modal-window'
        modalBKG.appendChild(modalWindow);
        let choosePlayer = document.createElement('div');
        choosePlayer.classList = 'choiceText';
        choosePlayer.innerHTML = 'Mode:';
        modalWindow.appendChild(choosePlayer);
        let chooseX = document.createElement('div');
        chooseX.classList = 'choose';
        chooseX.id = 'chooseEasy'
        chooseX.innerHTML = 'Versus AI';
        modalWindow.appendChild(chooseX);
        let chooseO = document.createElement('div');
        chooseO.classList = 'choose';
        chooseO.innerHTML = 'Versus Player';
        chooseO.id = 'chooseHard'
        modalWindow.appendChild(chooseO);

        document.getElementById('chooseEasy').addEventListener('click', () => {
            versusAI = true;
            document.getElementById('modal-window').remove();
            chooseDifficulty();
        });

        document.getElementById('chooseHard').addEventListener('click', () => {
            versusAI = false;
            document.getElementById('modal').remove();
            document.getElementById('difficultyText').innerHTML = 'Multiplayer'
            document.getElementById('playerX').classList.add('currentTurn');
            playerTurn = 'X'
            playerChoice = 'X';
            player2Choice = 'O';
        });


    }


    const winnerDetermined = () => {
        modal();
        let modalWindow = document.createElement('modal-window');
        let modalBKG = document.getElementById('modal');
        modalWindow.id = 'winner-window'
        modalBKG.appendChild(modalWindow);
        let winnerMessage = document.createElement('div');
        winnerMessage.classList = 'choiceText';
        // If draw, print draw, if not, print winner.
        if (drawReached) {
            winnerMessage.innerHTML = 'DRAW';
            modalWindow.appendChild(winnerMessage);
        }
        else {
            winnerMessage.innerHTML = 'WINNER:';
            modalWindow.appendChild(winnerMessage);
            let victorInd = document.createElement('div');
            victorInd.classList = 'choiceText';
            victorInd.innerHTML = `${victor}`;
            modalWindow.appendChild(victorInd);
        }

        let playAgain = document.createElement('button');
        playAgain.type = 'button';
        playAgain.id = 'playAgain';
        playAgain.innerHTML = 'Play Again'
        modalWindow.appendChild(playAgain);

        document.getElementById('playAgain').addEventListener('click', a => {
            gameBoard.erase();
            document.getElementById('modal').remove();
            document.getElementById('difficultyText').innerHTML = '';
            playerChoice = '';
            player2Choice = '';
            player2Difficulty = 0;
            playerTurn = 'X';
            winReached = false;
            drawReached = false;
            victor = '';
            document.getElementById('playerO').classList.remove('currentTurn');
            document.getElementById('playerX').classList.remove('currentTurn');
            controller.chooseMode();

        })

    }


    return {initialize, winChecker, chooseDifficulty, choosePlayer, winnerDetermined, chooseMode}
})();

//AI Module

const playerAI = (() => {
    const gameArray = gameBoard.getArray();
    
    // Easy AI.  Finds list of legal moves, and takes a random one.
    const difficulty0 = () => {


        // Gets list of legal moves.
        let legalMove = gameArray.filter(square => !square.written)
        let chosenMove = legalMove[Math.floor(Math.random()*legalMove.length)].position;

        // Writes move to game array
        gameArray[chosenMove].value = player2Choice;
        gameArray[chosenMove].written = true;

        // Renders move on HTML
        const randomSquare = document.getElementById(chosenMove.toString())
        randomSquare.dataset.value = player2Choice
        randomSquare.dataset.written = true;
        randomSquare.innerHTML = `${player2Choice}`;

        // Checks for Win
        controller.winChecker({ target: randomSquare });
        if (winReached || drawReached) {
            controller.winnerDetermined();
            return;
        };
        

        // Switch the player turn
        playerTurn = playerChoice;
        document.getElementById('currentPlayer').innerHTML = playerTurn === 'X' ? '<' : '>';
        if (playerTurn == 'X') {
            document.getElementById('playerX').classList.add('currentTurn');
            document.getElementById('playerO').classList.remove('currentTurn');
        }
        if (playerTurn == 'O') {
            document.getElementById('playerO').classList.add('currentTurn');
            document.getElementById('playerX').classList.remove('currentTurn');
        }


        };

    // Hard AI.  Finds list of legal moves, prioritizes winning ones.  If none found, use a random move.  Doesn't block.
    const difficulty1 = () => {

       // Find the first available winning move
      for (let i = 0; i < gameArray.length; i++) {
        if (!gameArray[i].written) {
          // Simulate the AI's move
          gameArray[i].value = player2Choice;
          gameArray[i].written = true;
  
          // Check if the AI wins with this move
          if (isWinningMove(player2Choice, gameArray)) {
            // Update the game board and HTML element
            const gameSquare = document.getElementById(i.toString());
            gameSquare.innerHTML = player2Choice;
            gameSquare.dataset.value = player2Choice;
            gameSquare.dataset.written = true;
            gameSquare.classList.remove('unwritten');
  
            // Check for a win after AI's turn
            controller.winChecker({ target: gameSquare });
            if (winReached || drawReached) {
                controller.winnerDetermined();
                return;
            };
  
            // Switch the player turn

            playerTurn = playerChoice;
            document.getElementById('currentPlayer').innerHTML = playerTurn === 'X' ? '<' : '>';
            if (playerTurn == 'X') {
                document.getElementById('playerX').classList.add('currentTurn');
                document.getElementById('playerO').classList.remove('currentTurn');
            }
            if (playerTurn == 'O') {
                document.getElementById('playerO').classList.add('currentTurn');
                document.getElementById('playerX').classList.remove('currentTurn');
            }
            return; // Exit the function
          }
  
          // Reset the simulated move
          gameArray[i].value = '';
          gameArray[i].written = false;
        }
      }

      //If none are found, take a random legal move.
      difficulty0();
    
    };

    //Impossible.  This was generated by ChatGPT after feeding it my HTML and JS file.  Worked perfectly on the first try.
    const difficulty2 = () => {
  
      // Find the first available winning move
      for (let i = 0; i < gameArray.length; i++) {
        if (!gameArray[i].written) {
          // Simulate the AI's move
          gameArray[i].value = player2Choice;
          gameArray[i].written = true;
  
          // Check if the AI wins with this move
          if (isWinningMove(player2Choice, gameArray)) {
            // Update the game board and HTML element
            const gameSquare = document.getElementById(i.toString());
            gameSquare.innerHTML = player2Choice;
            gameSquare.dataset.value = player2Choice;
            gameSquare.dataset.written = true;
            gameSquare.classList.remove('unwritten');
  
            // Check for a win after AI's turn
            controller.winChecker({ target: gameSquare });
            if (winReached || drawReached) {
                controller.winnerDetermined();
                return;
            };
  
            // Switch the player turn
            playerTurn = playerChoice;
            document.getElementById('currentPlayer').innerHTML = playerTurn === 'X' ? '<' : '>';
            if (playerTurn == 'X') {
                document.getElementById('playerX').classList.add('currentTurn');
                document.getElementById('playerO').classList.remove('currentTurn');
            }
            if (playerTurn == 'O') {
                document.getElementById('playerO').classList.add('currentTurn');
                document.getElementById('playerX').classList.remove('currentTurn');
            }
  
            return; // Exit the function
          }
  
          // Reset the simulated move
          gameArray[i].value = '';
          gameArray[i].written = false;
        }
      }
  
      // Find the first available blocking move
      for (let i = 0; i < gameArray.length; i++) {
        if (!gameArray[i].written) {
          // Simulate the human player's move
          gameArray[i].value = playerChoice;
          gameArray[i].written = true;
  
          // Check if the human player wins with this move
          if (isWinningMove(playerChoice, gameArray)) {
            // Block the human player's winning move
            gameArray[i].value = player2Choice;
            gameArray[i].written = true;
  
            // Update the game board and HTML element
            const gameSquare = document.getElementById(i.toString());
            gameSquare.innerHTML = player2Choice;
            gameSquare.dataset.value = player2Choice;
            gameSquare.dataset.written = true;
            gameSquare.classList.remove('unwritten');
  
            // Check for a win after AI's turn
            controller.winChecker({ target: gameSquare });
            if (winReached || drawReached) {
                controller.winnerDetermined();
                return;
            };
  
            // Switch the player turn
            playerTurn = playerChoice;
            document.getElementById('currentPlayer').innerHTML = playerTurn === 'X' ? '<' : '>';
            if (playerTurn == 'X') {
                document.getElementById('playerX').classList.add('currentTurn');
                document.getElementById('playerO').classList.remove('currentTurn');
            }
            if (playerTurn == 'O') {
                document.getElementById('playerO').classList.add('currentTurn');
                document.getElementById('playerX').classList.remove('currentTurn');
            }
  
            return; // Exit the function
          }
  
          // Reset the simulated move
          gameArray[i].value = '';
          gameArray[i].written = false;
        }
      }
  
      // Choose a random available move if no winning or blocking moves found
      const availableMoves = gameArray.filter(square => !square.written);
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      const randomMove = availableMoves[randomIndex];
  
      // Update the game board and HTML element with the random move
      randomMove.value = player2Choice;
      randomMove.written = true;
  
      const randomSquare = document.getElementById(randomMove.position.toString());
      randomSquare.innerHTML = player2Choice;
      randomSquare.dataset.value = player2Choice;
      randomSquare.dataset.written = true;
      randomSquare.classList.remove('unwritten');
  
      // Check for a win after AI's turn
      controller.winChecker({ target: randomSquare });
      if (winReached || drawReached) {
        controller.winnerDetermined();
        return;
         };
  
      // Switch the player turn
    
      if (playerTurn == 'X') {
        document.getElementById('playerX').classList.remove('currentTurn');
        document.getElementById('playerO').classList.add('currentTurn');
        }
      if (playerTurn == 'O') {
            document.getElementById('playerO').classList.remove('currentTurn');
            document.getElementById('playerX').classList.add('currentTurn');
        }

      playerTurn = playerChoice;
      document.getElementById('currentPlayer').innerHTML = playerTurn === 'X' ? '<' : '>';

    };

    const takeTurn = () => {
        setTimeout(
            () => {
                if (resetting) {
                
                } else {
                    switch (true) {
                    case player2Difficulty === 0:
                        difficulty0();
                        break;
                    case player2Difficulty === 1:
                        difficulty1();
                        break;
                    case player2Difficulty === 2:
                        difficulty2();
                        break;
                    }
                }
            },

            1000
        )

    }
  
    // Function to check if a given move results in a win
    const isWinningMove = (player, array) => {
      const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
      ];
  
      for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (
          array[a].value === player &&
          array[b].value === player &&
          array[c].value === player
        ) {
          return true;
        }
      }
  
      return false;
    };
  
    return { takeTurn };
  })();

let playerChoice = '';
let player2Choice = '';
let player2Difficulty;
let playerTurn = 'X';
let winReached = false;
let drawReached = false;
let victor;
let resetting = false;
let versusAI;

// Initializing Stuff
gameBoard.generate();
controller.initialize();
controller.chooseMode();
