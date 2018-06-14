const Node = require('./Node');

function Matrix(problem) {
  let _col_ids = [];
  let _sizes = [];
  let _nodes = [];
  
  let self = this;
  
  let _createNode = function _createNode(x, y) {
    if (x >= problem.width()) {
      throw Error('Invalid X position: greater than width');
    }
    
    let newId = _nodes.length;
    _nodes.push(new Node(newId, x, y));
    return newId;
  };
  
  let _addRow = function _addRow(y, xs) {
    let firstId = 0;
    xs.forEach((x) => {
      let nodeId = _createNode(x, y);
      
      // insert into the column
      _nodes[nodeId].down = self.C(nodeId);
      _nodes[nodeId].up = self.U(self.C(nodeId));
      
      _nodes[self.U(self.C(nodeId))].down = nodeId;
      _nodes[self.C(nodeId)].up = nodeId;
      
      _sizes[x] += 1;
      
      if (firstId === 0) {
        firstId = nodeId;
      } else {
        _nodes[nodeId].right = firstId;
        _nodes[nodeId].left = self.L(firstId);
        _nodes[self.L(firstId)].right = nodeId;
        _nodes[firstId].left = nodeId;
      }
    });
  };
  
  let _detachLeftRight = function _detachLeftRight(id) {
    _nodes[self.L(id)].right = self.R(id);
    _nodes[self.R(id)].left = self.L(id);
  };
  
  let _detachUpDown = function _detachUpDown(id) {
    _nodes[self.U(id)].down = self.D(id);
    _nodes[self.D(id)].up = self.U(id);
  };
  
  let _reattachLeftRight = function _reattachLeftRight(id) {
    _nodes[self.L(id)].right = id;
    _nodes[self.R(id)].left = id;
  };
  
  let _reattachUpDown = function _reattachUpDown(id) {
    _nodes[self.U(id)].down = id;
    _nodes[self.D(id)].up = id;
  };
  
  this.coverColumn = function coverColumn(columnId) {
    let column = self.C(columnId);
    _detachLeftRight(column);
    for (let i = self.D(column); i != column; i = self.D(i)) {
      // detach entire row
      for (let j = self.R(i); j != i; j = self.R(j)) {
        _detachUpDown(j);
        _sizes[self.X(j)] -= 1;
      }
    }
  };
  
  this.uncoverColumn = function coverColumn(columnId) {
    let column = self.C(columnId);
    for (let i = self.U(column); i != column; i = self.U(i)) {
      // reattach entire row
      for (let j = self.L(i); j != i; j = self.L(j)) {
        _reattachUpDown(j);
        _sizes[self.X(j)] += 1;
      }
    }
    _reattachLeftRight(column);
  };
  
  this.width = function width() {
    return _col_ids.length;
  };
  
  this.root = function root() {
    return 0;
  };
  
  this.X = function X(id) {
    return _nodes[id].x;
  };
  
  this.Y = function Y(id) {
    return _nodes[id].y;
  };
  
  this.S = function S(id) {
    return _sizes[this.X(id)];
  };
  
  this.C = function C(id) {
    return _col_ids[this.X(id)];
  };
  
  this.L = function L(id) {
    return _nodes[id].left;
  };
  
  this.R = function R(id) {
    return _nodes[id].right;
  };
  
  this.U = function U(id) {
    return _nodes[id].up;
  };
  
  this.D = function D(id) {
    return _nodes[id].down;
  };
  
  // initialiser
  
  // creating 'h' head node
  let root = _createNode(0, 0);
  for (let x = 0; x < problem.width(); x += 1) {
    // create column header
    let nodeId = _createNode(x, 0);
    _col_ids.push(nodeId);
    _sizes.push(0);
    
    _nodes[nodeId].right = root;
    _nodes[nodeId].left = this.L(root);
    _nodes[this.L(root)].right = nodeId;
    _nodes[root].left = nodeId;
  }
  problem.rows()
    .forEach((row, idx) => {
      _addRow(idx, row);
    });
}

module.exports = Matrix;