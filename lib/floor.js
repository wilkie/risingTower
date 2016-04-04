/* The Floor object holds information about an individual floor within the
 * tower.
 */
var initFloor = function(RisingTower) {
  var Floor = RisingTower.Floor = function(worldY) {
    this._items = [];

    this._group = Floor._phaser.make.group();

    this._y = worldY;
  };

  Floor.prototype.forEachRoom = function(callback) {
    this._items.forEach(callback);
  };

  Floor.prototype.group = function() {
    return this._group;
  };

  Floor.prototype.addRoom = function(room, worldX) {
    this._items.push({
      'x': worldX,
      'room': room
    });

    room.moveTo(worldX, this._y);
    var room = room.sprite();
    this._group.add(room);
    room.alpha = 0.5;
  };

  Floor.prototype.render = function() {
  };

  Floor.preload = function(phaser) {
    Floor._phaser = phaser;
  };
};
