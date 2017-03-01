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


let state={
  debugOn: false,
  onTurn: 'x', /* who is on turn : none, o or x */
  move_map: [],
  pairs: {
    'x' : [],
    'o' : []
  },
  x_positions: [],
  o_positions: [],
  gameType : 1,
  gameOver : false,
  turnsDone : 0,
  start2player: function() {
    this.reset(2, 'x');
  },
  start1playerx: function() {
    this.reset(1, 'x');
  },
  start1playero: function() {
    this.reset(1, 'o');
  },
  reset: function(gametype, on_turn) {
    this.gameType = gametype;
    this.onTurn = on_turn;
    this.move_map = [];
    for (let i=0; i<9; i++) $('#'+i).html('');
    this.gameOver = false;
    this.turnsDone = 0;
  },
  createMove: function(kind) {
    if (kind === "x")
      return $('<i>').addClass("fa fa-close");
    else
      return $('<i>').addClass("fa fa-circle-o");
  },
  handleTurn: function(id) {
    if (this.gameOver) return;
    let x=(id-1)%3;
    let y=Math.trunc((id-1)/3);

    if (this.move_map[id]) return;
    let moves = ft.analyseMove(id, this.move_map, this.onTurn);
    if (moves.trinities > 0) {
      console.log('Game over: '+this.onTurn + ' wins');
      this.gameOver = true;
    }
    this.move_map[id]=this.onTurn;
    this.turnsDone+=1;
    if (!this.gameOver && this.turnsDone === 9) {
      console.log('Game over : tie');
      this.gameOver = true;
    }
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
  ft.findTurn(state.onTurn, state.move_map);
  $('td').click(function () {
    state.handleTurn(this.id);
    ft.findTurn(state.onTurn, state.move_map);
  });
  $('span#2player').click(() => state.start2player());
  $('span#1playerx').click(() => state.start1playerx());
  $('span#1playero').click(() => state.start1playero());
});
