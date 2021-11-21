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
      document.getElementById(historyOfMoves[i].id).className = 'cell ch';
    }
    if (i % 2 === 1) {
      document.getElementById(historyOfMoves[i].id).className = 'cell r';
    }
  }
}

function end(string) {
  let wonMessage = document.getElementsByClassName('won-title hidden');
  wonMessage = wonMessage[0];
  wonMessage.className = 'won-title';

  const span = document.querySelector('.won-message');
  span.textContent = string;

  if (!string) {
    console.log('tie');
  }

  redoButton.disabled = true;
  undoButton.disabled = true;

  let restartBtn = document.querySelectorAll('.restart-btn');
  restartBtn[0].addEventListener('click', () => {
    localStorage.clear()
    window.location.reload();
  });
}

function drawDiagonAlRight() {
  let counterCh = 0;
  let counterR = 0;

  for (let i = 0; i < rows.length; i++) {
    let crossCells = rows[i].querySelectorAll('.cell');

    if (crossCells[i].className === 'cell ch') {
      counterCh = counterCh + 1;
    }
    if (counterCh === crossCells.length) {
      let thisCellss = 0;

      for (let j = 0; j < counterCh; j++) {
        document.getElementById(`c-${thisCellss}`).classList.add('win', 'diagonal-right');
        thisCellss = thisCellss + crossCells.length + 1
      }
      end('Crosses won!');
    }

    let zerosCells = rows[i].querySelectorAll('.cell');

    if (zerosCells[i].className === 'cell r') {
      counterR = counterR + 1;
    }
    if (counterR === zerosCells.length) {
      let thisCellss = 0;

      for (let j = 0; j < counterR; j++) {
        document.getElementById(`c-${thisCellss}`).classList.add('win', 'diagonal-right');
        thisCellss = thisCellss + zerosCells.length + 1
      }
      end('Toes won!');
    }
  }
}

function drawDiagonalLeft() {
  let counterCh = 0;
  let counnterR = 0;

  for (let i = 0; i < rows.length; i++) {
    let crossCell = rows[i].querySelectorAll('.cell');
    if (crossCell[crossCell.length - i - 1].className === 'cell ch') {
      counterCh = counterCh + 1;
    }
    if (counterCh === crossCell.length) {
      counterCh = 0;

      for (let j = i; j < buttons.length; j += i) {
        document.getElementById(`c-${j}`).classList.add('win', 'diagonal-left');
        counterCh = counterCh + 1
        if (counterCh === rows.length) {
          break;
        }
      }
      end('Crosses won!');
    }

    let zeroCell = rows[i].querySelectorAll('.cell');
    if (zeroCell[zeroCell.length - i - 1].className === 'cell r') {
      counnterR = counnterR + 1;
    }
    if (counnterR === zeroCell.length) {
      counnterR = 0;

      for (let j = i; j < buttons.length; j += i) {
        document.getElementById(`c-${j}`).classList.add('win', 'diagonal-left');
        counnterR = counnterR + 1
        if (counnterR === rows.length) {
          break;
        }
      }
      end('Toes won!');
    }
  }
}

function drawHorizontal() {
  let counterCh = 0;
  let counterR = 0;

  for (let i = 0; i < rows.length; i++) {
    let horizontalCrossCells = rows[i].querySelectorAll('.cell');

    for (let j = 0; j < rows.length; j++) {
      if (horizontalCrossCells[j].className === 'cell ch') {
        counterCh = counterCh + 1;
      } else {
        counterCh = 0;
      }
    }
    if (counterCh === rows.length) {
      let cell = rows[i].querySelectorAll('.ch');
      for (let a = 0; a < cell.length; a++) {
        cell[a].classList.add('win', 'horizontal');
      }
      end('Cross won!');
    }

    let horizontalZerosCells = rows[i].querySelectorAll('.cell');

    for (let j = 0; j < rows.length; j++) {
      if (horizontalZerosCells[j].className === 'cell r') {
        counterR = counterR + 1;
      } else {
        counterR = 0;
      }
    }
    if (counterR === rows.length) {
      let cell = rows[i].querySelectorAll('.r');
      for (let a = 0; a < cell.length; a++) {
        console.log(cell[a]);
        cell[a].classList.add('win', 'horizontal');
      }
      end('Toes won!');
    }
  }
}

function drawVertical() {
  let counterCh = 0;
  let counterR = 0;

  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows.length; j++) {
      let verticalCells = rows[j].querySelectorAll('.cell');
      if (verticalCells[i].className === 'cell ch') {
        counterCh = counterCh + 1;
      }
      if (verticalCells[i].className !== 'cell ch') {
        counterCh = 0;
      }

      if (counterCh === rows.length) {
        let lastEl = Number(verticalCells[i].id.slice(2));
        for (let a = lastEl; a >= 0; a -= rows.length) {
          document.getElementById(`c-${a}`).classList.add('win', 'vertical');
        }
        end('Cross won!');
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

let field = document.querySelector('.field');

function render() {
  field.addEventListener('click', function (event) {
    let cell = event.target;
    if (cell.className === 'cell') {
      historyOfMoves.push(new Step(historyOfMoves.length, cell.id));
      undoButton.disabled = false;
      addElement();
      drawVertical();
      drawDiagonAlRight();
      drawDiagonalLeft();
      drawHorizontal()
      updateLocal();
      if (!drawVertical() && !drawDiagonalLeft() && !drawDiagonAlRight() && !drawHorizontal()) {
        if (historyOfMoves.length === buttons.length) {
          end(`it's a draw`);
        }
      }
    }
  });

  undoButton.addEventListener('click', undo);
}

window.addEventListener('load', render);
