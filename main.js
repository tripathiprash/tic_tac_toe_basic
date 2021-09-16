const X= 'x';
const O = 'circle';

const cellElements = document.querySelectorAll(".cell");
const board = document.getElementById("board");
const Over = document.querySelector("#Over");
const Overinf = document.querySelector("#Overinf");
const resetButton = document.getElementById("resetButton");
const ChoiceForm = document.getElementById("playerChoices");
const Choices = { 
    person: {
        symbol: '',
        playsFirst: ''
    },
    friend: {
        symbol: '',
        playsFirst: ''
    }
}
const winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
] 
let Turn;
resetButton.addEventListener('click', initializeGame);

ChoiceForm.addEventListener('submit', initializeGame);

function initializeGame(e){
    
    e.preventDefault(); 
    window.scrollBy(0, 1000);
    const playerMode = ChoiceForm.elements.playerMode.value;

    Choices.person.symbol = ChoiceForm.elements.player1SymbolChoice.value;
    Choices.friend.symbol = Choices.person.symbol=='x' ? 'circle' : 'x';
    Choices.person.playsFirst = ChoiceForm.elements.whoFirst.value=='person' ? true : false;
    Choices.friend.playsFirst = ChoiceForm.elements.whoFirst.value=='friend' ? true : false;

    if (( Choices.person.playsFirst && Choices.person.symbol=='x') || (Choices.friend.playsFirst &&  Choices.person.symbol=='circle')){
        Turn = true;
    } else if ((Choices.friend.playsFirst && Choices.person.symbol=='x') || (Choices.person.playsFirst && Choices.person.symbol=='circle')){
        Turn = false;
    }
    console.log(Turn);

    clearBoard();
    if (playerMode==='twoPlayer'){
        twoPlayerStartGame();
    } else if (playerMode==='onePlayer'){
        onePlayerStartGame();
    }

}
function setBoardHoverClass(){   

    board.classList.remove(X);
    board.classList.remove(O);
    if (Turn){
        board.classList.add(X);
    } else {
        board.classList.add(O);
    }    

}

function placeMark(cell, classTurn){
    cell.classList.add(classTurn);
}
function switchTurn (){
    Turn = !Turn;
}
function handleClick(e){
    const cell = e.target;
    const classTurn = Turn? X : O;
    placeMark (cell, classTurn);

    if (checkWin(classTurn)){
        endGame(false);
    }  else if (isDraw()) {
        endGame(true);
    } else { 
    switchTurn ();
    setBoardHoverClass();
    }
}

function checkWin(classTurn) {
    for (combinations of winningCombinations){

        if ((cellElements[combinations[0]].classList.contains(classTurn)) && (cellElements[combinations[1]].classList.contains(classTurn)) && (cellElements[combinations[2]].classList.contains(classTurn))){
            console.log("yay! This works!")
            return true;
        }   
    
    }
    return false;

}

function isDraw(){
    for (const cell of cellElements) {
        
        if (!( cell.classList.contains(X) || cell.classList.contains(O))){
                return false;
        }
    }
    return true;

}

function endGame(draw){
    if (draw){
        Overinf.innerText = `Draw!`;
    } else{
        Overinf.innerText = `${Turn ? "X" : "O"} Wins!`;       
    }
    Over.classList.add('show');

}


function clearBoard(){

    board.classList.remove(X);
    board.classList.remove(O);

    for (const cell of cellElements) {
        cell.classList.remove(X);
        cell.classList.remove(O); 
        cell.removeEventListener('click', handleClick);       
    }

    Over.classList.remove('show');

}


function twoPlayerStartGame(){

    cellElements.forEach(cell => {
        cell.addEventListener('click', handleClick, {once:true})        
    })
    console.log(Turn)
    setBoardHoverClass();
}


function createBoardArray(){

    let boardArray = [];
    let tempArray = []

    for (let index = 0; index < cellElements.length; index++) {
        
        if (cellElements[index].classList.contains(X)){
            tempArray.push(X);

        } else if (cellElements[index].classList.contains(O)){
            tempArray.push(O);
        } else{
            tempArray.push('_');
        }


        if (index==2 || index==5 || index==8){
            boardArray.push(tempArray);
            tempArray = []; 
        }             
    
    }
    return boardArray;
}

