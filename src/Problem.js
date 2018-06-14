function Problem(width) {
  let _width = width;
  let _rows = [];
  
  this.width = function width() {
    return _width;
  };
  
  this.rows = function rows() {
    return _rows.concat([]);
  };
  
  this.addRow = function addRow(rowArg) {
    let row = rowArg.concat([]);
    row.sort();
    
    for (let i = 0; i < row.length; i += 1) {
      if (row[i] >= _width) {
        throw new Error('Column out of range in row');
      }
      if (i > 0 && row[i - 1] === row[i]) {
        throw new Error('Duplicate columns in row');
      }
    }
    
    _rows.push(row);
  }
}

module.exports = Problem;