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
    let special1 = currImg.includes("Striped") || currImg.includes("Wrapped");
    let special2 = otherImg.includes("Striped") || otherImg.includes("Wrapped");
    let specialBomb = (currImg.includes("choco") && (otherImg.includes("Striped") || otherImg.includes("Wrapped"))) || (otherImg.includes("choco") && (currImg.includes("Striped") || currImg.includes("Wrapped")));
    currTile.src = otherImg;
    otherTile.src = currImg;

    let validMove = false;

    if(isBombSwap || specialBomb || (special1 && special2)) {
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
    if(currImg.includes("choco") && otherImg.includes("choco")) {
        score += 500;
        boardReset();
        return;
    }

    if(currImg.includes("choco")) {
        let targetColor = getColor(otherImg)

        if(otherImg.includes("Striped")) {
            let choices = ["Striped-Vertical", "Striped-Horizontal"];
            for(let r=0 ; r<rows ; r++) {
                for(let c=0 ; c<cols ; c++) {
                    if(board[r][c].src.includes(targetColor)){
                        board[r][c].src = "./images/" + targetColor + "-" + choices[Math.floor(Math.random() * choices.length)] + ".png";
                    }
                }
            }
            for(let r=0; r<rows; r++) {
                for(let c=0; c<cols; c++) {
                    if(board[r][c].src.includes(targetColor)) {
                        explodeSpecialCandy(board[r][c]);
                    }
                }
            }
        }

        else if (otherImg.includes("Wrapped")) {
            for (let r=0 ; r<rows ; r++){
                for(let c=0 ; c<cols ; c++) {
                    if(board[r][c].src.includes(targetColor)){
                        board[r][c].src = "./images/" + targetColor + "-Wrapped.png";
                    }
                }
            }
            for(let r=0; r<rows; r++) {
                for(let c=0; c<cols; c++) {
                    if(board[r][c].src.includes(targetColor)) {
                        explodeSpecialCandy(board[r][c]);
                    }
                }
            }
        }

        else{
            for(let r=0; r<rows; r++) {
                for(let c=0; c<cols; c++) {
                    if(board[r][c].src.includes(targetColor)) {
                        board[r][c].src = "./images/blank.png";
                        score += 200;
                    }
                }
            }
        }
    }

    if(otherImg.includes("choco")) {
        let targetColor = getColor(currImg);

        if(currImg.includes("Striped")){
            let choices = ["Striped-Vertical", "Striped-Horizontal"];
            for(let r=0 ; r<rows ; r++) {
                for(let c=0 ; c<cols ; c++) {
                    if(board[r][c].src.includes(targetColor)){
                        board[r][c].src = "./images/" + targetColor + "-" + choices[Math.floor(Math.random() * choices.length)] + ".png";
                    }
                }
            }
            for(let r=0; r<rows; r++) {
                for(let c=0; c<cols; c++) {
                    if(board[r][c].src.includes(targetColor)) {
                        explodeSpecialCandy(board[r][c]);
                    }
                }
            }
        }

        else if(currImg.includes("Wrapped")) {
            for (let r=0 ; r<rows ; r++){
                for(let c=0 ; c<cols ; c++) {
                    if(board[r][c].src.includes(targetColor)){
                        board[r][c].src = "./images/" + targetColor + "-Wrapped.png";
                    }
                }
            }
            for(let r=0; r<rows; r++) {
                for(let c=0; c<cols; c++) {
                    if(board[r][c].src.includes(targetColor)) {
                        explodeSpecialCandy(board[r][c]);
                    }
                }
            }
        }

        else{
            for(let r=0; r<rows; r++) {
                for(let c=0; c<cols; c++) {
                    if(board[r][c].src.includes(targetColor)) {
                        board[r][c].src = "./images/blank.png";
                        score += 200;
                    }
                }
            }
        }
    }

    if(currImg.includes("Wrapped") && otherImg.includes("Wrapped")){
        let r = parseInt(otherTile.id.split("-")[0]);
        let c = parseInt(otherTile.id.split("-")[1]);
        for(let i = Math.max(0, r-2); i <= Math.min(r+2, 8); i++) {
            for(let j = Math.max(0, c-2); j <= Math.min(c+2, 8); j++) {
                let target = board[i][j];
                if(target.src.includes("blank")) continue;
                if(target.src.includes("Striped-Vertical") || target.src.includes("Striped-Horizontal") || target.src.includes("Wrapped") || target.src.includes("choco")) {
                    explodeSpecialCandy(target);
                } else {
                    target.src = "./images/blank.png";
                    score += 20;
                }
            }
        }
    }

    if(currImg.includes("Striped") && otherImg.includes("Striped")){
        let r1 = parseInt(otherTile.id.split("-")[0]);
        let c1 = parseInt(otherTile.id.split("-")[1]);
        let r2 = parseInt(currTile.id.split("-")[0]);
        let c2 = parseInt(currTile.id.split("-")[1]);
        for (let i=0; i<rows; i++) {
            if(board[i][c1].src.includes("Striped") || board[i][c1].src.includes("Wrapped") || board[i][c1].src.includes("choco")) {
                explodeSpecialCandy(board[i][c1]);
            }
            else board[i][c1].src = "./images/blank.png";
        }
        for(let j=0; j<cols; j++) {
            if(board[r2][j].src.includes("Striped") || board[r2][j].src.includes("Wrapped") || board[r2][j].src.includes("choco")) {
                explodeSpecialCandy(board[r2][j]);
            }
            else board[r2][j].src = "./images/blank.png";
        }
    }

    if((currImg.includes("Striped") && otherImg.includes("Wrapped")) || (currImg.includes("Wrapped") && otherImg.includes("Striped"))) {
        let r = parseInt(otherTile.id.split("-")[0]);
        let c = parseInt(otherTile.id.split("-")[1]);
        for (let row=Math.max(0, r-1); row<=Math.min(r+1, 8); row++) {
            for(let col=0; col<cols; col++) {
                if(board[row][col].src.includes("Striped") || board[row][col].src.includes("Wrapped") || board[row][col].src.includes("choco")) {
                    explodeSpecialCandy(board[row][col]);
                } 
                else board[row][col].src = "./images/blank.png";
            }
        }

        for (let col=Math.max(0, c-1); col<=Math.min(c+1, 8); col++) {
            for(let row=0; row<rows; row++) {
                if(board[row][col].src.includes("Striped") || board[row][col].src.includes("Wrapped") || board[row][col].src.includes("choco")) {
                    explodeSpecialCandy(board[row][col]);
                } 
                else board[row][col].src = "./images/blank.png";
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
    if (candy.src.includes("blank")) return;
    let coords = candy.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    if(candy.src.includes("Striped-Vertical")) {
        board[r][c].src = "./images/blank.png";
        for(let i = 0; i < rows; i++) {
            if(!(board[i][c].src.includes("Striped-Vertical") || board[i][c].src.includes("Striped-Horizontal") || board[i][c].src.includes("Wrapped") || board[i][c].src.includes("choco"))) {
                board[i][c].src = "./images/blank.png";
                score += 10;
            }
        }
        for(let i = 0; i < rows; i++) {
            if(board[i][c].src.includes("Striped-Vertical") || board[i][c].src.includes("Striped-Horizontal") || board[i][c].src.includes("Wrapped") || board[i][c].src.includes("choco")) {
                explodeSpecialCandy(board[i][c]);
                score += 10;
            }
        }
    }

    else if(candy.src.includes("Striped-Horizontal")) {
        board[r][c].src = "./images/blank.png";
        for(let j = 0; j < cols; j++) {
            if(!(board[r][j].src.includes("Striped-Vertical") || board[r][j].src.includes("Striped-Horizontal") || board[r][j].src.includes("Wrapped") || board[r][j].src.includes("choco"))) {
                board[r][j].src = "./images/blank.png";
                score += 10;
            }
        }
        for(let j = 0; j < cols; j++) {
            if(board[r][j].src.includes("Striped-Vertical") || board[r][j].src.includes("Striped-Horizontal") || board[r][j].src.includes("Wrapped") || board[r][j].src.includes("choco")) {
                explodeSpecialCandy(board[r][j]);
                score += 10;
            }
        }
    }

    else if(candy.src.includes("choco")) {
        board[r][c].src = "./images/blank.png";
        let target = randomCandy();
        for (let i=0 ; i<rows; i++) {
            for (let j=0 ; j<cols ; j++) {
                if(board[i][j].src.includes(target)) {
                    if(board[i][j].src.includes("Striped-Vertical") || board[i][j].src.includes("Striped-Horizontal") || board[i][j].src.includes("Wrapped") || board[i][j].src.includes("choco")) 
                        explodeSpecialCandy(board[i][j]);
                    else board[i][j].src = "./images/blank.png";
                    score += 10;
                }
            }
        }
    }

    else if(candy.src.includes("Wrapped")) {
        board[r][c].src = "./images/blank.png";
        for(let repeat = 0; repeat < 2; repeat++) {
            for(let i = Math.max(0, r-1); i <= Math.min(r+1, 8); i++) {
                for(let j = Math.max(0, c-1); j <= Math.min(c+1, 8); j++) {
                    let target = board[i][j];
                    if(target.src.includes("blank")) continue;
                    if(target.src.includes("Striped-Vertical") || target.src.includes("Striped-Horizontal") || target.src.includes("Wrapped") || target.src.includes("choco")) {
                        explodeSpecialCandy(target);
                    } else {
                        target.src = "./images/blank.png";
                        score += 10;
                    }
                }
            }
        }

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

            if(getColor(board[r][c+1].src) == getColor(board[r+1][c+1].src) &&
                getColor(board[r][c+1].src) == getColor(board[r+2][c+1].src) &&
                !board[r][c+1].src.includes("blank")){
                    if(getColor(board[r][c+1].src) == getColor(board[r][c].src) && getColor(board[r][c+1].src) == getColor(board[r][c+2].src))
                        return true;
                    if(getColor(board[r][c+1].src) == getColor(board[r+1][c].src) && getColor(board[r][c+1].src) == getColor(board[r+1][c+2].src))
                        return true;
                    if(getColor(board[r+2][c+1].src) == getColor(board[r][c].src) && getColor(board[r][c+1].src) == getColor(board[r+2][c+2].src))
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
    let file = src.split("/").pop().split(".")[0]; 
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

            if(getColor(board[r][c].src) == getColor(board[r+1][c].src) &&
                getColor(board[r+1][c].src) == getColor(board[r+2][c].src) &&
                getColor(board[r+2][c+1].src) == getColor(board[r][c].src) &&
                getColor(board[r+2][c+2].src) == getColor(board[r][c].src) &&
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

            if(getColor(board[r][c].src) == getColor(board[r][c+1].src) &&
                getColor(board[r][c].src) == getColor(board[r][c+2].src) &&
                getColor(board[r+1][c+2].src) == getColor(board[r][c].src) &&
                getColor(board[r+2][c+2].src) == getColor(board[r][c].src) &&
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

            if(getColor(board[r+1][c].src) == getColor(board[r+1][c+1].src) &&
                getColor(board[r+1][c].src) == getColor(board[r+1][c+2].src) &&
                getColor(board[r+1][c].src) == getColor(board[r][c+2].src) &&
                getColor(board[r+1][c].src) == getColor(board[r+2][c+2].src) &&
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

            if(getColor(board[r+2][c].src) == getColor(board[r+2][c+1].src) &&
                getColor(board[r+2][c].src) == getColor(board[r+2][c+2].src) &&
                getColor(board[r+2][c].src) == getColor(board[r][c+2].src) &&
                getColor(board[r+2][c].src) == getColor(board[r+1][c+2].src) &&
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

            if(getColor(board[r][c+1].src) == getColor(board[r+1][c+1].src) &&
                getColor(board[r][c+1].src) == getColor(board[r+2][c+1].src) &&
                !board[r][c+1].src.includes("blank")){
                    let color = board[r][c+1].src.split("/").pop().split(".")[0];
                    if(getColor(board[r][c+1].src) == getColor(board[r][c].src) && getColor(board[r][c+1].src) == getColor(board[r][c+2].src)){
                        if(board[r][c+1].src.includes("Striped") || board[r][c+1].src.includes("Wrapped") || board[r][c+1].src.includes("choco"))
                            explodeSpecialCandy(board[r][c+1]);
                        else board[r][c+1].src = "./images/" + color + "-Wrapped.png";
                        if(board[r+1][c+1].src.includes("Striped") || board[r+1][c+1].src.includes("Wrapped") || board[r+1][c+1].src.includes("choco"))
                            explodeSpecialCandy(board[r+1][c+1]);
                        else board[r+1][c+1].src = "./images/blank.png";
                        if(board[r+2][c+1].src.includes("Striped") || board[r+2][c+1].src.includes("Wrapped") || board[r+2][c+1].src.includes("choco"))
                            explodeSpecialCandy(board[r+2][c+1]);
                        else board[r+2][c+1].src = "./images/blank.png";
                        if(board[r][c].src.includes("Striped") || board[r][c].src.includes("Wrapped") || board[r][c].src.includes("choco"))
                            explodeSpecialCandy(board[r][c]);
                        else board[r][c].src = "./images/blank.png";
                        if(board[r][c+2].src.includes("Striped") || board[r][c+2].src.includes("Wrapped") || board[r][c+2].src.includes("choco"))
                            explodeSpecialCandy(board[r][c+2]);
                        else board[r][c+2].src = "./images/blank.png";
                    }
                    if(getColor(board[r][c+1].src) == getColor(board[r+1][c].src) && getColor(board[r][c+1].src) == getColor(board[r+1][c+2].src)){
                        if(board[r][c+1].src.includes("Striped") || board[r][c+1].src.includes("Wrapped") || board[r][c+1].src.includes("choco"))
                            explodeSpecialCandy(board[r][c+1]);
                        else board[r][c+1].src = "./images/blank.png";
                        if(board[r+1][c+1].src.includes("Striped") || board[r+1][c+1].src.includes("Wrapped") || board[r+1][c+1].src.includes("choco"))
                            explodeSpecialCandy(board[r+1][c+1]);
                        else board[r+1][c+1].src = "./images/" + color + "-Wrapped.png";
                        if(board[r+2][c+1].src.includes("Striped") || board[r+2][c+1].src.includes("Wrapped") || board[r+2][c+1].src.includes("choco"))
                            explodeSpecialCandy(board[r+2][c+1]);
                        else board[r+2][c+1].src = "./images/blank.png";
                        if(board[r+1][c].src.includes("Striped") || board[r+1][c].src.includes("Wrapped") || board[r+1][c].src.includes("choco"))
                            explodeSpecialCandy(board[r+1][c]);
                        else board[r+1][c].src = "./images/blank.png";
                        if(board[r+1][c+2].src.includes("Striped") || board[r+1][c+2].src.includes("Wrapped") || board[r+1][c+2].src.includes("choco"))
                            explodeSpecialCandy(board[r+1][c+2]);
                        else board[r+1][c+2].src = "./images/blank.png";
                    }
                    if(getColor(board[r][c+1].src) == getColor(board[r+2][c].src) && getColor(board[r][c+1].src) == getColor(board[r+2][c+2].src)){
                        if(board[r][c+1].src.includes("Striped") || board[r][c+1].src.includes("Wrapped") || board[r][c+1].src.includes("choco"))
                            explodeSpecialCandy(board[r][c+1]);
                        else board[r][c+1].src = "./images/blank.png";
                        if(board[r+1][c+1].src.includes("Striped") || board[r+1][c+1].src.includes("Wrapped") || board[r+1][c+1].src.includes("choco"))
                            explodeSpecialCandy(board[r+1][c+1]);
                        else board[r+1][c+1].src = "./images/blank.png";
                        if(board[r+2][c+1].src.includes("Striped") || board[r+2][c+1].src.includes("Wrapped") || board[r+2][c+1].src.includes("choco"))
                            explodeSpecialCandy(board[r+2][c+1]);
                        else board[r+2][c+1].src = "./images/" + color + "-Wrapped.png";
                        if(board[r+2][c].src.includes("Striped") || board[r+2][c].src.includes("Wrapped") || board[r+2][c].src.includes("choco"))
                            explodeSpecialCandy(board[r+2][c]);
                        else board[r+2][c].src = "./images/blank.png";
                        if(board[r+2][c+2].src.includes("Striped") || board[r+2][c+2].src.includes("Wrapped") || board[r+2][c+2].src.includes("choco"))
                            explodeSpecialCandy(board[r+2][c+2]);
                        else board[r+2][c+2].src = "./images/blank.png";
                    }
                }
        }
    }

    return false;
}


/*
r,c     r,c+1       r,c+2
r+1,c   r+1,c+1     r+1,c+2
r+2,c   r+2,c+1     r+2,c+2
*/