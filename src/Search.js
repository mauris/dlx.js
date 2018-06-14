const Matrix = require('./Matrix');

function Search(problem) {
  let _matrix = new Matrix(problem);
  let _solutionsLimit = 5;
  let _solutions = [];
  
  this.solutions = function solutions() {
    return _solutions;
  };
  
  this.search = function search(stackArg) {
    if (_solutions.length >= _solutionsLimit) {
      // limit reached
      return;
    }
    
    let stack = stackArg;
    if (stack === undefined) {
      stack = [];
    }
    
    let h = _matrix.root();
    if (_matrix.R(h) === h) {
      // solution found
      _solutions.push(stack.concat([]));
      return;
    }
    
    let selectedColumn = _matrix.R(h);
    for (let j = _matrix.R(h); j != h; j = _matrix.R(j)) {
      if (_matrix.S(j) < _matrix.S(selectedColumn)) {
        selectedColumn = j;
      }
    }
    
    if (_matrix.S(selectedColumn) === 0) {
      // back tracking needed
      return;
    }
    
    _matrix.coverColumn(selectedColumn);
    for (let r = _matrix.D(selectedColumn); r != selectedColumn; r = _matrix.D(r)) {
      stack.push(_matrix.Y(r));
      for (let j = _matrix.R(r); j != r; j = _matrix.R(j)) {
        _matrix.coverColumn(j);
      }
      this.search(stack);
      if (_solutions.length >= _solutionsLimit) {
        return;
      }
      stack.pop();
      for (let j = _matrix.L(r); j != r; j = _matrix.L(j)) {
        _matrix.uncoverColumn(j);
      }
    }
    _matrix.uncoverColumn(selectedColumn);
  }
}

module.exports = Search;