/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Player {
  constructor(color){
    this.color = color;//assume we pass in a valid color
    //Do we need more here?
  }
}

class Game {
  constructor(height, width){
    this.height = height;
    this.width = width;
    this.isOver = false;

    this.makeHtmlBoard()
    this.makeStartButton();
    //add a form that takes color submissions before game starts
    /* this.p1 = new Player('red'); //take color from form submission
    this.p1 = new Player('blue'); */
  }

  makeStartButton() {

    //const outerGame = document.getElementById('game');
    /* const startButton = document.createElement('button'); */
    const startButton = document.getElementById("startButton");
    startButton.innerText = 'Click me to (re)start';
    //startButton.setAttribute('id', 'startButton');

    startButton.addEventListener('click', () => {

      this.isOver = false;
      this.getPlayerColors();
      this.makeBoard();
      this.makeHtmlBoard();
    });

    //outerGame.prepend(startButton);

  }

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */
  makeBoard() {

    this.board = [];
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  getPlayerColors() {
    const p1Color = document.getElementById('p1Color').value;
    const p2Color = document.getElementById('p2Color').value;

    this.p1 = new Player(p1Color);
    this.p2 = new Player(p2Color);

    this.currPlayer = this.p1;
  }

  /** makeHtmlBoard: make HTML table and row of column tops.*/

  makeHtmlBoard() {
    const HTMLBoard = document.getElementById('board');
    HTMLBoard.innerHTML = '';

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      headCell.addEventListener('click', this.handleClick.bind(this));
      top.append(headCell);
    }

    HTMLBoard.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `c-${y}-${x}`);
        row.append(cell);
      }

      HTMLBoard.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;

    const spot = document.getElementById(`c-${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    if (!this.isOver) {
      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }

      // place piece in board and add to HTML table
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);

      // check for win
      if (this.checkForWin()) {
        //remove event listeners in top row


        return this.endGame(`The ${this.currPlayer.color} player won!`);

      }

      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('Tie!');
      }

      // switch players
     /*  this.currPlayer = this.currPlayer === 1 ? 2 : 1; */
      this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;

    }

  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const _win = cells => {
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }


    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          this.isOver = true;
          return true;
        }
      }
    }
  }
}

new Game(6, 7);
//instead we could have had a button here, that creates a new instance of the game

//getting TypeError: this.findSpotForCol is not a function on like 100:20 - why is not a function?