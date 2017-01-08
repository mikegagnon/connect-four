function assert(condition) {
    if (!condition) {
        console.error("Assertion failed");
    }
}

PLAYER_ONE = 1;
PLAYER_TWO = 2;

/*******************************************************************************
 * Snapshot class
 ******************************************************************************/
 class Snapshot {
    constructor(matrix, gameOver) {
        this.matrix = matrix;
        this.gameOver = gameOver;
        this.numRows = matrix.length;
        this.numCols = matrix[0].length;
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
    constructor(boardId, snapshot, cell_size) {
        this.boardId = boardId;
        this.numRows = snapshot.numRows;
        this.numCols = snapshot.numCols;
        this.cell_size = cell_size;
        this.drawCells();
        this.drawGame(snapshot);
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

    // The snapshot argument defines the game state that is to be drawn on the
    // web page
    drawGame(snapshot) {

        $("img").remove();

        for (var row = 0; row < this.numRows; row++) {
            for (var col = 0; col < this.numCols; col++) {
                var pieceId = snapshot.matrix[row][col];

                var filename = undefined;

                if (pieceId == PLAYER_ONE) {
                    filename = "player-1.png";
                } else if (pieceId == PLAYER_TWO) {
                    filename = "player-2.png";
                }

                if (filename != undefined) {
                    var cellId = "#" + Viz.getCellId(row, col);
                    var imgTag = this.getImgTag(filename)
                    $(cellId).append(imgTag);
                }
            }
        }
    }
}

/*******************************************************************************
 * Controller
 ******************************************************************************/
var CONNECT_FOUR = undefined; // global variable to hold the ConnectFour class
var VIZ = undefined;          // global variable to hold the Viz class



var boardInit =  [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 2, 0, 0, 0],
    [0, 1, 2, 2, 2, 0, 0],
];

var gameOver = false;

var snapshot = new Snapshot(boardInit, gameOver);

var cell_size = 50;

//SOKOBAN = new Sokoban(snapshot);
VIZ = new Viz("#board", snapshot, cell_size);

