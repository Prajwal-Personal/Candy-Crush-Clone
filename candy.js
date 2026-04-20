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

function explodeSpecialCandy(candy) {
    let coords = candy.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    if(candy.src.includes("Striped-Vertical")) {
        //pass
    }

    else if(candy.src.includes("Striped-Horizontal")) {
        //pass
    }

    else if(candy.src.includes("Wrapped")) {
        //pass
    }

    else if(candy.src.includes("choco")) {
        //pass
    }
}

function crush3() {
    for(let r=0 ; r<rows ; r++) {
        for(let c=0 ; c<cols-2 ; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if(getColor(candy1.src) == getColor(candy2.src) && 
             getColor(candy2.src) == getColor(candy3.src) &&
             !candy1.src.includes("blank")) {
                if(candy1.src.includes("Striped-Vertical") || candy1.src.includes("Striped-Horizontal") || candy1.src.includes("Wrapped") || candy1.src.includes("choco")) {
                    explodeSpecialCandy(candy1);
                }
                else candy1.src = "./images/blank.png";
                if(candy2.src.includes("Striped-Vertical") || candy2.src.includes("Striped-Horizontal") || candy2.src.includes("Wrapped") || candy2.src.includes("choco")) {
                    explodeSpecialCandy(candy2);
                }
                else candy2.src = "./images/blank.png";
                if(candy3.src.includes("Striped-Vertical") || candy3.src.includes("Striped-Horizontal") || candy3.src.includes("Wrapped") || candy3.src.includes("choco")) {
                    explodeSpecialCandy(candy3);
                }
                else candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }

    for(let c=0 ; c<cols ; c++) {
        for(let r=0 ; r<rows-2 ; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if(getColor(candy1.src) == getColor(candy2.src) && 
             getColor(candy2.src) == getColor(candy3.src) &&
             !candy1.src.includes("blank")) {
                if(candy1.src.includes("Striped-Vertical") || candy1.src.includes("Striped-Horizontal") || candy1.src.includes("Wrapped") || candy1.src.includes("choco")) {
                    explodeSpecialCandy(candy1);
                }
                else candy1.src = "./images/blank.png";
                if(candy2.src.includes("Striped-Vertical") || candy2.src.includes("Striped-Horizontal") || candy2.src.includes("Wrapped") || candy2.src.includes("choco")) {
                    explodeSpecialCandy(candy2);
                }
                else candy2.src = "./images/blank.png";
                if(candy3.src.includes("Striped-Vertical") || candy3.src.includes("Striped-Horizontal") || candy3.src.includes("Wrapped") || candy3.src.includes("choco")) {
                    explodeSpecialCandy(candy3);
                }
                else candy3.src = "./images/blank.png";
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
            if(getColor(candy1.src) == getColor(candy2.src) && 
            getColor(candy2.src) == getColor(candy3.src) &&
            getColor(candy3.src) == getColor(candy4.src) &&
             !candy1.src.includes("blank")) {
                let color = candy1.src.split("/").pop().split(".")[0];
                if(candy1.src.includes("Striped-Vertical") || candy1.src.includes("Striped-Horizontal") || candy1.src.includes("Wrapped") || candy1.src.includes("choco")) {
                    explodeSpecialCandy(candy1);
                }
                candy1.src = "./images/" + color + "-Striped-Vertical.png";
                if(candy2.src.includes("Striped-Vertical") || candy2.src.includes("Striped-Horizontal") || candy2.src.includes("Wrapped") || candy2.src.includes("choco")) {
                    explodeSpecialCandy(candy2);
                }
                else candy2.src = "./images/blank.png";
                if(candy3.src.includes("Striped-Vertical") || candy3.src.includes("Striped-Horizontal") || candy3.src.includes("Wrapped") || candy3.src.includes("choco")) {
                    explodeSpecialCandy(candy3);
                }
                else candy3.src = "./images/blank.png";
                if(candy4.src.includes("Striped-Vertical") || candy4.src.includes("Striped-Horizontal") || candy4.src.includes("Wrapped") || candy4.src.includes("choco")) {
                    explodeSpecialCandy(candy4);
                }
                else candy4.src = "./images/blank.png";
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
            if(getColor(candy1.src) == getColor(candy2.src) && 
            getColor(candy2.src) == getColor(candy3.src) &&
            getColor(candy3.src) == getColor(candy4.src) &&
             !candy1.src.includes("blank")) {
                let color = candy1.src.split("/").pop().split(".")[0];
                if(candy1.src.includes("Striped-Vertical") || candy1.src.includes("Striped-Horizontal") || candy1.src.includes("Wrapped") || candy1.src.includes("choco")) {
                    explodeSpecialCandy(candy1);
                }
                else candy1.src = "./images/blank.png";
                if(candy2.src.includes("Striped-Vertical") || candy2.src.includes("Striped-Horizontal") || candy2.src.includes("Wrapped") || candy2.src.includes("choco")) {
                    explodeSpecialCandy(candy2);
                }
                else candy2.src = "./images/blank.png";
                if(candy3.src.includes("Striped-Vertical") || candy3.src.includes("Striped-Horizontal") || candy3.src.includes("Wrapped") || candy3.src.includes("choco")) {
                    explodeSpecialCandy(candy3);
                }
                else candy3.src = "./images/blank.png";
                if(candy4.src.includes("Striped-Vertical") || candy4.src.includes("Striped-Horizontal") || candy4.src.includes("Wrapped") || candy4.src.includes("choco")) {
                    explodeSpecialCandy(candy4);
                }
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
            if(getColor(candy1.src) == getColor(candy2.src) && 
            getColor(candy2.src) == getColor(candy3.src) &&
            getColor(candy3.src) == getColor(candy4.src) &&
            getColor(candy4.src) == getColor(candy5.src) &&
            !candy1.src.includes("blank")) {
                let color = candy1.src.split("/").pop().split(".")[0];
                if(candy1.src.includes("Striped-Vertical") || candy1.src.includes("Striped-Horizontal") || candy1.src.includes("Wrapped") || candy1.src.includes("choco")) {
                    explodeSpecialCandy(candy1);
                }
                candy1.src = "./images/choco.png";
                if(candy2.src.includes("Striped-Vertical") || candy2.src.includes("Striped-Horizontal") || candy2.src.includes("Wrapped") || candy2.src.includes("choco")) {
                    explodeSpecialCandy(candy2);
                }
                else candy2.src = "./images/blank.png";
                if(candy3.src.includes("Striped-Vertical") || candy3.src.includes("Striped-Horizontal") || candy3.src.includes("Wrapped") || candy3.src.includes("choco")) {
                    explodeSpecialCandy(candy3);
                }
                else candy3.src = "./images/blank.png";
                if(candy4.src.includes("Striped-Vertical") || candy4.src.includes("Striped-Horizontal") || candy4.src.includes("Wrapped") || candy4.src.includes("choco")) {
                    explodeSpecialCandy(candy4);
                }
                else candy4.src = "./images/blank.png";
                if(candy5.src.includes("Striped-Vertical") || candy5.src.includes("Striped-Horizontal") || candy5.src.includes("Wrapped") || candy5.src.includes("choco")) {
                    explodeSpecialCandy(candy5);
                }
                else candy5.src = "./images/blank.png"
                score += 50;
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
            if(getColor(candy1.src) == getColor(candy2.src) && 
            getColor(candy2.src) == getColor(candy3.src) &&
            getColor(candy3.src) == getColor(candy4.src) &&
            getColor(candy4.src) == getColor(candy5.src) &&
            !candy1.src.includes("blank")) {
                let color = candy1.src.split("/").pop().split(".")[0];
                if(candy1.src.includes("Striped-Vertical") || candy1.src.includes("Striped-Horizontal") || candy1.src.includes("Wrapped") || candy1.src.includes("choco")) {
                    explodeSpecialCandy(candy1);
                }
                else candy1.src = "./images/blank.png";
                if(candy2.src.includes("Striped-Vertical") || candy2.src.includes("Striped-Horizontal") || candy2.src.includes("Wrapped") || candy2.src.includes("choco")) {
                    explodeSpecialCandy(candy2);
                }
                else candy2.src = "./images/blank.png";
                if(candy3.src.includes("Striped-Vertical") || candy3.src.includes("Striped-Horizontal") || candy3.src.includes("Wrapped") || candy3.src.includes("choco")) {
                    explodeSpecialCandy(candy3);
                }
                else candy3.src = "./images/blank.png";
                if(candy4.src.includes("Striped-Vertical") || candy4.src.includes("Striped-Horizontal") || candy4.src.includes("Wrapped") || candy4.src.includes("choco")) {
                    explodeSpecialCandy(candy4);
                }
                else candy4.src = "./images/blank.png";
                if(candy5.src.includes("Striped-Vertical") || candy5.src.includes("Striped-Horizontal") || candy5.src.includes("Wrapped") || candy5.src.includes("choco")) {
                    explodeSpecialCandy(candy5);
                }
                candy5.src = "./images/choco.png"
                score += 50;
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
            if(getColor(candy1.src) == getColor(candy2.src) &&
                getColor(candy2.src) == getColor(candy3.src) &&
                getColor(candy3.src) == getColor(candy4.src) &&
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
            if(getColor(candy1.src) == getColor(candy2.src) &&
                getColor(candy2.src) == getColor(candy3.src) &&
                getColor(candy3.src) == getColor(candy4.src) &&
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
            if(getColor(board[r][c].src) == getColor(board[r][c+1].src) &&
                getColor(board[r][c+1].src) == getColor(board[r][c+2].src) &&
                getColor(board[r+1][c].src) == getColor(board[r][c].src) &&
                getColor(board[r+2][c].src) == getColor(board[r][c].src) &&
                !board[r][c].src.includes("blank")
            ){
                return true;
            }
            
            if(getColor(board[r][c].src) == getColor(board[r+1][c].src) &&
                getColor(board[r+1][c].src) == getColor(board[r+2][c].src) &&
                getColor(board[r+1][c+1].src) == getColor(board[r][c].src) &&
                getColor(board[r+1][c+2].src) == getColor(board[r][c].src) &&
                !board[r][c].src.includes("blank")
            ){
                return true;
            }

            if(getColor(board[r][c].src) == getColor(board[r+1][c].src) &&
                getColor(board[r+1][c].src) == getColor(board[r+2][c].src) &&
                getColor(board[r+2][c+1].src) == getColor(board[r][c].src) &&
                getColor(board[r+2][c+2].src) == getColor(board[r][c].src) &&
                !board[r][c].src.includes("blank")
            ){
                return true;
            }

            if(getColor(board[r][c].src) == getColor(board[r][c+1].src) &&
                getColor(board[r][c].src) == getColor(board[r][c+2].src) &&
                getColor(board[r+1][c+2].src) == getColor(board[r][c].src) &&
                getColor(board[r+2][c+2].src) == getColor(board[r][c].src) &&
                !board[r][c].src.includes("blank")
            ){
                return true;
            }

            if(getColor(board[r+1][c].src) == getColor(board[r+1][c+1].src) &&
                getColor(board[r+1][c].src) == getColor(board[r+1][c+2].src) &&
                getColor(board[r+1][c].src) == getColor(board[r][c+2].src) &&
                getColor(board[r+1][c].src) == getColor(board[r+2][c+2].src) &&
                !board[r][c].src.includes("blank")
            ){
                return true;
            }

            if(getColor(board[r+2][c].src) == getColor(board[r+2][c+1].src) &&
                getColor(board[r+2][c].src) == getColor(board[r+2][c+2].src) &&
                getColor(board[r+2][c].src) == getColor(board[r][c+2].src) &&
                getColor(board[r+2][c].src) == getColor(board[r+1][c+2].src) &&
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
            if(getColor(candy1.src) == getColor(candy2.src) && 
                getColor(candy2.src) == getColor(candy3.src) && 
                getColor(candy3.src) == getColor(candy4.src) &&
                getColor(candy4.src) == getColor(candy5.src) && 
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
            if(getColor(candy1.src) == getColor(candy2.src) && 
                getColor(candy2.src) == getColor(candy3.src) && 
                getColor(candy3.src) == getColor(candy4.src) &&
                getColor(candy4.src) == getColor(candy5.src) && 
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
            if(getColor(candy1.src) == getColor(candy2.src) &&
                getColor(candy2.src) == getColor(candy3.src) &&
                !candy1.src.includes("blank")) {
                    return true;
            }
        }
    }

    for(let c=0 ; c<cols ; c++) {
        for(let r=0 ; r<rows-2 ; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if(getColor(candy1.src) == getColor(candy2.src) &&
                getColor(candy2.src) == getColor(candy3.src) &&
                !candy1.src.includes("blank")) {
                    return true;
            }
        }
    }

    return false;
}

function getColor(src) {
    let file = src.split("/").pop().split(".")[0]; // Blue-Striped-Vertical
    return file.split("-")[0]; // Blue
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
            if(getColor(board[r][c].src) == getColor(board[r][c+1].src) &&
                getColor(board[r][c+1].src) == getColor(board[r][c+2].src) &&
                getColor(board[r+1][c].src) == getColor(board[r][c].src) &&
                getColor(board[r+2][c].src) == getColor(board[r][c].src) &&
                !board[r][c].src.includes("blank")
            ){
                let color = board[r][c].src.split("/").pop().split(".")[0];
                if(board[r][c].src.includes("Striped-Vertical") || board[r][c].src.includes("Striped-Horizontal") || board[r][c].src.includes("Wrapped") || board[r][c].src.includes("choco")) {
                    explodeSpecialCandy(board[r][c]);
                }
                board[r][c].src = "./images/" + color + "-Wrapped.png";
                if(board[r][c+1].src.includes("Striped-Vertical") || board[r][c+1].src.includes("Striped-Horizontal") || board[r][c+1].src.includes("Wrapped") || board[r][c+1].src.includes("choco")) {
                    explodeSpecialCandy(board[r][c+1]);
                }
                else board[r][c+1].src = "./images/blank.png";
                if(board[r][c+2].src.includes("Striped-Vertical") || board[r][c+2].src.includes("Striped-Horizontal") || board[r][c+2].src.includes("Wrapped") || board[r][c+2].src.includes("choco")) {
                    explodeSpecialCandy(board[r][c+2]);
                }
                else board[r][c+2].src = "./images/blank.png";
                if(board[r+1][c].src.includes("Striped-Vertical") || board[r+1][c].src.includes("Striped-Horizontal") || board[r+1][c].src.includes("Wrapped") || board[r+1][c].src.includes("choco")) {
                    explodeSpecialCandy(board[r+1][c]);
                }
                else board[r+1][c].src = "./images/blank.png";
                if(board[r+2][c].src.includes("Striped-Vertical") || board[r+2][c].src.includes("Striped-Horizontal") || board[r+2][c].src.includes("Wrapped") || board[r+2][c].src.includes("choco")) {
                    explodeSpecialCandy(board[r+2][c]);
                }
                else board[r+2][c].src = "./images/blank.png";
                score += 100;
            }
            
            if(getColor(board[r][c].src) == getColor(board[r+1][c].src) &&
                getColor(board[r+1][c].src) == getColor(board[r+2][c].src) &&
                getColor(board[r+1][c+1].src) == getColor(board[r][c].src) &&
                getColor(board[r+1][c+2].src) == getColor(board[r][c].src) &&
                !board[r][c].src.includes("blank")
            ){
                let color = board[r+1][c].src.split("/").pop().split(".")[0];
                if(board[r][c].src.includes("Striped-Vertical") || board[r][c].src.includes("Striped-Horizontal") || board[r][c].src.includes("Wrapped") || board[r][c].src.includes("choco")) {
                    explodeSpecialCandy(board[r][c]);
                }
                else board[r][c].src = "./images/blank.png";
                if(board[r+1][c].src.includes("Striped-Vertical") || board[r+1][c].src.includes("Striped-Horizontal") || board[r+1][c].src.includes("Wrapped") || board[r+1][c].src.includes("choco")) {
                    explodeSpecialCandy(board[r+1][c]);
                }
                board[r+1][c].src = "./images/" + color + "-Wrapped.png";
                if(board[r+2][c].src.includes("Striped-Vertical") || board[r+2][c].src.includes("Striped-Horizontal") || board[r+2][c].src.includes("Wrapped") || board[r+2][c].src.includes("choco")) {
                    explodeSpecialCandy(board[r+2][c]);
                }
                else board[r+2][c].src = "./images/blank.png";
                if(board[r+1][c+1].src.includes("Striped-Vertical") || board[r+1][c+1].src.includes("Striped-Horizontal") || board[r+1][c+1].src.includes("Wrapped") || board[r+1][c+1].src.includes("choco")) {
                    explodeSpecialCandy(board[r+1][c+1]);
                }
                else board[r+1][c+1].src = "./images/blank.png";
                if(board[r+1][c+2].src.includes("Striped-Vertical") || board[r+1][c+2].src.includes("Striped-Horizontal") || board[r+1][c+2].src.includes("Wrapped") || board[r+1][c+2].src.includes("choco")) {
                    explodeSpecialCandy(board[r+1][c+2]);
                }
                else board[r+1][c+2].src = "./images/blank.png";
                score += 100;
            }

            if(board[r][c].src == board[r+1][c].src &&
                board[r+1][c].src == board[r+2][c].src &&
                board[r+2][c+1].src == board[r][c].src &&
                board[r+2][c+2].src == board[r][c].src &&
                !board[r][c].src.includes("blank")
            ){
                let color = board[r+2][c].src.split("/").pop().split(".")[0];
                if(board[r][c].src.includes("Striped-Vertical") || board[r][c].src.includes("Striped-Horizontal") || board[r][c].src.includes("Wrapped") || board[r][c].src.includes("choco")) {
                    explodeSpecialCandy(board[r][c]);
                }
                else board[r][c].src = "./images/blank.png";
                if(board[r+1][c].src.includes("Striped-Vertical") || board[r+1][c].src.includes("Striped-Horizontal") || board[r+1][c].src.includes("Wrapped") || board[r+1][c].src.includes("choco")) {
                    explodeSpecialCandy(board[r+1][c]);
                }
                else board[r+1][c].src = "./images/blank.png";
                if(board[r+2][c].src.includes("Striped-Vertical") || board[r+2][c].src.includes("Striped-Horizontal") || board[r+2][c].src.includes("Wrapped") || board[r+2][c].src.includes("choco")) {
                    explodeSpecialCandy(board[r+2][c]);
                }
                board[r+2][c].src = "./images/" + color + "-Wrapped.png";
                if(board[r+2][c+1].src.includes("Striped-Vertical") || board[r+2][c+1].src.includes("Striped-Horizontal") || board[r+2][c+1].src.includes("Wrapped") || board[r+2][c+1].src.includes("choco")) {
                    explodeSpecialCandy(board[r+2][c+1]);
                }
                else board[r+2][c+1].src = "./images/blank.png";
                if(board[r+2][c+2].src.includes("Striped-Vertical") || board[r+2][c+2].src.includes("Striped-Horizontal") || board[r+2][c+2].src.includes("Wrapped") || board[r+2][c+2].src.includes("choco")) {
                    explodeSpecialCandy(board[r+2][c+2]);
                }
                else board[r+2][c+2].src = "./images/blank.png";
                score += 100;
            }

            if(board[r][c].src == board[r][c+1].src &&
                board[r][c].src == board[r][c+2].src &&
                board[r+1][c+2].src == board[r][c].src &&
                board[r+2][c+2].src == board[r][c].src &&
                !board[r][c].src.includes("blank")
            ){
                let color = board[r][c+2].src.split("/").pop().split(".")[0];
                if(board[r][c+2].src.includes("Striped-Vertical") || board[r][c+2].src.includes("Striped-Horizontal") || board[r][c+2].src.includes("Wrapped") || board[r][c+2].src.includes("choco")) {
                    explodeSpecialCandy(board[r][c+2]);
                }
                board[r][c+2].src = "./images/" + color + "-Wrapped.png";
                if (board[r+1][c+2].src.includes("Striped-Vertical") || board[r+1][c+2].src.includes("Striped-Horizontal") || board[r+1][c+2].src.includes("Wrapped") || board[r+1][c+2].src.includes("choco")) {
                    explodeSpecialCandy(board[r+1][c+2]);
                }
                else board[r+1][c+2].src = "./images/blank.png";
                if (board[r+2][c+2].src.includes("Striped-Vertical") || board[r+2][c+2].src.includes("Striped-Horizontal") || board[r+2][c+2].src.includes("Wrapped") || board[r+2][c+2].src.includes("choco")) {
                    explodeSpecialCandy(board[r+2][c+2]);
                }
                else board[r+2][c+2].src = "./images/blank.png";
                if (board[r][c].src.includes("Striped-Vertical") || board[r][c].src.includes("Striped-Horizontal") || board[r][c].src.includes("Wrapped") || board[r][c].src.includes("choco")) {
                    explodeSpecialCandy(board[r][c]);
                }
                else board[r][c].src = "./images/blank.png";
                if (board[r][c+1].src.includes("Striped-Vertical") || board[r][c+1].src.includes("Striped-Horizontal") || board[r][c+1].src.includes("Wrapped") || board[r][c+1].src.includes("choco")) {
                    explodeSpecialCandy(board[r][c+1]);
                }
                else board[r][c+1].src = "./images/blank.png";
                score += 100;
            }

            if(board[r+1][c].src == board[r+1][c+1].src &&
                board[r+1][c].src == board[r+1][c+2].src &&
                board[r+1][c].src == board[r][c+2].src &&
                board[r+1][c].src == board[r+2][c+2].src &&
                !board[r][c].src.includes("blank")
            ){
                let color = board[r+1][c+2].src.split("/").pop().split(".")[0];
                if (board[r][c+2].src.includes("Striped-Vertical") || board[r][c+2].src.includes("Striped-Horizontal") || board[r][c+2].src.includes("Wrapped") || board[r][c+2].src.includes("choco")) {
                    explodeSpecialCandy(board[r][c+2]);
                }
                else board[r][c+2].src = "./images/blank.png";
                if (board[r+1][c+2].src.includes("Striped-Vertical") || board[r+1][c+2].src.includes("Striped-Horizontal") || board[r+1][c+2].src.includes("Wrapped") || board[r+1][c+2].src.includes("choco")) {
                    explodeSpecialCandy(board[r+1][c+2]);
                }
                else board[r+1][c+2].src = "./images/" + color + "-Wrapped.png";
                if (board[r+2][c+2].src.includes("Striped-Vertical") || board[r+2][c+2].src.includes("Striped-Horizontal") || board[r+2][c+2].src.includes("Wrapped") || board[r+2][c+2].src.includes("choco")) {
                    explodeSpecialCandy(board[r+2][c+2]);
                }
                else board[r+2][c+2].src = "./images/blank.png";
                if (board[r+1][c].src.includes("Striped-Vertical") || board[r+1][c].src.includes("Striped-Horizontal") || board[r+1][c].src.includes("Wrapped") || board[r+1][c].src.includes("choco")) {
                    explodeSpecialCandy(board[r+1][c]);
                }
                else board[r+1][c].src = "./images/blank.png";
                if (board[r+1][c+1].src.includes("Striped-Vertical") || board[r+1][c+1].src.includes("Striped-Horizontal") || board[r+1][c+1].src.includes("Wrapped") || board[r+1][c+1].src.includes("choco")) {
                    explodeSpecialCandy(board[r+1][c+1]);
                }
                else board[r+1][c+1].src = "./images/blank.png";
                score += 100;
            }

            if(board[r+2][c].src == board[r+2][c+1].src &&
                board[r+2][c].src == board[r+2][c+2].src &&
                board[r+2][c].src == board[r][c+2].src &&
                board[r+2][c].src == board[r+1][c+2].src &&
                !board[r][c].src.includes("blank")
            ){
                let color = board[r+2][c+2].src.split("/").pop().split(".")[0];
                if (board[r][c+2].src.includes("Striped-Vertical") || board[r][c+2].src.includes("Striped-Horizontal") || board[r][c+2].src.includes("Wrapped") || board[r][c+2].src.includes("choco")) {
                    explodeSpecialCandy(board[r][c+2]);
                }
                else board[r][c+2].src = "./images/blank.png";
                if (board[r+1][c+2].src.includes("Striped-Vertical") || board[r+1][c+2].src.includes("Striped-Horizontal") || board[r+1][c+2].src.includes("Wrapped") || board[r+1][c+2].src.includes("choco")) {
                    explodeSpecialCandy(board[r+1][c+2]);
                }
                else board[r+1][c+2].src = "./images/blank.png";
                if (board[r+2][c+2].src.includes("Striped-Vertical") || board[r+2][c+2].src.includes("Striped-Horizontal") || board[r+2][c+2].src.includes("Wrapped") || board[r+2][c+2].src.includes("choco")) {
                    explodeSpecialCandy(board[r+2][c+2]);
                }
                board[r+2][c+2].src = "./images/" + color + "-Wrapped.png";
                if (board[r+2][c].src.includes("Striped-Vertical") || board[r+2][c].src.includes("Striped-Horizontal") || board[r+2][c].src.includes("Wrapped") || board[r+2][c].src.includes("choco")) {
                    explodeSpecialCandy(board[r+2][c]);
                }
                else board[r+2][c].src = "./images/blank.png";
                if (board[r+2][c+1].src.includes("Striped-Vertical") || board[r+2][c+1].src.includes("Striped-Horizontal") || board[r+2][c+1].src.includes("Wrapped") || board[r+2][c+1].src.includes("choco")) {
                    explodeSpecialCandy(board[r+2][c+1]);
                }
                else board[r+2][c+1].src = "./images/blank.png";
                score += 100;
            }
        }
    }

    return false;
}