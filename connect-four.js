function assert(condition) {
    if (!condition) {
        console.error("Assertion failed");
    }
}

PLAYER_ONE = 1;
PLAYER_TWO = 2;

/*******************************************************************************
 * Move is the interface between ConnectFour and Viz
 ******************************************************************************/
class Move {
    // valid == true iff the move results in change in game state
    // (row, col) are the coordinates that player added their mark
    // player is either PLAYER_ONE or PLAYER_TWO, depending on who made the move
    // victor is either undefined (which signifies the game has not concluded)
    // or victor is PLAYER_ONE or PLAYER_TWO, depending on who won the game
    constructor(valid, row, col, player, victor) {
        this.valid = valid;
        this.row = row;
        this.col = col;
        this.player = player;
        this.victor = victor;
    }
}

/*******************************************************************************
 * Viz class
 ******************************************************************************/
class Viz {
    
    /* Static functions *******************************************************/

    static getCellId(row, col) {
        return "cell-" + row + "-" + col;
    }

    /* Instance methods *******************************************************/
    constructor(boardId, numRows, numCols, cell_size) {
        this.boardId = boardId;
        this.numRows = numRows;
        this.numCols = numCols;
        this.cell_size = cell_size;
        this.drawCells();
    }
    
    drawCells() {
        for (var row = 0; row < this.numRows; row++) {

            var rowId = "row-" + row;
            var rowTag = "<div id='" + rowId + "' class='row'></div>"

            $(this.boardId).append(rowTag);

            for (var col = 0; col < this.numCols; col++) {

                var cellId = Viz.getCellId(row, col);
                var cellTag = "<div id='" + cellId + "' class='cell'></div>";
                $("#" + rowId).append(cellTag);
                $("#" + cellId).css("width", this.cell_size);
                $("#" + cellId).css("height", this.cell_size);
            }
        }
    }

    getImgTag(filename) {
        return "<img src='" + filename + "' width='" + this.cell_size + "'>";
    }


    drawMove(move) {
        // TBD
    }
}

/*******************************************************************************
 * Controller
 ******************************************************************************/
         
var cell_size = 50;

// Global variable to hold the Viz class
var VIZ = new Viz("#board", 6, 7, cell_size);

