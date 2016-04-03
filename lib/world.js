/* This contains the state of our world.
 */
var initWorld = function(RisingTower) {
  var World = RisingTower.World = function() {
    this._selectionBox = new Phaser.Rectangle(100, 100, World.UNIT_WIDTH * 4, World.UNIT_HEIGHT);
  };

  World.UNIT_WIDTH = 32;
  World.UNIT_HEIGHT = 64;

  World.prototype.selectionBox = function() {
    return this._selectionBox.clone();
  };

  World.prototype.moveSelectionBox = function(x, y) {
    x = x - this._selectionBox.width/2 + World.UNIT_WIDTH/2;
    x = x - (x % World.UNIT_WIDTH);
    y = y - World.UNIT_HEIGHT;
    y = y - (y % World.UNIT_HEIGHT);
    this._selectionBox.setTo(x,
                             y,
                             this._selectionBox.width,
                             this._selectionBox.height);
  };
};
