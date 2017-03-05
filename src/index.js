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
  gameOver : true,
  lockUI : false,
  turnsDone : 0,
  computerOnTurn : false,
  labels: {
    'x': {
      'turn' : undefined,
      'win' : undefined
    },
    'o': {
      'turn' : undefined,
      'win' : undefined
    }
  },
  start2player: function() {
    this.reset(2, 'x');
    this.computerOnTurn = false;
    this.setLabels();
  },
  start1playerx: function() {
    this.reset(1, 'x');
    this.computerOnTurn = false;
    this.setLabels();
  },
  start1playero: function() {
    this.reset(1, 'x');
    this.computerOnTurn = true;
    this.setLabels();
    let bestTurn = ft.findTurn(state.onTurn, state.move_map);
    //one player gameType - computers turn
    setTimeout(function() {
      state.handleTurn(bestTurn[0]);
      ft.findTurn(state.onTurn, state.move_map);
    }, 1000);
  },
  /*
  Player x turn !
  Player o turn !
  Computer turn !
  Your turn !

  Player x wins !
  Player o wins !
  You lost !
  You win !
  */
  setLabels: function() {
    let x="&nbsp;<i class='fa fa-close'></i>&nbsp;";
    let o="&nbsp;<i class='fa fa-circle-o'></i>&nbsp;";
    let who='';
    if (this.computerOnTurn) who = 'computer';
    else who = 'human';
    if (this.gameType === 2) {
      this.labels.x.turn = 'Player'+x+'turn !';
      this.labels.o.turn = 'Player'+o+'turn !';
      this.labels.x.win = 'Player'+x+'wins !';
      this.labels.o.win = 'Player'+o+'wins !';
    }
    else {
      if (this.computerOnTurn) {
        this.labels.x.turn = 'Computer turn !';
        this.labels.o.turn = 'Your turn !';
        this.labels.x.win = 'Computer wins !';
        this.labels.o.win = 'Player wins !';
      }
      else {
        this.labels.o.turn = 'Computer turn !';
        this.labels.x.turn = 'Your turn !';
        this.labels.o.win = 'Computer wins !';
        this.labels.x.win = 'Player wins !';
      }
    }
    $('div#label1').html(this.labels.x.turn);
    $('div#label2').html(this.labels.o.turn);
  },
  switchL1: function() {
    $('div#label1').css('top', '0px');
    $('div#label2').css('top', '250px');
  },
  switchL2: function() {
    $('div#label1').css('top', '-250px');
    $('div#label2').css('top', '0px');
  },
  reset: function(gametype, on_turn) {
    this.gameType = gametype;
    this.onTurn = on_turn;
    this.move_map = [];
    for (let i=0; i<9; i++) $('#'+i).html('');
    this.gameOver = false;
    this.lockUI = false;
    this.turnsDone = 0;
    this.switchL1();
  },
  createMove: function(kind) {
    if (kind === "x")
      return $('<i>').addClass("fa fa-close");
    else
      return $('<i>').addClass("fa fa-circle-o");
  },
  handleWin: function() {
    console.log('Game over: '+this.onTurn + ' wins');
    this.gameOver = true;
    if (this.onTurn === 'x') {
      $('div#label2').html(this.labels.x.win);
    }
    else {
      $('div#label1').html(this.labels.o.win);
    }
  },
  handleTie: function() {
    console.log('Game over : tie');
    this.gameOver = true;
    if (this.onTurn === 'x') {
      $('div#label2').html('Game tied');
    }
    else {
      $('div#label1').html('Game tied');
    }
  },
  handleTurn: function(id) {
    let x=(id-1)%3;
    let y=Math.trunc((id-1)/3);

    if (this.move_map[id]) return;
    let moves = ft.analyseMove(id, this.move_map, this.onTurn);
    if (moves.trinities > 0) {
      this.handleWin();
    }
    this.move_map[id]=this.onTurn;
    this.turnsDone+=1;
    if (!this.gameOver && this.turnsDone === 9) {
      this.handleTie();
    }
    $('#'+id).append(this.createMove(this.onTurn));
    if (this.onTurn === 'o') {
      this.switchL1();
      this.o_positions.push(id);
      this.onTurn='x';
    }
    else {
      this.switchL2();
      this.x_positions.push(id);
      this.onTurn='o';
    }

    dbg(`Turn on ${x}, ${y} id=${id} nextTurn=${this.onTurn} ${this.move_map} ${this.x_positions.toString()} ${this.o_positions.toString()}`);
  }

};

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
  let bestTurn = ft.findTurn(state.onTurn, state.move_map);
  $('td').click(function () {
    if (state.gameOver || state.lockUI) return;
    state.lockUI = true;
    state.handleTurn(this.id);
    let bestTurn = ft.findTurn(state.onTurn, state.move_map);
    if (state.gameType === 1 && !state.gameOver) {
      //one player gameType - computers turn
      setTimeout(function() {
        state.handleTurn(bestTurn[0]);
        ft.findTurn(state.onTurn, state.move_map);
        state.lockUI = false;
      }, 1000);
    }
    else {
      state.lockUI = false;
    }
  });
  $('span#2player').click(() => state.start2player());
  $('span#1playerx').click(() => state.start1playerx());
  $('span#1playero').click(() => state.start1playero());
});
