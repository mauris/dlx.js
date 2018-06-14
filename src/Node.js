function Node(id, x, y) {
  this.nodeId = id;
  this.x = x;
  this.y = y;
  this.left = id;
  this.right = id;
  this.up = id;
  this.down = id;
}

module.exports = Node;