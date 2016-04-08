/* The Floor object holds information about an individual floor within the
 * tower.
 */
var initFloor = function(RisingTower) {
  var Floor = RisingTower.Floor = function(phaser, world, worldY) {
    this._items = [];

    this._world = world;

    this._y = worldY;

    this._group = phaser.make.group(null);
  };

  Floor.prototype.group = function() {
    return this._group;
  };

  /* Returns the World to which this Floor belongs.
   */
  Floor.prototype.world = function() {
    return this._world;
  };

  Floor.prototype.forEachRoom = function(callback) {
    this._items.forEach(callback);
  };

  Floor.prototype.addRoom = function(room, worldX) {
    this._items.push(room);
  };

  /* Returns the world y coordinate for this floor.
   */
  Floor.prototype.y = function() {
    return this._y;
  };
};
