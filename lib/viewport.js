/* Viewport object handles a view of the world and renders worlds state within
 * a section of the screen. There is a camera that controls what part of the
 * world you are looking at.
 *
 * Right now, we don't support multiple cameras because phaser doesn't support
 * multiple cameras. We could render to a texture, though.
 */
var initViewport = function(RisingTower) {
  var Viewport = RisingTower.Viewport = function(x, y, width, height, world) {
    this._boundingBox = new Phaser.Rectangle(x, y, width, height);
    this._x = 0;
    this._y = 0;
    this._width = width;
    this._height = height;
    this._world = world;

    this._environment = new RisingTower.Environment(this);

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

    this._environment.moveTo(worldX, worldY);
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

  Viewport.prototype.boundingBox = function() {
    return this._boundingBox.clone();
  };

  Viewport.prototype.mouseEvent = function(pointer, localX, localY) {
    // Discover world coordinates
    var worldX = localX + this._x;
    var worldY = localY + this._y;

    this._world.moveSelectionBox(worldX, worldY);
  };

  Viewport.create = function(phaser) {
    this.graphics = phaser.add.graphics(0, 0);
  };

  Viewport.render = function(phaser) {
    var self = this;
    this.graphics.clear()
    this.graphics.lineStyle(2, 0xffff00, 1);

    Viewport._viewports.forEach(function(viewport) {
      // Draw Environment

      // Draw World

      // Draw Sprites

      // Draw the section box and cursor
      var selectionBox = viewport.selectionBox();
      self.graphics.drawRect(selectionBox.x + viewport._boundingBox.x,
                             selectionBox.y + viewport._boundingBox.y,
                             selectionBox.width,
                             selectionBox.height);
    });
  };
};
