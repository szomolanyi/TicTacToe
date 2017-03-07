/*jshint esversion:6*/

const all_dirs = [
  [0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,1], [-1,0], [-1,-1]
];

const ft = {
  Position: function(i) {
    if (i<0 || i>8) return(undefined); //out of map
    return {
      index: i,
      x: i%3,
      y: Math.trunc(i/3),
      mv: function(direction) {
        let ynew = this.y+direction[1];
        let xnew = this.x+direction[0];
        if (xnew>=0 && xnew<3 && ynew>=0 && ynew<3)
          return ft.Position(ynew*3+xnew);
        else {
          return undefined;
        }
      }
    };
  },
  opponent: function(kind) {
    if (kind === 'x') return 'o';
    else return 'x';
  },
  reverse_direction: function(d) {
    return [-1*d[0], -1*d[1]];
  },
  get_pos: function(position, move_map) {
    if (!position) return undefined;
    return move_map[position.index];
  },
  opos_dir: function(dir) {
    return [dir[0]*-1, dir[1]*-1];
  },
  cmp: function(array1, array2) {
    if (array1 === undefined && array2 === undefined) return true;
    return (array1.length == array2.length) && array1.every(function(element, index) {
      if (Array.isArray(element) && Array.isArray(array2[index])) return ft.cmp(element, array2[index]);
      else return element === array2[index];
    });
  },
  is_middle_side: function(pos) {
    return (pos===1 || pos===3 || pos === 5 || pos === 7);
  },
  is_corner: function(pos) {
    return (pos===0 || pos===2 || pos===6 || pos===8);
  },
  opposite_corner: function(pos) {
    if (pos === 0) return 8;
    if (pos === 2) return 6;
    if (pos === 6) return 2;
    if (pos === 8) return 0;
  },
  compareRanks(rank1, rank2) {
    let rs1 = rank1.sort((a,b)=>a-b);
    let rs2 = rank2.sort((a,b)=>a-b);
    let i1 = rs1.length-1;
    let i2 = rs2.length-1;
    while (i1 >= 0 && i2 >=0) {
      if (rs1[i1] > rs2[i2]) return 1;
      if (rs1[i1] < rs2[i2]) return 2;
      i1-=1;
      i2-=1;
    }
    if (i1 === i2) return 0;
    if (i1 > i2) return 1;
    else return 2;
  },
  findTurn: function(player, move_map, level) {
    if (!level) level=0;
    /* turn_rank :
      0 : random
      1 : Empty side: The player plays in a middle square on any of the 4 sides.
      2 : Empty corner: The player plays in a corner square.
      3 : Opposite corner: If the opponent is in the corner, the player plays the opposite corner.
      4 : Center: A player marks the center. (If it is the first move of the game, playing on a corner gives "O" more opportunities to make a mistake and may therefore be the better choice; however, it makes no difference between perfect players.)
      5 : Blocking, Option 2: If there is a configuration where the opponent can fork, the player should block that fork.
      6 : Blocking, Option 1: The player should create two in a row to force the opponent into defending, as long as it doesn't result in them creating a fork. For example, if "X" has a corner, "O" has the center, and "X" has the opposite corner as well, "O" must not play a corner in order to win. (Playing a corner in this scenario creates a fork for "X" to win.)
      7 : Blocking an opponent's fork
      8 : Fork: Create an opportunity where the player has two threats to win (two non-blocked lines of 2).
      9 : Block: If the opponent has two in a row, the player must play the third themselves to block the opponent.
      10 : Win: If the player has two in a row, they can place a third to get three in a row.
    */
    let optimal_move = -1;
    let best_ranks=[];
    for (let i=0; i<9; i++) {
      if (!move_map[i]) {
        console.log(`checkTurn[${level},${player},${i}]`);
        let ranks = [];
        ranks.push(0);
        if (ft.is_middle_side) {
          //1 : Empty side: The player plays in a middle square on any of the 4 sides.
          //optimal_move = i;
          ranks.push(1);
        }
        if (ft.is_corner(i)) {
          //Empty corner: The player plays in a corner square.
          //optimal_move = i;
          ranks.push(2);
        }
        if (ft.is_corner(i) &&
          move_map[ft.opposite_corner(i)] === ft.opponent(player)) {
          //3 : Opposite corner: If the opponent is in the corner,
          //the player plays the opposite corner.
          //optimal_move = i;
          ranks.push(3);
        }
        if (i===4) {
          //Center: A player marks the center. (If it is the first move of the game,
          //playing on a corner gives "O" more opportunities to make a mistake
          //and may therefore be the better choice;
          //however, it makes no difference between perfect players.)
          //optimal_move = i;
          ranks.push(4);
        }
        let opponent_moves = ft.analyseMove(i, move_map, ft.opponent(player));
        if (opponent_moves.pairs > 1) {
          //5 : Blocking, Option 2: If there is a configuration where the opponent can fork,
          //the player should block that fork.
          //optimal_move = i;
          ranks.push(5);
        }
        let my_moves = ft.analyseMove(i, move_map, player );
        if (opponent_moves.pairs > 1) {
          //7 : Blocking an opponent's fork
          //optimal_move = i;
          ranks.push(6);
        }
        if (my_moves.pairs > 0) {
          //6 : Blocking, Option 1: The player should create two in a row to force the opponent into defending,
          //as long as it doesn't result in them creating a fork. For example, if "X" has a corner,
          //"O" has the center, and "X" has the opposite corner as well,
          //"O" must not play a corner in order to win.
          //(Playing a corner in this scenario creates a fork for "X" to win.)
          let tmp_res=[];
          if (level === 0) {
            let tmp_map = move_map.slice();
            tmp_map[i] = player; //simulate turn
            tmp_res = ft.findTurn(ft.opponent(player), tmp_map, 1);
            let ranks_temp = tmp_res[1];
            if (ranks_temp.indexOf(8) === -1) {
            //optimal_move = i;
              ranks.push(7);
            }
          }
        }
        if (my_moves.pairs > 1) {
          //8 : Fork: Create an opportunity where the player has two threats to win (two non-blocked lines of 2).
          //optimal_move = i;
          ranks.push(8);
        }
        if (opponent_moves.trinities > 0) {
          //9 : Block: If the opponent has two in a row, the player must play the third themselves to block the opponent.
          //optimal_move = i;
          ranks.push(9);
        }
        if (my_moves.trinities > 0) {
          //10 : Win: If the player has two in a row, they can place a third to get three in a row.
          //optimal_move = i;
          ranks.push(10);
        }
        if (ft.compareRanks(best_ranks, ranks) === 2) {
          optimal_move=i;
          best_ranks = ranks.slice(0);
        }
        console.log(`checkTurn end [${level},${player},${i}]=${optimal_move} ranks=${ranks} best_ranks=${best_ranks}`);
      }
    }
    console.log(`findTurn end [${level},${player}]=${optimal_move} best_ranks=${best_ranks}`);
    return [optimal_move, best_ranks];
  },
  player_pos: function(pos, move_map, player) {
    return pos && move_map[pos.index] === player;
  },
  free_pos: function(pos, move_map) {
    return pos && !move_map[pos.index];
  },
  analyseMove: function(move, move_map, player) {
    let p=ft.Position(move);
    return all_dirs.reduce(function(res, dir) {
      //analyse all directions
      let p1 = p.mv(dir);
      let p2 = null;
      if (p1) p2 = p1.mv(dir);
      let p_opos = p.mv(ft.opos_dir(dir));
      if (ft.player_pos(p1, move_map, player) && ft.player_pos(p2, move_map, player))
        res.trinities++;
      if (ft.player_pos(p1, move_map, player) && ft.player_pos(p_opos, move_map, player))
        res.trinities++;
      else if (ft.player_pos(p_opos, move_map, player) && ft.free_pos(p1, move_map))
        res.pairs++;
      else if (ft.player_pos(p1, move_map, player) && ft.free_pos(p2, move_map))
        res.pairs++;
      else if (ft.player_pos(p2, move_map, player) && ft.free_pos(p1, move_map))
        res.pairs++;
      return res;
    }, {
      pairs: 0,
      trinities: 0
    });
  }
};


module.exports = ft;
