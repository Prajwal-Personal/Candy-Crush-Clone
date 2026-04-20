var candies = ["Blue","Orange","Green","Yellow","Red","Purple"];
var rows = 9;
var cols = 9;
var board = [];
var score = 0;

var currTile;
var otherTile;

window.onload = function() {
    startGame();

    window.setInterval(function() {
        crushCandy();
        setTimeout(function() {
            gravity();
        }, 400);
    } , 600); 
}

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

function startGame() {
    for(let r=0 ; r<rows ; r++) {
        let row = [];
        for(let c=0; c<cols ; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString()+"-"+c.toString();
            tile.src = "./images/" + randomCandy() + ".png";

            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);  

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}

function dragStart() {
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    otherTile = this;
}

function dragEnd() {
    if (!currTile || !otherTile) return;
    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) return;

    let currCoords = currTile.id.split("-");
    let r1 = parseInt(currCoords[0]);
    let c1 = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = c2 == c1-1 && r2 == r1;
    let moveRight = c2 == c1+1 && r2 == r1;
    let moveUp = r2 == r1-1 && c2 == c1;
    let moveDown = r2 == r1+1 && c2 == c1;
    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if(!isAdjacent) return;

    let currImg = currTile.src;
    let otherImg = otherTile.src;
    let isBombSwap = currImg.includes("choco") || otherImg.includes("choco");
    currTile.src = otherImg;
    otherTile.src = currImg;

    let validMove = false;

    if(isBombSwap) {
        crush2(currImg, otherImg);
        currTile.src = "./images/blank.png";
        otherTile.src = "./images/blank.png";
        validMove = true;
    }

    if(checkCrush5_bomb()) {
        crush5_bomb();
        validMove = true;
    }

    if(checkCrush5_wrapped()) {
        crush5_wrapped();
        validMove = true;
    }

    if(checkCrush4()) {
        crush4();
        validMove = true;
    }

    if(checkCrush3()) {
        crush3();
        validMove = true;
    }

    if(!validMove) {
        currTile.src = currImg;
        otherTile.src = otherImg;
    }

    currTile = null;
    otherTile = null;
}

function crush2(currImg, otherImg) {
    if(!(currImg.includes("choco") || otherImg.includes("choco"))) return;
    if(currImg.includes("choco") && otherImg.includes("choco")) {
        boardReset();
        return;
    }
    let targetColor;

    if(currImg.includes("choco")) targetColor = otherImg;
    else targetColor = currImg;

    for(let r=0; r<rows; r++) {
        for(let c=0; c<cols; c++) {
            if(board[r][c].src == targetColor) {
                board[r][c].src = "./images/blank.png";
                score += 20;
            }
        }
    }
}

function boardReset() {
    for(let r=0; r<rows; r++) {
        for(let c=0; c<cols; c++) {
            board[r][c].src = "./images/" + randomCandy() + ".png";
        }
    }
}

function crushCandy() {
    crush5_bomb();
    crush5_wrapped();
    crush4();
    crush3();
    document.getElementById("score").innerText = score;
}

