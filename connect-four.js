function assert(condition) {
    if (!condition) {
        console.error("Assertion failed");
    }
}

MIN_MAX_DEPTH = 6;
MIN_MAX_THREE_WEIGHT = 10;

EMPTY = 0;

PLAYER_ONE = 1;
PLAYER_ONE_COLOR = "pink";
PLAYER_ONE_FILENAME = "player-1.png";

PLAYER_TWO = 2;
PLAYER_TWO_COLOR = "lightblue";
PLAYER_TWO_FILENAME = "player-2.png";

var FIRST_PLAYER = undefined;

if (Math.random() < 0.5) {
    FIRST_PLAYER = PLAYER_ONE;
} else {
    FIRST_PLAYER = PLAYER_TWO;
}

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

    deepCopy() {
        var newGame = new ConnectFour(this.player, this.numRows, this.numCols);

        for (var row = 0; row < this.numRows; row++) {
            for (var col = 0; col < this.numCols; col++) {
                newGame.matrix[row][col] = this.matrix[row][col];
            }
        }

        newGame.victor = this.victor;
        newGame.draw = this.draw;

        return newGame;
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
            return undefined;
        }
    }

    checkVictorHorizontal(row, col) {
        var a = this.getCellValue(row, col);
        var b = this.getCellValue(row, col + 1);
        var c = this.getCellValue(row, col + 2);
        var d = this.getCellValue(row, col + 3);
        if (a == b && a == c && a == d) {
            this.victor = a;
        }
    }

    checkVictorVertical(row, col) {
        var a = this.getCellValue(row, col);
        var b = this.getCellValue(row + 1, col);
        var c = this.getCellValue(row + 2, col);
        var d = this.getCellValue(row + 3, col);
        if (a == b && a == c && a == d) {
            this.victor = a;
        }
    }

    checkVictorDiagonal(row, col) {
        var a = this.getCellValue(row, col);
        var b = this.getCellValue(row + 1, col + 1);
        var c = this.getCellValue(row + 2, col + 2);
        var d = this.getCellValue(row + 3, col + 3);
        if (a == b && a == c && a == d) {
            this.victor = a;
        }

        var a = this.getCellValue(row, col);
        var b = this.getCellValue(row + 1, col - 1);
        var c = this.getCellValue(row + 2, col - 2);
        var d = this.getCellValue(row + 3, col - 3);
        if (a == b && a == c && a == d) {
            this.victor = a;
        }
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
 * Node class
 ******************************************************************************/

class Node {

    constructor(game, move = undefined) {
        this.game = game;
        this.move = move;
    }

    getMove() {
        return this.move;
    }

    isLeaf() {
        return this.game.victor != undefined || this.game.draw != undefined; 
    }


    countThreeHorizontal(player, row, col) {
        var beforeA = this.game.getCellValue(row, col -1);
        var a = this.game.getCellValue(row, col);
        var b = this.game.getCellValue(row, col + 1);
        var c = this.game.getCellValue(row, col + 2);
        var afterC = this.game.getCellValue(row, col + 3);

        if (a == player && a == b && a == c &&
            (beforeA == EMPTY || afterC == EMPTY)) {
            return 1;
        } else {
            return 0;
        }
    }

    countThreeVertical(player, row, col) {
        var beforeA = this.game.getCellValue(row - 1, col);
        var a = this.game.getCellValue(row, col);
        var b = this.game.getCellValue(row + 1, col);
        var c = this.game.getCellValue(row + 2, col);
        var afterC = this.game.getCellValue(row + 3, col);

        if (a == player && a == b && a == c &&
            (beforeA == EMPTY || afterC == EMPTY)) {
            return 1;
        } else {
            return 0;
        }
    }

    countThreeDiagonal(player, row, col) {
        var count = 0;

        var beforeA = this.game.getCellValue(row - 1, col - 1);
        var a = this.game.getCellValue(row, col);
        var b = this.game.getCellValue(row + 1, col + 1);
        var c = this.game.getCellValue(row + 2, col + 2);
        var afterC = this.game.getCellValue(row + 3, col + 3);
        if (a == player && a == b && a == c &&
            (beforeA == EMPTY || afterC == EMPTY)) {
            count += 1;
        }

        var beforeA = this.game.getCellValue(row - 1, col + 1);
        var a = this.game.getCellValue(row, col);
        var b = this.game.getCellValue(row + 1, col - 1);
        var c = this.game.getCellValue(row + 2, col - 2);
        var afterC = this.game.getCellValue(row + 3, col - 3);
        if (a == player && a == b && a == c &&
            (beforeA == EMPTY || afterC == EMPTY)) {
            count += 1;
        }

        return count;
    }


    countTwoHorizontal(player, row, col) {
        var beforeBeforeA = this.game.getCellValue(row, col - 2);
        var beforeA = this.game.getCellValue(row, col - 1);
        var a = this.game.getCellValue(row, col);
        var b = this.game.getCellValue(row, col + 1);
        var afterB = this.game.getCellValue(row, col + 2);
        var afterAfterB = this.game.getCellValue(row, col + 3);

        var goodSpacing =
            (beforeA == EMPTY && beforeBeforeA == EMPTY) ||
            (beforeA == EMPTY && afterB == EMPTY) ||
            (afterB == EMPTY && afterAfterB == EMPTY);

        if (a == player && a == b && goodSpacing) {
            return 1;
        } else {
            return 0;
        }
    }

    countTwoVertical(player, row, col) {
        var beforeBeforeA = this.game.getCellValue(row - 2, col);
        var beforeA = this.game.getCellValue(row - 1, col);
        var a = this.game.getCellValue(row, col);
        var b = this.game.getCellValue(row + 1, col);
        var afterB = this.game.getCellValue(row + 2, col);
        var afterAfterB = this.game.getCellValue(row + 3, col);

        var goodSpacing =
            (beforeA == EMPTY && beforeBeforeA == EMPTY) ||
            (beforeA == EMPTY && afterB == EMPTY) ||
            (afterB == EMPTY && afterAfterB == EMPTY);

        if (a == player && a == b && goodSpacing) {
            return 1;
        } else {
            return 0;
        }
    }

    countTwoDiagonal(player, row, col) {
        var count = 0;

        var beforeBeforeA = this.game.getCellValue(row - 2, col -2);
        var beforeA = this.game.getCellValue(row - 1, col - 1);
        var a = this.game.getCellValue(row, col);
        var b = this.game.getCellValue(row + 1, col + 1);
        var afterB = this.game.getCellValue(row + 2, col + 2);
        var afterAfterB = this.game.getCellValue(row + 3, col + 3);

        var goodSpacing =
            (beforeA == EMPTY && beforeBeforeA == EMPTY) ||
            (beforeA == EMPTY && afterB == EMPTY) ||
            (afterB == EMPTY && afterAfterB == EMPTY);

        if (a == player && a == b && goodSpacing) {
            count += 1;
        }

        var beforeBeforeA = this.game.getCellValue(row - 2, col +2);
        var beforeA = this.game.getCellValue(row - 1, col + 1);
        var a = this.game.getCellValue(row, col);
        var b = this.game.getCellValue(row + 1, col - 1);
        var afterB = this.game.getCellValue(row + 2, col - 2);
        var afterAfterB = this.game.getCellValue(row + 3, col - 3);

        var goodSpacing =
            (beforeA == EMPTY && beforeBeforeA == EMPTY) ||
            (beforeA == EMPTY && afterB == EMPTY) ||
            (afterB == EMPTY && afterAfterB == EMPTY);

        if (a == player && a == b && goodSpacing) {
            count += 1;
        }

        return count;
    }

    countThree(player) {
        var count = 0;

        for (var row = 0; row < this.game.numRows; row++) {
            for (var col = 0; col < this.game.numCols; col++) {
                count += this.countThreeHorizontal(player, row, col) +
                         this.countThreeVertical(player, row, col) +
                         this.countThreeDiagonal(player, row, col);
            }
        }

        return count;
    }

    countTwo(player) {
        var count = 0;

        for (var row = 0; row < this.game.numRows; row++) {
            for (var col = 0; col < this.game.numCols; col++) {
                count += this.countTwoHorizontal(player, row, col) +
                         this.countTwoVertical(player, row, col) +
                         this.countTwoDiagonal(player, row, col);
            }
        }

        return count;
    }

    scorePlayer(player) {

        var otherPlayer;

        if (player == PLAYER_ONE) {
            otherPlayer = PLAYER_TWO;
        } else{
            otherPlayer = PLAYER_ONE;
        }

        var scoreThisPlayer =
            this.countThree(player) * MIN_MAX_THREE_WEIGHT +
            this.countTwo(player);

        var scoreOtherPlayer =
            this.countThree(otherPlayer) * MIN_MAX_THREE_WEIGHT +
            this.countTwo(otherPlayer);

        var absoluteScore = scoreThisPlayer - scoreOtherPlayer;

        if (player == PLAYER_ONE) {
            return absoluteScore;
        } else {
            return -1 * absoluteScore;
        }

    }

    // Player One is always the maximizing player
    getScore() {

        if (this.game.draw == true) {
            return 0;
        } else if (this.game.victor == PLAYER_ONE) {
            return Number.MAX_SAFE_INTEGER;
        } else if (this.game_victor == PLAYER_TWO) {
            return Number.MIN_SAFE_INTEGER;
        } else {
            return this.scorePlayer(this.game.player);
        }
    }

    // Recall, in a game tree every node (except a leaf node)
    // is a parent. The children of a parent represent
    // all the possible moves a parent can make.
    getChildren() {

        var childrenNodes = [];

        for (var row = 0; row < this.game.numRows; row++) {
            for (var col = 0; col < this.game.numCols; col++) {

                var childGame = this.game.deepCopy();

                var move = childGame.makeMove(row, col);

                if (move.valid) {
                    var childNode = new Node(childGame, move);
                    childrenNodes.push(childNode);
                }
            }
        }

        assert(childrenNodes.length > 0);

        return childrenNodes;
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
 * MinMax function
 ******************************************************************************/

// Arguments:
//    node is the node for which we want to calculate its score
//    maximizingPlayer is true if node wants to maximize its score
//    maximizingPlayer is false if node wants to minimize its score
//
// minMax(node, player) returns the best possible score
// that the player can achieve from this node
//
// node must be an object with the following methods:
//    node.isLeaf()
//    node.getScore()
//    node.getChildren()
//    node.getMove()
function minMax(node, depth, maximizingPlayer) {
    if (node.isLeaf() || depth == 0) {
        return [node.getMove(), node.getScore()];
    }

    // If the node wants to maximize its score:
    if (maximizingPlayer) {
        var bestScore = Number.MIN_SAFE_INTEGER;
        var bestMove = undefined;

        // find the child with the highest score
        var children = node.getChildren();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var [_, childScore] = minMax(child, depth - 1, false);
            bestScore = Math.max(childScore, bestScore);

            if (bestScore == childScore) {
                bestMove = child.getMove();
            }

        }
        return [bestMove, bestScore];
    }

    // If the node wants to minimize its score:
    else {
        var bestScore = Number.MAX_SAFE_INTEGER;
        var bestMove = undefined;

        // find the child with the lowest score
        var children = node.getChildren();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var [_, childScore] = minMax(child, depth -1, true);
            bestScore = Math.min(childScore, bestScore);

            if (bestScore == childScore) {
                bestMove = child.getMove();
            }
        }
        return [bestMove, bestScore];
    }
}


/*******************************************************************************
 * AI code
 ******************************************************************************/

function makeAiMove(game) {

    assert(game.victor == undefined && game.draw == undefined);

    var node = new Node(game);

    // The AI is always the PLAYER_TWO player, thus is always the minimizing
    // player
    var [bestMove, _] = minMax(node, MIN_MAX_DEPTH, false);

    return game.makeMove(bestMove.row, bestMove.col);
}

/*******************************************************************************
 * Controller
 ******************************************************************************/
         
var cell_size = 50;

var GAME = new ConnectFour(FIRST_PLAYER, 6, 7);

// Global variable to hold the Viz class
var VIZ = new Viz("#board", 6, 7, cell_size);

if (FIRST_PLAYER == PLAYER_TWO) {
    move = makeAiMove(GAME);
    VIZ.drawMove(move);
}

function cellClick(row, col) {

    var move = GAME.makeMove(row, col);
    VIZ.drawMove(move);

    if (move.valid && GAME.victor == undefined && GAME.draw == undefined) {

        function doAiMove() {
            move = makeAiMove(GAME);
            VIZ.drawMove(move);            
        }

        // NOTE: this introduces a race condition
        window.setTimeout(doAiMove, 100);
    }
}

