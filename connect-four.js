function assert(condition) {
    if (!condition) {
        console.error("Assertion failed");
    }
}

EMPTY = 0;

PLAYER_ONE = 1;
PLAYER_ONE_COLOR = "pink";
PLAYER_ONE_FILENAME = "player-1.png";

PLAYER_TWO = 2;
PLAYER_TWO_COLOR = "lightblue";
PLAYER_TWO_FILENAME = "player-2.png";

/*******************************************************************************
 * Move is the interface between ConnectFour and Viz
 ******************************************************************************/
class Move {
    // valid == true iff the move results in change in game state
    // (row, col) are the coordinates that player added their mark
    // player is either PLAYER_ONE or PLAYER_TWO, depending on who made the move
    // victor is either undefined (which signifies the game has not concluded)
    // or victor is PLAYER_ONE or PLAYER_TWO, depending on who won the game
    constructor(valid, row, col, player, victor, draw) {
        this.valid = valid;
        this.row = row;
        this.col = col;
        this.player = player;
        this.victor = victor;
        this.draw = draw;
    }
}

/*******************************************************************************
 * ConnectFour class
 ******************************************************************************/
class ConnectFour {

    // player is either PLAYER_ONE or PLAYER_TWO, and indicates which player has
    // the next move
    constructor(player, numRows, numCols) {
        this.numRows = numRows;
        this.numCols = numCols;

        this.matrix = new Array(this.numRows);
        for (var row = 0; row < this.numRows; row++) {
            this.matrix[row] = new Array(this.numCols);
            for (var col = 0; col < this.numCols; col++) {
                this.matrix[row][col] = EMPTY;
            }
        }

        assert(player == PLAYER_ONE || player == PLAYER_TWO);

        // this.player always equals the player (either PLAYER_ONE or
        // PLAYER_TWO) who has the next move.
        this.player = player;

        // If the game is over, then this.victor equals PLAYER_ONE or PLAYER_TWO
        // depending on who won the game.
        // If the game is not over, then this.victor == undefined
        this.victor = undefined;

        // TODO: document
        this.draw = undefined;
    }

    makeMove(row, col) {

        assert(row >= 0 && row < this.numRows);
        assert(col >= 0 && col < this.numCols);

        if (this.matrix[row][col] != EMPTY ||
            this.victor != undefined ||
            (row < this.numRows - 1 && this.matrix[row + 1][col] == EMPTY))
            {
            return new Move(false, undefined, undefined, undefined, undefined,
                undefined);
        } 

        this.matrix[row][col] = this.player;

        this.checkGameOver();

        var move =
            new Move(true, row, col, this.player, this.victor, this.draw);

        if (this.player == PLAYER_ONE) {
            this.player = PLAYER_TWO;
        } else {
            this.player = PLAYER_ONE;
        }

        return move;
    }

    getCellValue(row, col) {
        if (row >= 0 &&
            row < this.numRows &
            col >= 0 &
            col < this.numCols) {
            return this.matrix[row][col];
        } else {
            return EMPTY;
        }
    }

    // Takes advantage of the fact that this.matrix[outOfBounds][outofBounds]
    // == undefined
    checkVictorHorizontal(row, col) {
        var a = this.getCellValue(row, col);
        var b = this.getCellValue(row, col + 1);
        var c = this.getCellValue(row, col + 2);
        var d = this.getCellValue(row, col + 3);
        if (a == b && a == c && a == d) {
            this.victor = a;
        };
    }

    checkVictorVertical(row, col) {
        var a = this.getCellValue(row, col);
        var b = this.getCellValue(row + 1, col);
        var c = this.getCellValue(row + 2, col);
        var d = this.getCellValue(row + 3, col);
        if (a == b && a == c && a == d) {
            this.victor = a;
        };
    }

    checkVictorDiagonal(row, col) {
        var a = this.getCellValue(row, col);
        var b = this.getCellValue(row + 1, col + 1);
        var c = this.getCellValue(row + 2, col + 2);
        var d = this.getCellValue(row + 3, col + 3);
        if (a == b && a == c && a == d) {
            this.victor = a;
        };

        var a = this.getCellValue(row, col);
        var b = this.getCellValue(row + 1, col - 1);
        var c = this.getCellValue(row + 2, col - 2);
        var d = this.getCellValue(row + 3, col - 3);
        if (a == b && a == c && a == d) {
            this.victor = a;
        };
    }


    checkVictor(row, col) {
        this.checkVictorHorizontal(row, col);
        this.checkVictorVertical(row, col);
        this.checkVictorDiagonal(row, col);
    }

    checkDraw() {
        for (var row = 0; row < this.numRows; row++) {
            for (var col = 0; col < this.numCols; col++) {
                if (this.matrix[row][col] == EMPTY) {
                    return;
                }
            }
        }

        this.draw = true;
    }

    checkGameOver() {

        this.checkDraw();

        for (var row = 0; row < this.numRows; row++) {
            for (var col =0; col < this.numCols; col++) {
                if (this.matrix[row][col] != EMPTY) {
                    this.checkVictor(row, col);
                }
            }
        }
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
                var cellTag = "<div id='" + cellId + "' " + 
                              "class='cell' " + 
                              "onClick='cellClick(" + row + ", " + col +" )'>" +
                              "</div>";
                $("#" + rowId).append(cellTag);
                $("#" + cellId).css("width", this.cell_size);
                $("#" + cellId).css("height", this.cell_size);
            }
        }
    }

    getImgTag(player) {

        var filename = undefined;

        if (player == PLAYER_ONE) {
            filename = PLAYER_ONE_FILENAME;
        } else if (player == PLAYER_TWO) {
            filename = PLAYER_TWO_FILENAME
        } else {
            assert(false);
        }

        return "<img src='" + filename + "' width='" + this.cell_size + "'>";
    }


    drawMove(move) {
        if (!move.valid) {
            return;
        }

        var cellId = Viz.getCellId(move.row, move.col);
        var imgTag = this.getImgTag(move.player);

        $("#" + cellId).append(imgTag);

        if (move.victor == PLAYER_ONE) {
            $(".cell").css("background-color", PLAYER_ONE_COLOR);
        } else if (move.victor == PLAYER_TWO) {
            $(".cell").css("background-color", PLAYER_TWO_COLOR);
        }
    }
}

/*******************************************************************************
 * Controller
 ******************************************************************************/
         
var cell_size = 50;

var GAME = new ConnectFour(PLAYER_ONE, 6, 7);

// Global variable to hold the Viz class
var VIZ = new Viz("#board", 6, 7, cell_size);

function cellClick(row, col) {

    var move = GAME.makeMove(row, col);
    VIZ.drawMove(move);

}
