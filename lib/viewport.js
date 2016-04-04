/* Viewport object handles a view of the world and renders worlds state within
 * a section of the screen. There is a camera that controls what part of the
 * world you are looking at.
 *
 * Right now, we don't support multiple cameras because phaser doesn't support
 * multiple cameras. We could render to a texture, though.
 */
var initViewport = function(RisingTower) {
  var Viewport = RisingTower.Viewport = function(phaser, x, y, width, height, world) {
    this._boundingBox = new Phaser.Rectangle(x, y, width, height);
    this._x = 0;
    this._y = 0;
    this._width = width;
    this._height = height;
    this._world = world;

    this._environment = new RisingTower.Environment(this);
    this._overlay     = phaser.make.graphics(x, y);
    this._texture     = phaser.add.renderTexture(width, height);
    this._screen      = phaser.make.sprite(x, y, this._texture);
    this._group       = phaser.add.group();
    this._group.add(this._screen);
    this._group.add(this._overlay);

    Viewport._viewports.push(this);
  };

  Viewport._viewports = [];

  Viewport.prototype.boundingBox = function() {
    return this._boundingBox.clone();
  };

  Viewport.prototype.x = function() {
    return this._boundingBox.x;
  };

  Viewport.prototype.y = function() {
    return this._boundingBox.y;
  };

  Viewport.prototype.width = function() {
    return this._width;
  };

  Viewport.prototype.height = function() {
    return this._height;
  };

  Viewport.prototype.worldX = function() {
    return this._x;
  };

  Viewport.prototype.worldY = function() {
    return this._y;
  };

  Viewport.prototype.moveTo = function(worldX, worldY) {
    this._x = worldX;
    this._y = worldY;
  };

  Viewport.prototype.updateOverlay = function() {
    var selectionBox = this.selectionBox();

    if (this._lastSelectionBox !== undefined &&
        this._lastSelectionBox.equals(selectionBox)) {
      return;
    }
    this._lastSelectionBox = selectionBox;

    var graphics = this._overlay;
    graphics.clear();
    var invalid = this._world.isSelectionOverlapping();
    var elevator = this._world.elevatorAt(this._pointerX,
                                          this._pointerY);
    if (elevator) {
    }
    else {
      if (invalid) {
        graphics.lineStyle(2, 0xff0000, 1);
        graphics.beginFill(0xff0000, 0.3);
      }
      else {
        graphics.lineStyle(2, 0x00ff00, 1);
      }
      graphics.drawRect(selectionBox.x + this._boundingBox.x,
                        selectionBox.y +this._boundingBox.y,
                        selectionBox.width,
                        selectionBox.height);
      if (invalid) {
        graphics.endFill();
      }
    }
  };

  Viewport.prototype.centerOn = function(worldX, worldY) {
    this.moveTo(worldX - (this._boundingBox.width  / 2),
                worldY + (this._boundingBox.height / 2));
  };

  Viewport.prototype.bottomAt = function(worldY) {
    this.moveTo(this._x,
                worldY - this._boundingBox.height);
  };

  Viewport.prototype.topAt = function(worldY) {
    this.moveTo(this._x,
                worldY);
  };

  Viewport.prototype.leftAt = function(worldX) {
    this.moveTo(worldX,
                this._y);
  };

  Viewport.prototype.rightAt = function(worldX) {
    this.moveTo(worldX - this._boundingBox.width,
                this._y);
  };

  Viewport.prototype.pan = function(deltaX, deltaY) {
    this.moveTo(this._x + deltaX,
                this._y + deltaY);
  };

  Viewport.prototype.world = function() {
    return this._world;
  };

  Viewport.prototype.selectionBox = function() {
    var selectionBox = this._world.selectionBox();

    selectionBox.x -= this._x;
    selectionBox.y -= this._y;

    return selectionBox;
  };

  /* Returns a Phaser.Rectangle that defines the bounds of the Viewport on the
   * screen in screen coordinates.
   */
  Viewport.prototype.boundingBox = function() {
    return this._boundingBox.clone();
  };

  /* This method is a callback that is fired whenever the mouse moves within
   * the bounds of the Viewport. pointer is a Phaser.Pointer and localX and
   * localY are the relative coordinates within the Viewport.
   */
  Viewport.prototype.mouseMoveEvent = function(pointer, localX, localY) {
    // Discover world coordinates
    var worldX = localX + this._x;
    var worldY = localY + this._y;

    this._pointerX = worldX;
    this._pointerY = worldY;

    this._world.moveSelectionBox(worldX, worldY);

    this.updateOverlay();

    this._world.mouseMoveEvent(pointer, worldX, worldY);
  };

  /* This method is a callback that is fired whenever a mouse button or touch
   * event occurs within the bounds of the Viewport. pointer is a Phaser.Pointer
   * and localX and localY are relative coordinates within the Viewport.
   */
  Viewport.prototype.mouseDownEvent = function(pointer, localX, localY) {
    if (pointer.leftButton.duration == 0) {
      this._world.addItem(RisingTower.Rooms.Office);
    }

    if (pointer.rightButton.duration == 0) {
      this._world.addItem(RisingTower.Elevators.Normal);
    }

    // Discover world coordinates
    var worldX = localX + this._x;
    var worldY = localY + this._y;

    // Fire the mouse event in the world
    this._world.mouseDownEvent(pointer, worldX, worldY);

    this.updateOverlay();
  };

  Viewport.prototype.mouseUpEvent = function(pointer, localX, localY) {
    // Discover world coordinates
    var worldX = localX + this._x;
    var worldY = localY + this._y;

    // Fire the mouse event in the world
    this._world.mouseUpEvent(pointer, worldX, worldY);
  };

  Viewport.update = function(phaser) {
    Viewport._viewports.forEach(function(viewport) {
      // Draw Environment
      viewport._environment.moveTo(viewport._x, viewport._y);

      viewport.updateOverlay();

      // Draw World
      var world = viewport.world();
      world.render(viewport._x, viewport._y, viewport._width, viewport._height, viewport._texture);

      // Draw Sprites
    });
  };

  Viewport.render = function(phaser) {
    Viewport._viewports.forEach(function(viewport) {
      // Draw Environment

      // Draw Sprites

      // Draw the selection box and cursor
    });
  };
};
