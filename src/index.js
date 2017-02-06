/*jshint esversion:6*/

require("./styles/style.css");
require("jquery");
require("font-awesome-webpack");

// Main app
function dbg(msg) {
  let p=$('<p>').html(msg);
  $('#debug').append(p);
}

let state={
  debugOn: false,
  onTurn: 'none', /* who is on turn : none, 0 or x */
  handleTurn: function(id) {
    let x=(id-1)%3;
    let y=Math.trunc((id-1)/3);

    if (this.onTurn === '0') {
      this.onTurn='x';
    }
    else {
      this.onTurn='0';
    }
    dbg(`Turn on ${x}, ${y} id=${id} nextTurn=${this.onTurn}`);
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
  $('#debug').click(turn_debug);
  $('td').click(function () {
    state.handleTurn(this.id);
  });
});
