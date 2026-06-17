const gameboard = (() => {
    let boardContainer = document.querySelector(".board-container")
    let playable = true

    let boardSquares = (()=>{
        let squareArray = new Array()

        for (let i = 0; i < 3; i++){
            let row = new Array()
            for (let j = 0; j < 3; j++){

                let square = (() => { 

                    let sElem = document.createElement("div")
                    let sImg = document.createElement("img")
                    let playerMark = ""
                    let played = false
                    let sId = `${i}${j}`

                    sElem.setAttribute("id", `${i}${j}`)
                    sElem.addEventListener("mouseover", (e) => {if (playable && !square.played) {gameboard.setHighlightSquare(square, true)}})
                    sElem.addEventListener("mouseout", (e) => {if (playable && !square.played) {gameboard.setHighlightSquare(square, false)}})
                    sElem.addEventListener("click",(e) => {if (playable) {boardController.playRound(square)}})

                    sElem.appendChild(sImg)
                    boardContainer.appendChild(sElem)

                    return {sElem, sImg, playerMark, played, sId}
                })();
                
                row.push(square)
            }
        
            squareArray.push(row)
        }
        
        return squareArray;

    })();
    
    const setHighlightSquare = (square, state) => {
        
        if (state){

            if (boardController.getCurrPlayer().id == 1){
                square.sImg.setAttribute("src", "icons/close (1).svg")
                square.sImg.style.opacity = "0.5"
            }else{
                square.sImg.setAttribute("src", "icons/circle-outline.svg")
                square.sImg.style.opacity = "0.5"
            }

        }else{
            square.sImg.setAttribute("src", "")
        }
    }   

    const checkRow = (r) => {
        if(boardSquares[r][0].playerMark === boardSquares[r][1].playerMark && boardSquares[r][1].playerMark === boardSquares[r][2].playerMark){
            return true
        }
        return false
    }

    const checkColumn = (c) => {
        if(boardSquares[0][c].playerMark === boardSquares[1][c].playerMark && boardSquares[1][c].playerMark === boardSquares[2][c].playerMark){
            return true
        }
        return false
    }

    const checkDiagonal = () => {
        if (boardSquares[1][1].played){
            if((boardSquares[0][0].playerMark === boardSquares[1][1].playerMark && boardSquares[1][1].playerMark === boardSquares[2][2].playerMark)
                || boardSquares[0][2].playerMark === boardSquares[1][1].playerMark && boardSquares[1][1].playerMark === boardSquares[2][0].playerMark){

                return true

            }
        }
        return false
    }

    const resetBoard = () => {
        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                boardSquares[i][j].played = false
                boardSquares[i][j].sImg.setAttribute("src", "")
                boardSquares[i][j].playerMark = ""
            }
        }
    }

    const setPlayable = (p) => {
        playable = p
    }

    return {boardSquares, boardContainer, setPlayable, checkRow, checkColumn, checkDiagonal, setHighlightSquare, resetBoard}

})();

const boardController = (()=>{
    let currPlayer
    let roundWinner
    let round = 1
    let turn = 0
    let players

    const nextRound = (e) => {

        console.log(currPlayer)

        if (currPlayer.id == 1){
            currPlayer = players[1]
        }else{
            currPlayer = players[0]
        }

        round += 1

        gameboard.resetBoard()
        displayController.updateScoreboard(currPlayer, round)
        displayController.displayResults(roundWinner, round, false) 
    }

    const playRound = (playedSquare) => {
        let row = playedSquare.sId[0]
        let column = playedSquare.sId[1]
        let playerWon = false

        if (!playedSquare.played){
            turn += 1
            playedSquare.played = true

            if (currPlayer.id == 1){
                playedSquare.sImg.style.opacity = "1"
                playedSquare.playerMark = "x"
                playerWon = checkWin(row, column)
            }else{
                playedSquare.sImg.style.opacity = "1"
                playedSquare.playerMark = "o"
                playerWon = checkWin(row, column)
            }
        }

        if (playerWon){
            roundWinner = currPlayer
            roundWinner.incrementPoints()
            displayController.displayResults(roundWinner, round, true)
            displayController.setScore(roundWinner, 0)
            return;
        }

        if (turn === 9){
            displayController.displayResults(undefined, round, true)
        }

        if (currPlayer.id == 1){
            currPlayer = players[1]
        }else{
            currPlayer = players[0]
        }

        displayController.updateScoreboard(currPlayer, 0)

    }


    const setPlayers = (p) => {
        players = p
        currPlayer = players[0]
    }

    const reset = () => {
        players = new Array()
        currPlayer = undefined
        roundWinner = undefined
        round = 1
        turn = 0
    }

    const getRound = () => {
        return round
    }

    const getCurrPlayer = () => {
        return currPlayer
    }

    function checkWin(row, column){
    
        if(gameboard.checkRow(row)){
            return true
        }
        if(gameboard.checkColumn(column)){
            return true
        }
        if (gameboard.checkDiagonal()){
            return true
        }

    }

    return {getRound, getCurrPlayer, playRound, setPlayers, reset, nextRound}   
})();

