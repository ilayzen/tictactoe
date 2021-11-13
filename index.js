let undoButton = document.querySelector(".undo-btn");
let redoButton = document.querySelector(".redo-btn");

let cancelledMoves = [];
let historyOfMoves;

!localStorage.historyOfMoves ? historyOfMoves = [] : historyOfMoves = JSON.parse(localStorage.getItem('historyOfMoves'));
updateLocal()

function Step(index, id) {
    this.index = index;
    this.id = id;
}

function updateLocal() {
    localStorage.setItem('historyOfMoves', JSON.stringify(historyOfMoves));
}

let buttons = document.querySelectorAll('.cell');

function clickHunter() {
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', () => {
            historyOfMoves.push(new Step(historyOfMoves.length, buttons[i].id));
            undoButton.disabled = false;
            addElement();
            updateLocal();
        }, {once: true});
        updateLocal();
    }
}

undoButton.addEventListener('click', undo);

function addElement() {
    for (let i = 0; i < historyOfMoves.length; i++) {
        if (i % 2 === 0) {
            let cross = document.createElement('div');
            cross.setAttribute('class', 'ch');

            let addCross = document.getElementById(historyOfMoves[i].id);
            addCross.appendChild(cross);
        }
        if (i % 2 === 1) {
            let zero = document.createElement('div');
            zero.setAttribute('class', 'r');

            let addZero = document.getElementById(historyOfMoves[i].id);
            addZero.appendChild(zero);
        }
    }

    if (historyOfMoves.length === buttons.length) {
        let tie = document.getElementsByClassName('won-title hidden');
        tie = tie[0];
        tie.className = 'won-title';

        let span = document.querySelector(".won-message");
        span.textContent = "It's a draw!";
    }
}

function undo() {
    redoButton.disabled = false;
    cancelledMoves.push(historyOfMoves.pop());

    if(cancelledMoves.length === 0){
        undoButton.disabled = false;
    }
    localStorage.setItem('cancelledMoves', JSON.stringify(cancelledMoves));

    updateLocal();
    redoButton.addEventListener('click', redo);
}

function redo(){
    historyOfMoves.push(new Step(historyOfMoves.length, cancelledMoves[cancelledMoves.length -1].id));
    updateLocal()
}

clickHunter();