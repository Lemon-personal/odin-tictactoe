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

                    sElem.addEventListener("click",(e) => {if (playable) {boardController.playRound(e.currentTarget.getAttribute("id"))}})

                    sElem.appendChild(sImg)
                    boardContainer.appendChild(sElem)

                    return {sElem, sImg, playerMark, played, sId}
                })();
                
                row.push(square)
            }
        
            squareArray.push(row)
        }
        
        console.log(squareArray)

        return squareArray;

    })();
    
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

    return {boardSquares, boardContainer, setPlayable, checkRow, checkColumn, checkDiagonal , resetBoard}

})();

const boardController = (()=>{
    let currPlayer
    let roundWinner
    let round = 1
    let players

    console.log(gameboard.boardSquares)

    const nextRound = (e) => {
        if (currPlayer.id == 1){
            currPlayer = players[1]
        }else{
            currPlayer = players[0]
        }

        round += 1
        displayController.displayResults(roundWinner, round, false)
        displayController.updateScoreboard(roundWinner, round)
    }

    const playRound = (id) => {
        let row = id[0]
        let column = id[1]
        let playerWon = false
        let playedSquare = gameboard.boardSquares[row][column]

        if (!playedSquare.played){
            playedSquare.played = true

            if (currPlayer.id == 1){
                playedSquare.sImg.setAttribute("src", "icons/close (1).svg")
                playedSquare.playerMark = "x"
                playerWon = checkWin(row, column)
            }else{
                playedSquare.sImg.setAttribute("src", "icons/circle-outline.svg")
                playedSquare.playerMark = "o"
                playerWon = checkWin(row, column)
            }
        }

        if (playerWon){
            roundWinner = currPlayer
            roundWinner.incrementPoints()
            displayController.displayResults(roundWinner, round, true)

            round = 0
            return;
        }

        if (currPlayer.id == 1){
            currPlayer = players[1]
        }else{
            currPlayer = players[0]
        }

        //displayController.updateScoreboard()

    }


    const setPlayers = (p) => {
        players = p
        currPlayer = players[0]
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

    return {playRound, setPlayers, nextRound}   
})();

const displayController = (() => {
    const mainMenu = document.querySelector(".main-menu")
    const game = document.querySelector(".game")
    const resultDiv = document.querySelector(".results")
    const scoreBoard = document.querySelector(".scoreboard")
    const startGame = document.querySelector(".start-game")

    startGame.addEventListener("click", e => initGame())

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

        boardController.setPlayers(players)

        mainMenu.classList.add("disabled")
        game.classList.remove("disabled")


        console.log(players)
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

            resultDiv.querySelector("h1").textContent = `ROUND ${round} WINNER`
            resultDiv.querySelector("h3").textContent = `${player.name}`.toUpperCase()
        }else{
            gameboard.setPlayable(true)
            setTimeout(()=>resultDiv.style.transform = 'translateY(300%)', 20)
        }
    }

    const updateScoreboard = (player, round) => {

        if (Number(player.id) === 1){
            scoreBoard.querySelector(".player1-score .score").textContent = `${player.getPoints()}`
        }
        else{
            scoreBoard.querySelector(".player2-score .score").textContent = `${player.getPoints()}`
        }
    }

    return {displayResults, updateScoreboard}
})();

const players = () => {
    let gamers = new Array()

    let player1 = player(1 , "x", "player1")
    gamers.push(player1)
    let player2 = player(2, "o", "player")
    gamers.push(player2)


    return gamers
}

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

let ps = players()

boardController.setPlayers(ps)


const reset = document.querySelector(".continue")
reset.addEventListener('click', e => gameboard.resetBoard())