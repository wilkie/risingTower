/* This contains the state of our world.
 */
var initWorld = function(RisingTower) {
  var World = RisingTower.World = function() {
    this._selectionBox = new Phaser.Rectangle(100, 100, 100, 50);
  };

  World.prototype.selectionBox = function() {
    return this._selectionBox.clone();
  };

  World.prototype.moveSelectionBox = function(x, y) {
    this._selectionBox.setTo(x,
                             y,
                             this._selectionBox.width,
                             this._selectionBox.height);
  };
};
