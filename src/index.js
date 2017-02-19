/*jshint esversion:6*/

require("./styles/style.css");
require("jquery");
require("font-awesome-webpack");
const ut = require("./unit_test.js");
const ft = require("./func_tools.js");

// Main app
function dbg(msg) {
  let p=$('<p>').html(msg);
  $('#debug').append(p);
}


/*
Win: If the player has two in a row, they can place a third to get three in a row.
Block: If the opponent has two in a row, the player must play the third themselves to block the opponent.
Fork: Create an opportunity where the player has two threats to win (two non-blocked lines of 2).
Blocking an opponent's fork:
Option 1: The player should create two in a row to force the opponent into defending, as long as it doesn't result in them creating a fork. For example, if "X" has a corner, "O" has the center, and "X" has the opposite corner as well, "O" must not play a corner in order to win. (Playing a corner in this scenario creates a fork for "X" to win.)
Option 2: If there is a configuration where the opponent can fork, the player should block that fork.
Center: A player marks the center. (If it is the first move of the game, playing on a corner gives "O" more opportunities to make a mistake and may therefore be the better choice; however, it makes no difference between perfect players.)
Opposite corner: If the opponent is in the corner, the player plays the opposite corner.
Empty corner: The player plays in a corner square.
Empty side: The player plays in a middle square on any of the 4 sides.
*/
let state={
  debugOn: false,
  onTurn: 'o', /* who is on turn : none, o or x */
  move_map: [],
  pairs: {
    'x' : [],
    'o' : []
  },
  x_positions: [],
  o_positions: [],
  createMove: function(kind) {
    if (kind === "x")
      return $('<i>').addClass("fa fa-close");
    else
      return $('<i>').addClass("fa fa-circle-o");
  },
  handleTurn: function(id) {
    let x=(id-1)%3;
    let y=Math.trunc((id-1)/3);

    if (this.move_map[id]) return;
    let new_pairs = ft.find_pairs_for_position(ft.Position(parseInt(id)), this.move_map, this.onTurn);
    if(new_pairs) {
      new_pairs.reduce(function(r,p){
        r.push(p);
      },this.pairs[this.onTurn]);
    }
    this.move_map[id]=this.onTurn;
    $('#'+id).append(this.createMove(this.onTurn));
    if (this.onTurn === 'o') {
      this.o_positions.push(id);
      this.onTurn='x';
    }
    else {
      this.x_positions.push(id);
      this.onTurn='o';
    }

    dbg(`Turn on ${x}, ${y} id=${id} nextTurn=${this.onTurn} ${this.move_map} ${this.x_positions.toString()} ${this.o_positions.toString()}`);
  },
  findTurn: function() {
    console.log('findTurn start onTurn='+this.onTurn );
    let move=-1;
    //find next best move_ma
    /*
    Win: If the player has two in a row, they can place a third to get three in a row.
    */

    /*
    Block: If the opponent has two in a row, the player must play the third themselves to block the opponent.
    */

    /*
    Fork: Create an opportunity where the player has two threats to win (two non-blocked lines of 2).
    */
    for (let i=0; i<9; i++) {
      if (!this.move_map[i]) {
        let new_p = ft.find_pairs(ft.to2d(i), this.move_map, this.onTurn);
        console.log(' find_pairs for : '+ i);
        console.log(new_p);
        if (new_p.length == 2) {
          console.log(' fork possibility : ' + i);
          return i;
        }
        if (new_p.length == 1) {
          console.log('  pair possibility : ' + i);
          move = i;
        }
      }
    }
    if (move != -1) {
      console.log(' found pair possibility : ' +move);
      return move;
    }
    /*
    Blocking an opponent's fork:
    Option 1: The player should create two in a row to force the opponent into defending, as long as it doesn't result in them creating a fork. For example, if "X" has a corner, "O" has the center, and "X" has the opposite corner as well, "O" must not play a corner in order to win. (Playing a corner in this scenario creates a fork for "X" to win.)
    Option 2: If there is a configuration where the opponent can fork, the player should block that fork.
    Center: A player marks the center. (If it is the first move of the game, playing on a corner gives "O" more opportunities to make a mistake and may therefore be the better choice; however, it makes no difference between perfect players.)
    Opposite corner: If the opponent is in the corner, the player plays the opposite corner.
    Empty corner: The player plays in a corner square.
    Empty side: The player plays in a middle square on any of the 4 sides.
    */

    /* last possibility - first possible move */
    if (move===-1) {
      move=this.move_map.length;
      for (let i=0; i<this.move_map.length; i++) {
        if (!this.move_map[i]) {
          move = i;
          break;
        }
      }
    }
    console.log('  random move='+move);
    dbg('find_move : best move='+move);
    return move;
  }
};

var f = param => console.log(param);

f('es 6 working :)');

function turn_debug() {
  if (state.debugOn) {
    $('#debug').removeClass('pop');
    state.debugOn=false;
  }
  else {
    $('#debug').addClass('pop');
    state.debugOn=true;
  }
}

$(document).ready(function () {
  ut();
  $('#debug').click(turn_debug);
  state.findTurn();
  $('td').click(function () {
    state.handleTurn(this.id);
    state.findTurn();
  });
});