function onePlayerStartGame(){
    
//used minimax algo

    if (Choices.friend.playsFirst){
        implementBestMove();
        switchTurn();
    } 


    cellElements.forEach(cell => {
        cell.addEventListener('click', onePlayerHandleClick, {once:true})        
    })
    setBoardHoverClass();
}

function onePlayerHandleClick(e){

    const cell = e.target;
    console.log(cell);
    const playerClass = Choices.person.symbol;
    placeMark (cell, playerClass);
    if (checkWin(playerClass)){
        endGame(false);
    }  else if (isDraw()) {
        endGame(true);
    } else { 
    switchTurn();
    implementBestMove();    
    switchTurn();
    setBoardHoverClass();
    } 


}

function implementBestMove(){

    let board = createBoardArray();
    let bestMove = findBestMove(board);
    console.log(bestMove.row, bestMove.col);
    let cellElementIndex = (3*(bestMove.row)+1)+ bestMove.col -1;
    let computerClass = Choices.friend.symbol
    cellElements[cellElementIndex].classList.add(computerClass);
    if (checkWin(computerClass)){
        endGame(false);
    }  else if (isDraw()) {
        endGame(true);
    }
}

class Move{
    constructor()
    {
        let row,col;
    }
}
 
function isMovesLeft(board){

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j]=='_'){
                return true;
            }
        }
    }
    return false;
}
function evaluateBoardConditions(b){
    for(let row = 0; row < 3; row++)
    {
        if (b[row][0] == b[row][1] &&
            b[row][1] == b[row][2])
        {
            if (b[row][0] == Choices.friend.symbol)
                return +10;
                    
            else if (b[row][0] == Choices.person.symbol)
                return -10;
        }
    }
    for(let col = 0; col < 3; col++)
    {
        if (b[0][col] == b[1][col] &&
            b[1][col] == b[2][col])
        {
            if (b[0][col] == Choices.friend.symbol)
                return +10;
    
            else if (b[0][col] == Choices.person.symbol)
                return -10;
        }
    }
    if (b[0][0] == b[1][1] && b[1][1] == b[2][2])
    {
        if (b[0][0] == Choices.friend.symbol)
            return +10;
                
        else if (b[0][0] == Choices.person.symbol)
            return -10;
    }  
    if (b[0][2] == b[1][1] &&
        b[1][1] == b[2][0])
    {
        if (b[0][2] == Choices.friend.symbol)
            return +10;               
        else if (b[0][2] == Choices.person.symbol)
            return -10;
    }
    return 0;
}
function minimax(board, depth, isMax)
{
    let score = evaluateBoardConditions(board);
    if (score == 10)
        return score;
    if (score == -10)
        return score;
    if (isMovesLeft(board) == false)
        return 0;
    if (isMax)
    {
        let best = -1000;
        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                if (board[i][j]=='_')//empty cell or not
                {
                    board[i][j] = Choices.friend.symbol;
                    best = Math.max(best, minimax(board,
                                    depth + 1, !isMax));
                    board[i][j] = '_';
                }
            }
        }
        return best;
    }
  

    else
    {
        let best = 1000;
        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                 
                if (board[i][j] == '_')
                {
                    board[i][j] = Choices.person.symbol; 
                    best = Math.min(best, minimax(board,
                                    depth + 1, !isMax));
                    board[i][j] = '_';
                }
            }
        }
        return best;
    }
}

function findBestMove(board)
{
    let bestVal = -1000;
    let bestMove = new Move();
    bestMove.row = -1;
    bestMove.col = -1;
    for(let i = 0; i < 3; i++)
    {
        for(let j = 0; j < 3; j++)
        {
            if (board[i][j] == '_')//empty cell or not
            {
                board[i][j] = Choices.friend.symbol;
                let moveVal = minimax(board, 0, false);
                board[i][j] = '_';
                if (moveVal > bestVal)
                {
                    bestMove.row = i;
                    bestMove.col = j;
                    bestVal = moveVal;
                }
            }
        }
    } 
    return bestMove;
}