function crush3() {
    for(let r=0 ; r<rows ; r++) {
        for(let c=0 ; c<cols-2 ; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if(candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
            }
            
        }
    }

    for(let c=0 ; c<cols ; c++) {
        for(let r=0 ; r<rows-2 ; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if(candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }
}

function crush4() {
    for(let r=0 ; r<rows ; r++) {
        for(let c=0 ; c<cols-3 ; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            let candy4 = board[r][c+3];
            if(candy1.src == candy2.src && 
                candy2.src == candy3.src && 
                candy3.src == candy4.src &&
                !candy1.src.includes("blank")) 
                {
                    let color = candy1.src.split("/").pop().split(".")[0];
                    candy1.src = "./images/" + color + "-Striped-Vertical.png";
                    candy2.src = "./images/blank.png";
                    candy3.src = "./images/blank.png";
                    candy4.src = "./images/blank.png";                   
                    score += 50;
                }
            
        }
    }

    for(let c=0 ; c<cols ; c++) {
        for(let r=0 ; r<rows-3 ; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            let candy4 = board[r+3][c];
            if(candy1.src == candy2.src && 
                candy2.src == candy3.src && 
                candy3.src == candy4.src &&
                !candy1.src.includes("blank")) 
                {
                    let color = candy1.src.split("/").pop().split(".")[0];
                    candy1.src = "./images/blank.png";
                    candy2.src = "./images/blank.png";
                    candy3.src = "./images/blank.png";
                    candy4.src = "./images/" + color + "-Striped-Horizontal.png";
                    score += 50;
                }
        }
    }
}

function crush5_bomb() {

    for(let r=0 ; r<rows ; r++) {
        for(let c=0 ; c<cols-4 ; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            let candy4 = board[r][c+3];
            let candy5 = board[r][c+4];
            if(candy1.src == candy2.src && 
                candy2.src == candy3.src && 
                candy3.src == candy4.src &&
                candy4.src == candy5.src &&
                !candy1.src.includes("blank")) 
                {
                    candy1.src = "./images/choco.png";
                    candy2.src = "./images/blank.png";
                    candy3.src = "./images/blank.png";
                    candy4.src = "./images/blank.png";      
                    candy5.src = "./images/blank.png";             
                    score += 80;
                }
            
        }
    }

    for(let c=0 ; c<cols ; c++) {
        for(let r=0 ; r<rows-4 ; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            let candy4 = board[r+3][c];
            let candy5 = board[r+4][c];
            if(candy1.src == candy2.src && 
                candy2.src == candy3.src && 
                candy3.src == candy4.src &&
                candy4.src == candy5.src &&
                !candy1.src.includes("blank")) 
                {
                    candy1.src = "./images/blank.png";
                    candy2.src = "./images/blank.png";
                    candy3.src = "./images/blank.png";
                    candy4.src = "./images/blank.png";
                    candy5.src = "./images/choco.png";
                    score += 80;
                }
        }
    }
}

function checkCrush4() {
    for(let r=0 ; r<rows ; r++) {
        for(let c=0 ; c<cols-3 ; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            let candy4 = board[r][c+3];
            if(candy1.src == candy2.src && 
                candy2.src == candy3.src && 
                candy3.src == candy4.src &&
                !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    for(let c=0 ; c<cols ; c++) {
        for(let r=0 ; r<rows-3 ; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            let candy4 = board[r+3][c];
            if(candy1.src == candy2.src && 
                candy2.src == candy3.src && 
                candy3.src == candy4.src &&
                !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    return false;
}

function checkCrush5_wrapped() {

    for(let r=0 ; r<rows-2 ; r++) {
        for(let c=0 ; c<cols-2 ; c++) {
            if(board[r][c].src == board[r][c+1].src &&
                board[r][c+1].src == board[r][c+2].src &&
                board[r+1][c].src == board[r][c].src &&
                board[r+2][c].src == board[r][c].src &&
                !board[r][c].src.includes("blank")
            ){
                return true;
            }
            
            if(board[r][c].src == board[r+1][c].src &&
                board[r+1][c].src == board[r+2][c].src &&
                board[r+1][c+1].src == board[r][c].src &&
                board[r+1][c+2].src == board[r][c].src &&
                !board[r][c].src.includes("blank")
            ){
                return true;
            }

            if(board[r][c].src == board[r+1][c].src &&
                board[r+1][c].src == board[r+2][c].src &&
                board[r+2][c+1].src == board[r][c].src &&
                board[r+2][c+2].src == board[r][c].src &&
                !board[r][c].src.includes("blank")
            ){
                return true;
            }

            if(board[r][c].src == board[r][c+1].src &&
                board[r][c].src == board[r][c+2].src &&
                board[r+1][c+2].src == board[r][c].src &&
                board[r+2][c+2].src == board[r][c].src &&
                !board[r][c].src.includes("blank")
            ){
                return true;
            }

            if(board[r+1][c].src == board[r+1][c+1].src &&
                board[r+1][c].src == board[r+1][c+2].src &&
                board[r+1][c].src == board[r][c+2].src &&
                board[r+1][c].src == board[r+2][c+2].src &&
                !board[r][c].src.includes("blank")
            ){
                return true;
            }

            if(board[r+2][c].src == board[r+2][c+1].src &&
                board[r+2][c].src == board[r+2][c+2].src &&
                board[r+2][c].src == board[r][c+2].src &&
                board[r+2][c].src == board[r+1][c+2].src &&
                !board[r][c].src.includes("blank")
            ){
                return true;
            }
        }
    }

    return false;
}

function checkCrush5_bomb() {
    for(let r=0 ; r<rows ; r++) {
        for(let c=0 ; c<cols-4 ; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            let candy4 = board[r][c+3];
            let candy5 = board[r][c+4];
            if(candy1.src == candy2.src && 
                candy2.src == candy3.src && 
                candy3.src == candy4.src &&
                candy4.src == candy5.src && 
                !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    for(let c=0 ; c<cols ; c++) {
        for(let r=0 ; r<rows-4 ; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            let candy4 = board[r+3][c];
            let candy5 = board[r+4][c];
            if(candy1.src == candy2.src && 
                candy2.src == candy3.src && 
                candy3.src == candy4.src &&
                candy4.src == candy5.src && 
                !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    return false;
}

function checkCrush3() {
    for(let r=0 ; r<rows ; r++) {
        for(let c=0 ; c<cols-2 ; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if(candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    for(let c=0 ; c<cols ; c++) {
        for(let r=0 ; r<rows-2 ; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if(candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    return false;
}

function gravity() {
    for(let c=0 ; c<cols ; c++) {

        for(let row=0 ; row<rows ; row++) {
            if(board[row][c].src.includes("blank")) {
                for (let temp=row ; temp>0 ; temp--) {
                    board[temp][c].src = board[temp-1][c].src;
                    board[temp][c].style.transition = "all 0.3s ease";
                }
                board[0][c].src = "./images/" + randomCandy() + ".png";
            }
        }

    }
}

function crush5_wrapped() {

    for(let r=0 ; r<rows-2 ; r++) {
        for(let c=0 ; c<cols-2 ; c++) {
            if(board[r][c].src == board[r][c+1].src &&
                board[r][c+1].src == board[r][c+2].src &&
                board[r+1][c].src == board[r][c].src &&
                board[r+2][c].src == board[r][c].src &&
                !board[r][c].src.includes("blank")
            ){
                let color = board[r][c].src.split("/").pop().split(".")[0];
                board[r][c].src = "./images/" + color + "-Wrapped.png";
                board[r][c+1].src = "./images/blank.png";
                board[r][c+2].src = "./images/blank.png";
                board[r+1][c].src = "./images/blank.png";
                board[r+2][c].src = "./images/blank.png";
                score += 100;
            }
            
            if(board[r][c].src == board[r+1][c].src &&
                board[r+1][c].src == board[r+2][c].src &&
                board[r+1][c+1].src == board[r][c].src &&
                board[r+1][c+2].src == board[r][c].src &&
                !board[r][c].src.includes("blank")
            ){
                let color = board[r+1][c].src.split("/").pop().split(".")[0];
                board[r][c].src = "./images/blank.png"
                board[r+1][c].src = "./images/" + color + "-Wrapped.png";
                board[r+2][c].src = "./images/blank.png";
                board[r+1][c+1].src = "./images/blank.png"
                board[r+1][c+2].src = "./images/blank.png";
                score += 100;
            }

            if(board[r][c].src == board[r+1][c].src &&
                board[r+1][c].src == board[r+2][c].src &&
                board[r+2][c+1].src == board[r][c].src &&
                board[r+2][c+2].src == board[r][c].src &&
                !board[r][c].src.includes("blank")
            ){
                let color = board[r+2][c].src.split("/").pop().split(".")[0];
                board[r][c].src = "./images/blank.png"
                board[r+1][c].src = "./images/blank.png";
                board[r+2][c].src = "./images/" + color + "-Wrapped.png";
                board[r+2][c+1].src = "./images/blank.png"
                board[r+2][c+2].src = "./images/blank.png";
                score += 100;
            }

            if(board[r][c].src == board[r][c+1].src &&
                board[r][c].src == board[r][c+2].src &&
                board[r+1][c+2].src == board[r][c].src &&
                board[r+2][c+2].src == board[r][c].src &&
                !board[r][c].src.includes("blank")
            ){
                let color = board[r][c+2].src.split("/").pop().split(".")[0];
                board[r][c+2].src = "./images/" + color + "-Wrapped.png";
                board[r+1][c+2].src = "./images/blank.png";
                board[r+2][c+2].src = "./images/blank.png";
                board[r][c].src = "./images/blank.png"
                board[r][c+1].src = "./images/blank.png";
                score += 100;
            }

            if(board[r+1][c].src == board[r+1][c+1].src &&
                board[r+1][c].src == board[r+1][c+2].src &&
                board[r+1][c].src == board[r][c+2].src &&
                board[r+1][c].src == board[r+2][c+2].src &&
                !board[r][c].src.includes("blank")
            ){
                let color = board[r+1][c+2].src.split("/").pop().split(".")[0];
                board[r][c+2].src = "./images/blank.png"
                board[r+1][c+2].src = "./images/" + color + "-Wrapped.png";
                board[r+2][c+2].src = "./images/blank.png";
                board[r+1][c].src = "./images/blank.png"
                board[r+1][c+1].src = "./images/blank.png";
                score += 100;
            }

            if(board[r+2][c].src == board[r+2][c+1].src &&
                board[r+2][c].src == board[r+2][c+2].src &&
                board[r+2][c].src == board[r][c+2].src &&
                board[r+2][c].src == board[r+1][c+2].src &&
                !board[r][c].src.includes("blank")
            ){
                let color = board[r+2][c+2].src.split("/").pop().split(".")[0];
                board[r][c+2].src = "./images/blank.png"
                board[r+1][c+2].src = "./images/blank.png";
                board[r+2][c+2].src = "./images/" + color + "-Wrapped.png";
                board[r+2][c].src = "./images/blank.png"
                board[r+2][c+1].src = "./images/blank.png";
                score += 100;
            }
        }
    }

    return false;
}