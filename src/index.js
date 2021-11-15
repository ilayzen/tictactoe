const undoButton = document.querySelector('.undo-btn');
const redoButton = document.querySelector('.redo-btn');

let rows = document.querySelectorAll('.row')

const cancelledMoves = [];
let historyOfMoves;

if (!localStorage.historyOfMoves) {
  historyOfMoves = [];
} else {
  historyOfMoves = JSON.parse(localStorage.getItem('historyOfMoves'));
}

function Step(index, id, cell) {
  this.index = index;
  this.id = id;
  this.cell = cell
}

function updateLocal() {
  localStorage.setItem('historyOfMoves', JSON.stringify(historyOfMoves));
}

updateLocal();

const buttons = document.querySelectorAll('.cell');

function addElement() {
  for (let i = 0; i < historyOfMoves.length; i += 1) {
    if (i % 2 === 0) {
      document.getElementById(historyOfMoves[i].id).className = 'cell ch';
    }
    if (i % 2 === 1) {
      document.getElementById(historyOfMoves[i].id).className = 'cell r';
    }
  }

  if (historyOfMoves.length === buttons.length) {
    let tie = document.getElementsByClassName('won-title hidden');
    tie = tie[0];
    tie.className = 'won-title';

    const span = document.querySelector('.won-message');
    span.textContent = "It's a draw";
  }
}

function checkWinDiagonalLeft() {   // left side to right(if win cross);
  let counter = 0;
  for (let i = 0; i < rows.length; i++) {
    let cells = rows[i].querySelectorAll('.cell');

    if (cells[i].className === 'cell ch') {
      counter = counter + 1;
    }

    if (counter === cells.length) {
      let thisCellss = 0
      for (let j = 0; j < counter; j++) {
        console.log(thisCellss)

        document.getElementById(`c-${thisCellss}`).classList.add('win', 'diagonal-right')
        thisCellss = thisCellss + cells.length + 1
      }
    }
  }
}

function redo() {
  historyOfMoves.push(cancelledMoves.pop());
  updateLocal();
}

function undo() {
  redoButton.disabled = false;
  cancelledMoves.push(historyOfMoves.pop());

  if (cancelledMoves.length === 0) {
    undoButton.disabled = false;
  }
  localStorage.setItem('cancelledMoves', JSON.stringify(cancelledMoves));
  updateLocal();
  redoButton.addEventListener('click', redo);
}

for (let i = 0; i < buttons.length; i += 1) {
  let thisCell = buttons[i].id;
  thisCell = thisCell.slice(-1);

  thisCell = Number(thisCell);
  buttons[i].addEventListener(
    'click',
    () => {
      historyOfMoves.push(new Step(historyOfMoves.length, buttons[i].id, thisCell));
      undoButton.disabled = false;
      addElement();
      checkWinDiagonalLeft();
      updateLocal();
    },
    {once: true}
  );
  updateLocal();
}
undoButton.addEventListener('click', undo);
