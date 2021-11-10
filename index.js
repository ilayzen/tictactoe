let historyOfMoves;

!localStorage.historyOfMoves ? historyOfMoves = [] : historyOfMoves = JSON.parse(localStorage.getItem('historyOfMoves'));

function Step(index, id){
    this.index = index;
    this.id = id;
}

function updateLocal() {
    localStorage.setItem('historyOfMoves', JSON.stringify(historyOfMoves));
}

let buttons = document.querySelectorAll('.cell');

    for(let i = 0; i < buttons.length; i++){
        buttons[i].addEventListener('click',() => {
            historyOfMoves.push(new Step( historyOfMoves.length, buttons[i].id));
            addElement();
            updateLocal();
        },{once : true});
    }


function addElement(){
    for(let i = 0; i < historyOfMoves.length; i++){
        if(i % 2 === 0){
            let cross = document.createElement('div');
            cross.setAttribute('class','ch');

            let addCross = document.getElementById(historyOfMoves[i].id);
            addCross.appendChild(cross);
        }
        if(i % 2 === 1){
            let zero = document.createElement('div');
            zero.setAttribute('class','r');

            let addZero  = document.getElementById(historyOfMoves[i].id);
            addZero.appendChild(zero);
        }

    }
}