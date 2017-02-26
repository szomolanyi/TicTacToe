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
  reverse_kind: function(kind) {
    if (kind === 'x') return 'o';
    else return 'x';
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
  find_pairs_for_position: function(position, move_map, player) {
    /* iterate for all possible directions */
    return all_dirs.reduce(function(res, d) {
      let pos1 = position.mv(d); /* position in direction d */
      if (pos1 && ft.get_pos(pos1, move_map) === player) {
        /* pair possibility, check if trinity is possible too */
        let pos2 = pos1.mv(d); /* check if position in same direction is free */
        if (pos2 && ft.get_pos(pos2, move_map) !== ft.opponent(player))
          res.push([position.index, pos1.index].sort());
        let pos3 = position.mv(ft.reverse_direction(d)); /* check if position in reverse direction is free */
        if (pos3 && ft.get_pos(pos3, move_map) !== ft.opponent(player))
          res.push([position.index, pos1.index].sort());
      }
      return res;
    }, []);
  },
  find_pairs: function(p, move_map, kind) {
    return all_dirs.reduce(function(res, e){
      let n = ft.mv(p, e);
      if (!n) return res;
      if (move_map[ft.to1d(n)] === kind)
        { /* pair possibility, check if trinity is possible too */
          let nn = ft.mv(n, e);
          if (nn && move_map[ft.to1d(nn)] !== ft.reverse_kind(kind))
            res.push([ft.to1d(p), ft.to1d(n)].sort());
          nn = ft.mv(p, ft.reverse_direction(e));
          if (nn && move_map[ft.to1d(nn)] !== ft.reverse_kind(kind))
            res.push([ft.to1d(p), ft.to1d(n)].sort());
        }
      return res;
    }, []);
  },
  mv: function(p, dir) {
    let pnew = [p[0]+dir[0], p[1]+dir[1]];
    if (pnew[0] >= 0 && pnew[0] <= 2 && pnew[1] >= 0 && pnew[1] <= 2) return pnew;
    return undefined;
  },
  opos_dir: function(dir) {
    return [dir[0]*-1, dir[1]*-1];
  },
  to2d: function(id) {
    return [id%3, Math.trunc(id/3)];
  },
  direction: function(p1, p2) {
    return [p2.x-p1.x, p2.y-p1.y];
  },
  to1d: function(p) {
    return p[0] + p[1]*3;
  },
  cmp: function(array1, array2) {
    if (array1 === undefined && array2 === undefined) return true;
    return (array1.length == array2.length) && array1.every(function(element, index) {
      if (Array.isArray(element) && Array.isArray(array2[index])) return ft.cmp(element, array2[index]);
      else return element === array2[index];
    });
  },
  find_trinity_old: function(pair, move_map) {
    let p1 = ft.to2d(pair[0]);
    let p2 = ft.to2d(pair[1]);
    let dir = ft.direction(p1, p2);
    return [ft.mv(p2, dir), ft.mv(p1, ft.opos_dir(dir))].reduce(function(r, e) {
      if (e) {
        let i = ft.to1d(e);
        if (!move_map[i]) r.push(i);
      }
      return r;
    }, []);
  },
  find_trinity: function(pair, move_map) {
    let p1 = ft.Position(pair[0]);
    let p2 = ft.Position(pair[1]);
    let dir = ft.direction(p1, p2);
    return [p2.mv(dir), p1.mv(ft.opos_dir(dir))].reduce(function(r, p) {
      if (p && !move_map[p.index]) r.push(p.index);
      return r;
    }, []);
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
  findTurn: function(player, move_map, level) {
    if (!level) level=0;
    console.log('findTurn['+level+'] start onTurn='+player );
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
    let rank = -1;
    let optimal_move = -1;
    for (let i=0; i<9; i++) {
      if (!move_map[i]) {
        let my_moves = ft.analyseMove(i, move_map, player );
        if (my_moves.trinities > 0 && level === 0) {
          //10 : Win: If the player has two in a row, they can place a third to get three in a row.
          optimal_move = i;
          rank = 10;
          break;
        }
        let opponent_moves = ft.analyseMove(i, move_map, ft.opponent(player));
        if (opponent_moves.trinities > 0 && rank < 9 && level === 0) {
          //9 : Block: If the opponent has two in a row, the player must play the third themselves to block the opponent.
          optimal_move = i;
          rank = 9;
        }
        if (my_moves.pairs > 1 && rank < 8) {
          //8 : Fork: Create an opportunity where the player has two threats to win (two non-blocked lines of 2).
          optimal_move = i;
          rank = 8;
        }
        if (opponent_moves.pairs > 1 && rank < 6) {
          //7 : Blocking an opponent's fork
          optimal_move = i;
          rank = 6;
        }
        if (my_moves.pairs > 0 && rank < 7) {
          //6 : Blocking, Option 1: The player should create two in a row to force the opponent into defending,
          //as long as it doesn't result in them creating a fork. For example, if "X" has a corner,
          //"O" has the center, and "X" has the opposite corner as well,
          //"O" must not play a corner in order to win.
          //(Playing a corner in this scenario creates a fork for "X" to win.)
          let tmp_res=[];
          if (level === 0) {
            let tmp_map = move_map.slice();
            tmp_map[i] = player; //simulate turn
            console.log('  checking rank 6 for '+i);
            tmp_res = ft.findTurn(ft.opponent(player), tmp_map, 1);
          }
          else tmp_res=[0, 0]; /* dummy */
          if (tmp_res[1] === 8) {
            optimal_move = i;
            rank = 7;
          }
        }
        if (opponent_moves.pairs > 1 && rank < 5) {
          //5 : Blocking, Option 2: If there is a configuration where the opponent can fork,
          //the player should block that fork.
          optimal_move = i;
          rank = 5;
        }
        if (i===4 && rank < 4) {
          //Center: A player marks the center. (If it is the first move of the game,
          //playing on a corner gives "O" more opportunities to make a mistake
          //and may therefore be the better choice;
          //however, it makes no difference between perfect players.)
          optimal_move = i;
          rank = 4;
        }
        if (ft.is_corner(i) &&
          move_map[ft.opposite_corner(i)] === ft.opponent(player) &&
          rank < 3) {
          //3 : Opposite corner: If the opponent is in the corner,
          //the player plays the opposite corner.
          optimal_move = i;
          rank = 3;
        }
        if (ft.is_corner(i) && rank < 2) {
          //Empty corner: The player plays in a corner square.
          optimal_move = i;
          rank = 2;
        }
        if (ft.is_middle_side && rank < 1) {
          //1 : Empty side: The player plays in a middle square on any of the 4 sides.
          optimal_move = i;
          rank = 1;
        }
        if (rank < 0) {
          optimal_move = i;
          rank = 0;
        }
      }
    }
    console.log('findTurn level='+level+' ('+player+') best_move:'+optimal_move+' rank:'+rank);
    return [optimal_move, rank];
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
