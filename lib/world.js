/* This contains the state of our world.
 */
var initWorld = function(RisingTower) {
  var World = RisingTower.World = function() {
    this._selectionBox = new Phaser.Rectangle(100, 100, World.UNIT_WIDTH * 4, World.UNIT_HEIGHT);

    this._floors = {};

 //   this._group = new Phaser.Group(World._phaser);
    this._group = World._phaser.make.group();
  };

  World.UNIT_WIDTH = 32;
  World.UNIT_HEIGHT = 64;

  World.prototype.selectionBox = function() {
    return this._selectionBox.clone();
  };

  World.prototype.moveSelectionBox = function(worldX, worldY) {
    var gridX = (worldX - this._selectionBox.width/2);
    gridX = Phaser.Math.floorTo(gridX, 1, World.UNIT_WIDTH);
    var gridY = worldY;
    gridY = Phaser.Math.floorTo(gridY, 1, World.UNIT_HEIGHT);

    this._selectionBox.setTo(gridX,
                             gridY,
                             this._selectionBox.width,
                             this._selectionBox.height);
  };

  World.prototype.itemAt = function(worldX, worldY) {
  };

  World.prototype.isSelectionOverlapping = function() {
    var self = this;
    var ret = false;
    Object.keys(this._floors).forEach(function(floorKey) {
      var floor = self._floors[floorKey];

      // Floors are not necessarily UNIT_HEIGHT high since
      // some rooms are 2+ stories.
      var floorBounds = floor.group().getBounds();

      if (floorBounds.intersects(self._selectionBox)) {
        // Now check to see if it intersects any individual room
        floor.forEachRoom(function(room) {
          var roomBounds = room.room.sprite().getBounds();
          var intersection = roomBounds.intersection(self._selectionBox);
          if (intersection.width * intersection.height != 0) {
            ret = true;
            return;
          }
        })
      }
    });

    return ret;
  };

  World.prototype.itemOverlap = function(worldX, worldY, width, height) {
  };

  World.prototype.addItem = function(item, worldX, floor) {
    if (worldX === undefined) {
      worldX = this._selectionBox.x;
    }

    if (floor === undefined) {
      floor = this._selectionBox.y / World.UNIT_HEIGHT;
    }

    if (this._floors[floor] === undefined) {
      this._floors[floor] = new RisingTower.Floor(floor * World.UNIT_HEIGHT);
      this._group.add(this._floors[floor].group());
    }

    if (!this.isSelectionOverlapping()) {
      this._floors[floor].addRoom(item, worldX);
    }
  };

  World.prototype.removeItem = function(item) {
  };

  World.update = function(phaser) {
  };

  World.preload = function(phaser) {
    World._phaser = phaser;
    World._room = phaser.load.image('rooms/office/idle', 'resources/rooms/office/idle.png');
  };

  /* Renders the world state to the given texture. The region of the world to
   * render is given by worldX, worldY and the size of that region is given by
   * width and height. The given texture will be drawn to and should be the
   * size given by width and height.
   */
  World.prototype.render = function(worldX, worldY, width, height, texture) {
    if (texture === undefined) {
      return;
    }

    texture.renderXY(this._group, -worldX, -worldY, true);
  };
};
