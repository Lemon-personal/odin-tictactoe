const gameboard = (() => {
    let boardContainer = document.querySelector(".board-container")
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

                    sElem.addEventListener("click",e => boardController.playRound(e.currentTarget.getAttribute("id")))

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

    const clearBoard = () => {
        for (let i = 0; i < 9; i++){
            boardSquares[i].querySelector("img").setAttribute("src", "");
        }
    }

    return {boardSquares, boardContainer, clearBoard, checkRow, checkColumn, checkDiagonal}

})();

const boardController = (()=>{
    let currPlayer
    let gamers

    const nextRound = (prevRoundWinner) => {
        currPlayer = prevRoundWinner
    }

    const playRound = (id) => {
        let row = id[0]
        let column = id[1]

        let playedSquare = gameboard.boardSquares[row][column]

        if (!playedSquare.played){
            playedSquare.played = true

            if (currPlayer.id == 1){
                playedSquare.sImg.setAttribute("src", "icons/close (1).svg")
                playedSquare.playerMark = "x"
                checkWin(row, column)
                currPlayer = gamers[1]
            }else{
                playedSquare.sImg.setAttribute("src", "icons/circle-outline.svg")
                playedSquare.playerMark = "o"
                checkWin(row, column)
                currPlayer = gamers[0]
            }
        }
    }


    const setPlayers = (players) => {
        currPlayer = players[0]
        gamers = players
    }


    function checkWin(row, column){
    
        if(gameboard.checkRow(row)){
            console.log(currPlayer)
            return true
        }
        if(gameboard.checkColumn(column)){
            console.log(currPlayer)
            return true
        }
        if (gameboard.checkDiagonal()){
            console.log(currPlayer)
            return true
        }

    }

    return {playRound, setPlayers}   
})();

const displayController = (() => {
    const mainMenu = document.querySelector(".main-menu")
    const game = document.querySelector(".board-container")
    const startGame = document.querySelector(".start-game")

    startGame.addEventListener("click", e => initGame())

    const initGame = () => {
        let menuInputs = document.querySelectorAll("input")
        let players = new Array()
        players.push(player(1, 'x', menuInputs[0].value))
        players.push(player(2,'o', menuInputs[1].value))

        menuInputs[0].invalid = true

        if(players[0].name === ""){
            players[0].name = "Player 1"
        }
        if(players[1].name === ""){
            players[1].name = "Player 2"
        }



        console.log(players)
    }


})();

const players = () => {
    let gamers = new Array()

    function player(id, mark){
        return {id, mark}
    }

    let player1 = player(1 , "x")
    gamers.push(player1)
    let player2 = player(2, "o")
    gamers.push(player2)




    return gamers
}

const player = (id, mark, name) => {
        return {id, mark, name}
}

let ps = players()

boardController.setPlayers(ps)


