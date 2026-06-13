const gameboard = (() => {
    let boardSquares = (()=>{
        let boardContainer = document.querySelector(".board-container")
        let squareArray = new Array()

        for (let i = 0; i < 9; i++){
            let square = (() => { 

                let sElem = document.createElement("div")
                let sImg = document.createElement("img")
                let played = false

                sElem.setAttribute("id", `${i}`)
                sElem.addEventListener("click",e => boardController.playMark(e.currentTarget))

                sElem.appendChild(sImg)
                boardContainer.appendChild(sElem)


                return {sElem, played}
            })();
        
            squareArray.push(square)
        }
        
        return squareArray;

    })();
    
    const clearBoard = () => {
        for (let i = 0; i < 9; i++){
            boardSquares[i].querySelector("img").setAttribute("src", "");
        }
    }

    const test = () => {
        console.log("peepee")
    }


    return {boardSquares, clearBoard}

})();

const boardController = (()=>{
    let currPlayer = 2

    const playMark = (square) => {
        let playedSquare = gameboard.boardSquares[square.getAttribute("id")]
        if (!playedSquare.played){
            playedSquare.played = true

            playedSquare.sElem.style.backgroundColor = currPlayer == 1 ? "black": "purple" 
        }
    }

    return {playMark}
})();

gameboard.test()