const displayController = (() => {
    const mainMenu = document.querySelector(".main-menu")
    const game = document.querySelector(".game")
    const resultDiv = document.querySelector(".results")
    const scoreBoard = document.querySelector(".scoreboard")
    const startButton = document.querySelector(".start-game")
    const quitButton  = document.querySelector(".quit")


    quitButton.addEventListener("click", e => quitGame())
    startButton.addEventListener("click", e => initGame())

    const initGame = () => {
        let menuInputs = document.querySelectorAll("input")
        let players = new Array()
        players.push(player(1, 'x', menuInputs[0].value))
        players.push(player(2,'o', menuInputs[1].value))

        if(players[0].name === ""){
            players[0].name = "Player 1"
        }
        if(players[1].name === ""){
            players[1].name = "Player 2"
        }

        document.querySelector(".player1-score .name").textContent = players[0].name
        document.querySelector(".player2-score .name").textContent = players[1].name
    

        boardController.setPlayers(players)
        gameboard.setPlayable(true)

        mainMenu.classList.add("disabled")
        game.classList.remove("disabled")


        console.log(players)
    }

    const quitGame = () => {
        gameboard.resetBoard()
        boardController.reset()
        displayController.resetScoreBoard()
        mainMenu.classList.toggle("disabled")
        game.classList.toggle("disabled")
        resultDiv.style.transform = 'translateY(-300%)'
    }

    const initResultDiv = (() => {
        const quitButton = resultDiv.querySelector(".quit")
        const continueButton = resultDiv.querySelector(".continue")

        resultDiv.style.transform = 'translateY(-300%)'

        continueButton.addEventListener("click", boardController.nextRound)
    })();

    const displayResults = (player, round, state) => {
        if (state){
            gameboard.setPlayable(false)
            resultDiv.classList.remove("disabled")
            setTimeout(()=>resultDiv.style.transform = 'translateY(0%)', 20)

            if (player){
                resultDiv.querySelector("h1").textContent = `ROUND ${boardController.getRound()} WINNER`
                resultDiv.querySelector("h3").textContent = `${player.name}`.toUpperCase()
            }else{
                resultDiv.querySelector("h1").textContent = `ROUND ${boardController.getRound()}`
                resultDiv.querySelector("h3").textContent = `TIE`
            }
        }else{
            gameboard.setPlayable(true)
            setTimeout(()=>resultDiv.style.transform = 'translateY(-300%)', 20)
        }
    }

    const updateScoreboard = (player, round) => {

            scoreBoard.querySelector(".player1-score").classList.toggle("turn")
            scoreBoard.querySelector(".player2-score").classList.toggle("turn")

        if (Number(player.id) === 1){
            scoreBoard.querySelector(".turn-arrow").style.transform = 'rotateZ(0deg)'
        }
        else{
            scoreBoard.querySelector(".turn-arrow").style.transform = 'rotateZ(180deg)'
        }

    }

    const setScore = (player) =>{
        Number(player.id) === 1 ? scoreBoard.querySelector(".player1-score .score").textContent = `${player.getPoints()}`:
        scoreBoard.querySelector(".player2-score .score").textContent = `${player.getPoints()}`
    }

    const resetScoreBoard = () => {
        scoreBoard.querySelector(".player2-score .score").textContent = `0`
        scoreBoard.querySelector(".player1-score .score").textContent = `0`
        scoreBoard.querySelector(".turn-arrow").style.transform = 'rotateZ(0deg)'
        scoreBoard.querySelector(".player1-score").classList.toggle("turn")
        scoreBoard.querySelector(".player2-score").classList.toggle("turn")
    }

    return {setScore, resetScoreBoard, displayResults, updateScoreboard}
})();


const player = (id, mark, name) => {
    let points = 0

    const incrementPoints = () => {
        points += 1
    }

    const getPoints = () => {
        return points
    }

    return {id, mark, name, incrementPoints, getPoints}
}
