/* The Elevator object represents an elevator object.
 */
var initElevator = function(RisingTower) {
  var Elevator = RisingTower.Elevator = function(phaser, info, index, worldX, worldY) {
    this._info  = info;
    this._index = index;
    this._x     = worldX;
    this._y     = worldY;

    this._shaftSprite = phaser.make.sprite(worldX, worldY, 'elevators/normal/shaft');
    this._upperSprite = phaser.make.sprite(worldX, worldY - RisingTower.World.UNIT_HEIGHT, 'elevators/normal/upper');
    this._lowerSprite = phaser.make.sprite(worldX, worldY + RisingTower.World.UNIT_HEIGHT, 'elevators/normal/lower');

    this._group = phaser.make.group();
    this._group.add(this._shaftSprite);
    this._group.add(this._upperSprite);
    this._group.add(this._lowerSprite);
  };

  Elevator.prototype.group = function() {
    return this._group;
  };

  Elevator.prototype.x = function() {
    return this._x;
  };

  Elevator.prototype.index = function() {
    return this._index;
  };

  Elevator.prototype.info = function() {
    return this._info;
  };
};
