/* This contains the state of our world.
 */
var initWorld = function(RisingTower) {
  var World = RisingTower.World = function(phaser) {
    this._dragging = false;

    // This is a Phaser.Rectangle that represents the current selection.
    this._selectionBox = new Phaser.Rectangle(100,
                                              100,
                                              World.UNIT_WIDTH * 4,
                                              World.UNIT_HEIGHT);

    // What follows are the various collections of renderable objects which
    // are used internally to draw the World. You generally don't interact
    // with these directly and they are a little ugly to use.

    // The collection of Phaser.Groups which represent floors in the World.
    // The Floor object is referenced within the 'object' field. Floors contain
    // Rooms. This is an object where the keys are the floor number.
    // this._floors[1] is the lobby floor. 0 is the first basement floor. etc.
    //
    // Use World's getFloor function to pull out the Floor for a given floor.
    this._floors = {};

    this._elevators = {};

    // This is the collection of Phaser.Sprites in the World. Each Sprite has
    // a reference to the actual object represented in the 'object' field. Each
    // sprite is referenced by an id which is given by _nextSpriteIndex which is
    // incremented with every new Phaser.Sprite.
    //
    // Use World's itemAt function to pull out the item for the given location.
    this._sprites = {};
    this._nextSpriteIndex = 0;

    // The Phaser scene for the World. This holds every object in the World for
    // rendering. We pass this along (in the render() method called by Viewport)
    // to the renderer to draw to Viewports.
    this._group         = phaser.make.group();
    this._roomGroup     = phaser.make.group();
    this._elevatorGroup = phaser.make.group();

    this._group.add(this._roomGroup);
    this._group.add(this._elevatorGroup);

    // We keep a reference to the renderer library.
    this._phaser = phaser;
  };

  /* The grid size */
  World.UNIT_WIDTH = 32;
  World.UNIT_HEIGHT = 64;

  /* Returns a copy of the Phaser object.
   */
  World.prototype.phaser = function() {
    return this._phaser;
  };

  /* Returns a copy of the Phaser.Rectangle representing the current selection.
   */
  World.prototype.selectionBox = function() {
    return this._selectionBox.clone();
  };

  /* Moves the selection box centered around the given world coordinates.
   */
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

  World.prototype.mouseMoveEvent = function(pointer, worldX, worldY) {
    var self = this;

    if (self._dragging && self._dragging.mouseDragEvent) {
      var bounds = self._dragging.getBounds();
      var localX = worldX - bounds.x;
      var localY = worldY - bounds.y;
      self._dragging.mouseDragEvent(pointer, localX, localY);
    }
  };

  /* This event fires when a mouse event occurs somewhere on the World.
   */
  World.prototype.mouseDownEvent = function(pointer, worldX, worldY) {
    var self = this;

    // Get the item at that world coordinate
    var elevator = this.elevatorAt(worldX, worldY);
    if (elevator) {
      var bounds = elevator.getBounds();
      elevator.mouseDownEvent(pointer, worldX - bounds.x, worldY - bounds.y);
      if (elevator.mouseDragEvent !== undefined) {
        self._dragging = elevator;
      }
    }
  };

  World.prototype.mouseUpEvent = function(pointer, worldX, worldY) {
    var self = this;
    if (self._dragging) {
      if (self._dragging.mouseUpEvent) {
        var bounds = self._dragging.getBounds();
        self._dragging.mouseUpEvent(pointer, worldX - bounds.x, worldY - bounds.y);
      }
      self._dragging = false;
    }
  };

  /* This returns whatever object is located at the given world coorindates.
   */
  World.prototype.roomAt = function(worldX, worldY) {
    var self = this;
    var ret = false;

    Object.keys(this._floors).forEach(function(floorKey) {
      var floor = self.getFloor(floorKey);
      var floorGroup = floor.group();

      // Floors are not necessarily UNIT_HEIGHT high since
      // some rooms are 2+ stories.
      var floorBounds = floorGroup.getBounds();

      if (floorBounds.contains(worldX, worldY)) {
        // Now check to see if it intersects any individual room
        floor.forEachRoom(function(room) {
          var roomBounds = room.sprite().getBounds();
          if (roomBounds.contains(worldX, worldY)) {
            ret = room;
            return;
          }
        })
      }
    });

    return ret;
  };

  /* This returns the elevator that is located at the given world coordinates.
   */
  World.prototype.elevatorAt = function(worldX, worldY) {
    var self = this;
    var ret = false;


    Object.keys(this._elevators).forEach(function(elevatorKey) {
      var elevator = self._elevators[elevatorKey];
      var elevatorGroup = elevator.group();

      // Floors are not necessarily UNIT_HEIGHT high since
      // some rooms are 2+ stories.
      var bounds = elevatorGroup.getBounds();

      if (bounds.contains(worldX, worldY)) {
        ret = elevator;
      }
    });

    return ret;
  };

  /* This method returns true when the current selection is overlapping a
   * Room in the World.
   */
  World.prototype.isSelectionOverlapping = function() {
    var self = this;
    var ret = false;

    Object.keys(this._floors).forEach(function(floorKey) {
      var floor = self.getFloor(floorKey);
      var floorGroup = floor.group();

      // Floors are not necessarily UNIT_HEIGHT high since
      // some rooms are 2+ stories.
      var floorBounds = floorGroup.getBounds();

      if (floorBounds.intersects(self._selectionBox)) {
        // Now check to see if it intersects any individual room
        floor.forEachRoom(function(room) {
          var roomSprite = self._sprites[room.index()];
          if (roomSprite) {
            var roomBounds = roomSprite.getBounds();
            var intersection = roomBounds.intersection(self._selectionBox);
            if (intersection.width * intersection.height != 0) {
              ret = true;
              return;
            }
          }
        })
      }
    });

    return ret;
  };

  /* Returns the Floor for the given floor number. The lobby is floor 1 and
   * 0 is the first basement level.
   */
  World.prototype.getFloor = function(floorY) {
    if (this._floors[floorY]) {
      return this._floors[floorY];
    }
  };

  /* This method adds the given item to the World at the given X coordinate
   * and on the given floor. The floor is an integer where 1 is the lobby
   * and 0 is the first basement, etc.
   */
  World.prototype.addItem = function(item, worldX, floorY) {
    if (worldX === undefined) {
      worldX = this._selectionBox.x;
    }

    if (floorY === undefined) {
      floorY = this._selectionBox.y / World.UNIT_HEIGHT;
    }

    if (this._floors[floorY] === undefined) {
      var floor = new RisingTower.Floor(this._phaser, this, floorY * World.UNIT_HEIGHT);
      this._floors[floorY] = floor;

      this._roomGroup.add(floor.group());
    }

    if (item.type === "rooms") {
      this.addRoom(item, worldX, floorY);
    }

    if (item.type === "elevators") {
      this.addElevator(item, worldX, floorY);
    }
  };

  World.prototype.addElevator = function(elevator, worldX, floorY) {
    var worldY = this._selectionBox.y;

    if (floorY === undefined) {
      floorY = this._selectionBox.y / World.UNIT_HEIGHT;
    }

    // Check to see if we can add the given Elevator.
    if (true) { //!this.isSelectionOverlapping()) {
      // Add the Room to the Floor
      var newElevator = new RisingTower.Elevator(this._phaser, elevator, this._nextSpriteIndex, worldX, this.getFloor(floorY).y());
      this._elevators[newElevator.index()] = newElevator;
      this._nextSpriteIndex++;

      // Create a Phaser.Sprite that will draw this room
      var sprite = newElevator.group();

      // Store the sprite associated with the Room.
      this._sprites[newElevator.index()] = sprite;

      // Add that Sprite to the Phaser.Group representing the Floor.
      this._elevatorGroup.add(sprite);
    }
  };

  /* This method adds the given Room to the World at the given X coordinate and
   * on the given floor. The floor is an integer where 1 is the lobby and 0 is
   * the first basement, etc.
   */
  World.prototype.addRoom = function(room, worldX, floorY) {
    var worldY = this._selectionBox.y;

    if (floorY === undefined) {
      floorY = this._selectionBox.y / World.UNIT_HEIGHT;
    }

    // Check to see if we can add the given Room.
    if (!this.isSelectionOverlapping()) {
      // Add the Room to the Floor
      var newRoom = new RisingTower.Room(this._phaser, room, this._nextSpriteIndex, worldX, this.getFloor(floorY));
      this._nextSpriteIndex++;

      this.getFloor(floorY).addRoom(newRoom, worldX);

      // Create a Phaser.Sprite that will draw this room
      var sprite = newRoom.group();

      // Store the sprite associated with the Room.
      this._sprites[newRoom.index()] = sprite;
      sprite.alpha = 0.5;

      // Add that Sprite to the Phaser.Group representing the Floor.
      this._floors[floorY].group().add(sprite);
    }
  };

  /* Removes the given item from the World.
   */
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
