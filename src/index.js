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
  start2player: function() {

  },
  start1playerx: function() {

  },
  start1playero: function() {

  },
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
