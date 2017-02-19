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
};


module.exports = ft;
