const tbody = document.getElementById("tbody")
const time = document.getElementById("time")
const mistake = document.getElementById("mistake");
const deleteDiv = document.getElementById("delete")
const surDiv = document.getElementById("sur")

function newBoard() {
    tbody.innerText = ""
    time.innerText = ""
    mistake.innerText = "0/3"
    for (let i = 0; i < 9; i++) {
        const tr = document.createElement("tr")
        for (let j = 0; j < 9; j++) {
            const td = document.createElement("td")
            td.id = `row${i + 1}-col${j + 1}`
            switch (+td.id[3]) {
                case 3:
                case 6:
                    td.style.borderBottom = "5px solid black"
            }
            switch (+td.id[8]) {
                case 3:
                case 6:
                    td.style.borderRight = "5px solid black"
            }
            tr.appendChild(td)
        }
        tbody.appendChild(tr)
    }
}

newBoard()

function isSafe(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) return false;
    }
    for (let x = 0; x < 9; x++) {
        if (board[x][col] === num) return false;
    }
    let startRow = row - (row % 3);
    let startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) return false;
        }
    }
    return true;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function solveSudoku(board) {
    let row = -1, col = -1;
    let isEmpty = false;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                row = i;
                col = j;
                isEmpty = true;
                break;
            }
        }
        if (isEmpty) break;
    }
    if (!isEmpty) return true;
    let candidates = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (let num of candidates) {
        if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
                return true;
            }
            board[row][col] = 0;
        }
    }
    return false;
}

let board = [];
for (let i = 0; i < 9; i++) {
    board[i] = []
    for (let j = 0; j < 9; j++) {
        board[i][j] = 0
    }
}
solveSudoku(board);

function gameStart(how) {
    document.querySelectorAll("button").forEach((button) => {
        if (!button.id) {
            button.disabled = true;
        }
    })
    for (let i = 0; i < how; i++) {
        const row = Math.floor(Math.random() * 9)
        const col = Math.floor(Math.random() * 9)
        const idDiv = document.getElementById(`row${row + 1}-col${col + 1}`)
        idDiv.innerHTML = board[row][col];
        idDiv.classList.add("start")
    }
    let clicked = {};
    document.querySelectorAll("td").forEach((item) => {
        if (!item.classList.contains("start")) {
            item.addEventListener("click", function highlightClicked(e) {
                document.querySelectorAll("td").forEach((cell) => {
                    cell.style.backgroundColor = ""
                    cell.classList.remove("selected")
                })
                clicked.row = +e.target.id[3]
                clicked.col = +e.target.id[8]
                e.target.classList.add("selected")
                e.target.style.backgroundColor = "lightblue";
            })
            item.addEventListener("mouseover", function highlightCross(e) {
                document.querySelectorAll("td").forEach((cell) => {
                    if (e.target.id[3] === cell.id[3] && e.target.id[8] !== cell.id[8]
                        || e.target.id[3] !== cell.id[3] && e.target.id[8] === cell.id[8]) {
                        cell.classList.add("highlight");
                    }
                })
            })
            item.addEventListener("mouseout", function removeHighlight() {
                document.querySelectorAll("td").forEach((cell) => {
                    cell.classList.remove("highlight");
                })
            })
        }
    })
    let countMistake = 0;
    for (let i = 0; i < 9; i++) {
        document.getElementById(`num${i + 1}`).addEventListener(
            "click", function addNumber(e) {
                clicked.num = +e.target.innerText;
                if (clicked.row !== undefined && clicked.col !== undefined) {
                    document.getElementById(`row${clicked.row}-col${clicked.col}`).innerHTML = clicked.num;
                    if (clicked.num !== board[clicked.row - 1][clicked.col - 1]) {
                        document.getElementById(`row${clicked.row}-col${clicked.col}`).style.color = "red";
                        if (countMistake < 3) {
                            countMistake++;
                            mistake.innerText = `${countMistake}/3`
                        } else {
                            alert("Bạn đã thua, chọn lại thử thách mới để chơi")
                            document.querySelectorAll("button").forEach((button) => {
                                button.disabled = false;
                            })
                            newBoard()
                            clearInterval(timer)
                        }
                    } else {
                        document.getElementById(`row${clicked.row}-col${clicked.col}`).style.color = "blue";
                    }
                    if (winGame()) {
                        document.querySelectorAll("td").forEach((cell) => {
                            cell.classList.add("win")
                        })
                        clearInterval(timer)
                        setTimeout(alert("Xuất sắc, bạn đã hoàn thành thử thách!"), 2000)
                    }
                }
            });
    }
    timer = setInterval(timeRunning, 1000);
    mistake.innerText = "0/3"
    deleteDiv.addEventListener("click", delNumber)
    surDiv.addEventListener("click", () => {
        clearInterval(timer);
        min = 0;
        sec = 0;
        time.innerText = "0 phút 0 giây";
        newBoard();
        document.querySelectorAll("button").forEach((button) => {
            button.disabled = false;
        })
    });

}

let min = 0;
let sec = 0;
let timer;

function timeRunning() {
    sec++;
    if (sec >= 60) {
        sec = 0;
        min++;
    }
    time.innerText = `${min} phút ${sec} giây`
}

function delNumber() {
    document.querySelector("td.selected").innerText = ""
}

function winGame() {
    let isWin = true;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (document.getElementById(`row${i + 1}-col${j + 1}`).innerText == "") {
                isWin = false
                break;
            }
        }
    }
    return isWin;
}