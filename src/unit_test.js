/*jshint esversion:6*/

const ft = require("./func_tools.js");

function unit_test() {
  test_analyse('analyse move 1 ... ', ft.analyseMove(0, [], 'x'), {'trinities': 0, 'pairs': 0});
  test_analyse('analyse move 2 ... ', ft.analyseMove(0, [undefined, 'x'], 'x'), {'trinities': 0, 'pairs': 1});
  test_analyse('analyse move 3 ... ', ft.analyseMove(0, [undefined, 'x', 'x'], 'x'), {'trinities': 1, 'pairs': 0});
  test_analyse('analyse move 4 ... ', ft.analyseMove(1, ['x', undefined, 'x'], 'x'), {'trinities': 2, 'pairs': 0});
  test_analyse('analyse move 5 ... ', ft.analyseMove(4, [undefined, 'x', undefined, 'x'], 'x'), {'trinities': 0, 'pairs': 2});
  test_analyse('analyse move 6 ... ', ft.analyseMove(0, [undefined, undefined, 'x'], 'x'), {'trinities': 0, 'pairs': 1});
  test_analyse('analyse move 7 ... ', ft.analyseMove(7, ['x', 'o', undefined, undefined, 'o', undefined, undefined, undefined, 'x'], 'x'), {'trinities': 0, 'pairs': 1});
  test_analyse('analyse move 7 ... ', ft.analyseMove(7, ['x', 'o', undefined, undefined, 'o', undefined, undefined, undefined, 'x'], 'x'), {'trinities': 0, 'pairs': 1});
  test_rank('compareRanks 1 ... ', ft.compareRanks([0,1,2,9],[0,1,7]), 1);
  /*test_cmp('find_trinity 3 ... ', ft.find_trinity([0,1], []), [2]);

  test_cmp('find pairs 3 ... ', ft.find_pairs_for_position(ft.Position(4), [undefined,'x',undefined,'x'], 'x'),[[1,4],[3,4]]);

  test_cmp('find pairs 9 ... ', ft.find_pairs_for_position(ft.Position(1), ['x', undefined, undefined, undefined, 'o', undefined, undefined, 'o', undefined], 'x'),
    [[0,1]]);

  console.log('to2d(0) ...', ft.cmp(ft.to2d(0), [0,0]), 0===ft.to1d(ft.to2d(0)));
  console.log('to2d(1) ...', ft.cmp(ft.to2d(1), [1,0]), 1===ft.to1d(ft.to2d(1)));
  console.log('to2d(2) ...', ft.cmp(ft.to2d(2), [2,0]), 2===ft.to1d(ft.to2d(2)));
  console.log('to2d(3) ...', ft.cmp(ft.to2d(3), [0,1]), 3===ft.to1d(ft.to2d(3)));
  console.log('to2d(4) ...', ft.cmp(ft.to2d(4), [1,1]), 4===ft.to1d(ft.to2d(4)));
  console.log('to2d(5) ...', ft.cmp(ft.to2d(5), [2,1]), 5===ft.to1d(ft.to2d(5)));
  console.log('to2d(6) ...', ft.cmp(ft.to2d(6), [0,2]), 6===ft.to1d(ft.to2d(6)));
  console.log('to2d(7) ...', ft.cmp(ft.to2d(7), [1,2]), 7===ft.to1d(ft.to2d(7)));
  console.log('to2d(8) ...', ft.cmp(ft.to2d(8), [2,2]), 8===ft.to1d(ft.to2d(8)));
  console.log('test direction 1 ... ', ft.cmp(
    ft.direction(ft.Position(5), ft.Position(7)),
    [-1, 1])
  );
  console.log('test direction 2 ... ', ft.cmp(
    ft.direction(ft.Position(7), ft.Position(5)),
    [1, -1])
  );
  console.log('test direction 3 ... ', ft.cmp(
    ft.direction(ft.Position(1), ft.Position(2)),
    [1, 0])
  );
  console.log('test direction 4 ... ', ft.cmp(
    ft.direction(ft.Position(1), ft.Position(4)),
    [0, 1])
  );
  console.log('test direction 5 ... ', ft.cmp(
    ft.direction(ft.Position(4), ft.Position(1)),
    [0, -1])
  );
  console.log('test mv 1 ... ', ft.cmp(ft.mv([0,0], [1,0], []), [1,0]));
  console.log('test mv 2 ... ', ft.cmp(ft.mv([0,0], [-1,0], []), undefined));
  console.log('test mv 3 ... ', ft.cmp(ft.mv([0,1], [0,1], []), [0,2]));
  console.log('test mv 4 ... ', ft.cmp(ft.mv([2,1], [-1,-1], []), [1,0]));
  console.log('find_trinity 1 ... ', ft.cmp(ft.find_trinity([1,2], []), [0]));
  console.log('find_trinity 2 ... ', ft.cmp(ft.find_trinity([1,2], ['x','x']), []));
  console.log('find_trinity 4 ... ', ft.cmp(ft.find_trinity([0,4], []), [8]));
  console.log('find_trinity 5 ... ', ft.cmp(ft.find_trinity([2,5], []), [8]));
  console.log('find_trinity 6 ... ', ft.cmp(ft.find_trinity([0,3], []), [6]));
  console.log('find_trinity 7 ... ', ft.cmp(ft.find_trinity([4,6], []), [2]));
  console.log('find_trinity 8 ... ', ft.cmp(ft.find_trinity([1,5], []), []));
  console.log('find pairs 1 ... ', ft.cmp(ft.find_pairs_for_position(ft.Position(4), [], 'x'), []));
  console.log('find pairs 2 ... ', ft.cmp(ft.find_pairs_for_position(ft.Position(4), [undefined,'x'], 'x'), [[1,4]]));
  console.log('find pairs 4 ... ', ft.cmp(ft.find_pairs_for_position(ft.Position(4), [undefined,'x',undefined,'x'], 'x'),[[1,4],[3,4]]));
  console.log('find pairs 5 ... ', ft.cmp(ft.find_pairs_for_position(ft.Position(1), [], 'x'), []));
  test_cmp('find pairs 7 ... ', ft.find_pairs_for_position(ft.Position(8), ['o', undefined, undefined, 'o', 'x', undefined, undefined, undefined, undefined], 'x'),
    []);
  test_cmp('find pairs 8 ... ', ft.find_pairs_for_position(ft.Position(7), ['o', undefined, undefined, 'o', 'x', undefined, undefined, undefined, undefined], 'x'),
    [[4,7]]);*/
}

function test_rank(text, res, expected) {
  if (res ===  expected) {
    console.log(text, true);
  }
  else {
    console.log(text, false);
  }
}

function test_analyse(text, res, expected) {
  if (!res ) {
    console.log(text, false, '; result=');
    console.log(res);
    return;
  }
  if (res.pairs === expected.pairs && res.trinities === expected.trinities)
    console.log(text, true);
  else {
    console.log(text, false, '; result=');
    console.log(res);
  }
}

function test_cmp(text, rr, res) {
  if (ft.cmp(rr, res)) {
    console.log(text, true);
  }
  else {
    console.log(text, false, '; result=');
    console.log(rr);
  }
}

module.exports = unit_test;
