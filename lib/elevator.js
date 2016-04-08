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

    this._group = phaser.make.group(null);
    this._group.add(this._shaftSprite);
    this._group.add(this._upperSprite);
    this._group.add(this._lowerSprite);
    this._group.alpha = 0.5;

    this._shaftSprites = [];
    this._shaftSprites.push(this._shaftSprite);

    this._bounds = new Phaser.Rectangle(worldX,
                                        worldY - RisingTower.World.UNIT_HEIGHT,
                                        this._shaftSprite.width,
                                        RisingTower.World.UNIT_HEIGHT * 3);


    this._dragPoint = false;
  };

  Elevator.UPPER = 1;
  Elevator.LOWER = 2;

  Elevator.prototype.mouseDragEvent = function(pointer, x, y) {
    if (this._dragPoint == Elevator.UPPER) {
      if (y < 0) {
        this._upperSprite.y -= RisingTower.World.UNIT_HEIGHT;
        this._y -= RisingTower.World.UNIT_HEIGHT;
        this._bounds.y -= RisingTower.World.UNIT_HEIGHT;
        this._bounds.height += RisingTower.World.UNIT_HEIGHT;
        var shaftSprite = this._upperSprite.game.make.sprite(this._x, this._y, 'elevators/normal/shaft');
        this._shaftSprites.unshift(shaftSprite);
        this._group.add(shaftSprite);
      }
      else if (y > RisingTower.World.UNIT_HEIGHT) {
        this._upperSprite.y += RisingTower.World.UNIT_HEIGHT;
        this._y += RisingTower.World.UNIT_HEIGHT;
        this._bounds.y += RisingTower.World.UNIT_HEIGHT;
        this._bounds.height -= RisingTower.World.UNIT_HEIGHT;
        var shaftSprite = this._shaftSprites.shift();
        shaftSprite.destroy();
      }
    }
    else if (this._dragPoint == Elevator.LOWER) {
      if (y < this._bounds.height - RisingTower.World.UNIT_HEIGHT) {
        this._lowerSprite.y -= RisingTower.World.UNIT_HEIGHT;
        this._bounds.height -= RisingTower.World.UNIT_HEIGHT;
        var shaftSprite = this._shaftSprites.pop();
        shaftSprite.destroy();
      }
      else if (y > this._bounds.height) {
        this._bounds.height += RisingTower.World.UNIT_HEIGHT;
        var shaftSprite = this._upperSprite.game.make.sprite(this._x, this._lowerSprite.y, 'elevators/normal/shaft');
        this._lowerSprite.y += RisingTower.World.UNIT_HEIGHT;
        this._shaftSprites.push(shaftSprite);
        this._group.add(shaftSprite);
      }
    }
  };

  Elevator.prototype.mouseDownEvent = function(pointer, x, y) {
    if (y < RisingTower.World.UNIT_HEIGHT) {
      this._dragPoint = Elevator.UPPER;
    }
    else if (y > this._bounds.height - RisingTower.World.UNIT_HEIGHT) {
      this._dragPoint = Elevator.LOWER;
    }
  };

  Elevator.prototype.mouseUpEvent = function(pointer, x, y) {
    this._dragPoint = false;
  };

  Elevator.prototype.getBounds = function() {
    return this._bounds;
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
