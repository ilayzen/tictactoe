const undoButton = document.querySelector('.undo-btn');
const redoButton = document.querySelector('.redo-btn');

const cancelledMoves = [];
let historyOfMoves;

if (!localStorage.historyOfMoves) {
  historyOfMoves = [];
} else {
  historyOfMoves = JSON.parse(localStorage.getItem('historyOfMoves'));
}

function Step(index, id) {
  this.index = index;
  this.id = id;
}
function updateLocal() {
  localStorage.setItem('historyOfMoves', JSON.stringify(historyOfMoves));
}

updateLocal();

const buttons = document.querySelectorAll('.cell');

function addElement() {
  for (let i = 0; i < historyOfMoves.length; i += 1) {
    if (i % 2 === 0) {
      const cross = document.createElement('div');
      cross.setAttribute('class', 'ch');

      const addCross = document.getElementById(historyOfMoves[i].id);
      addCross.appendChild(cross);
    }
    if (i % 2 === 1) {
      const zero = document.createElement('div');
      zero.setAttribute('class', 'r');

      const addZero = document.getElementById(historyOfMoves[i].id);
      addZero.appendChild(zero);
    }
  }

  if (historyOfMoves.length === buttons.length) {
    const thisWantEslint = 0;
    let tie = document.getElementsByClassName('won-title hidden');
    [tie] = tie[thisWantEslint];

    tie.className = 'won-title';

    const span = document.querySelector('.won-message');
    span.textContent = "It's a draw!";
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
  buttons[i].addEventListener(
    'click',
    () => {
      historyOfMoves.push(new Step(historyOfMoves.length, buttons[i].id));
      undoButton.disabled = false;
      addElement();
      updateLocal();
    },
    { once: true }
  );
  updateLocal();
}
undoButton.addEventListener('click', undo);

// обновление клеток после нажатия на поле;
// не переживает перезагрузку
// в div в классом 'cell' создается неслколько элементов ch или r;
