var initUserInterface = function(RisingTower) {
  var UserInterface = RisingTower.UserInterface = function() {
  }

  UserInterface.viewports = [];

  UserInterface.preload = function(phaser) {
  };

  UserInterface.create = function(phaser) {
    // Add an object to represent the selection
    this.selectionBox = new Phaser.Rectangle(100, 100, 100, 50);

    this.graphics = phaser.add.graphics(0, 0);

    // Add a mouse event handler
    phaser.input.addMoveCallback(UserInterface.mouseMoveEvent, this);
    phaser.input.onDown.add(UserInterface.mouseDownEvent, this);
  };

  UserInterface.mouseMoveEvent = function(pointer, x, y) {
    this.x = x;
    this.y = y;
    this.pointer = pointer;

    // Discover the viewport we are on.
    // Adjust the local coordinates to the viewport coordinates
    var viewport = UserInterface.viewportAtPoint(x, y);
    if (viewport) {
      x -= viewport.boundingBox().x;
      y -= viewport.boundingBox().y;
      viewport.mouseMoveEvent(pointer, x, y);
    }
  };

  UserInterface.mouseDownEvent = function(pointer) {
    // Discover the viewport we are on.
    // Adjust the local coordinates to the viewport coordinates
    var x = pointer.x;
    var y = pointer.y;

    var viewport = UserInterface.viewportAtPoint(x, y);
    if (viewport) {
      x -= viewport.boundingBox().x;
      y -= viewport.boundingBox().y;
      viewport.mouseDownEvent(pointer, x, y);
    }
  };

  UserInterface.viewportAtPoint = function(x, y) {
    var ret;
    this.viewports.forEach(function(viewport) {
      if (viewport.boundingBox().contains(x, y)) {
        ret = viewport;
      }
    });
    return ret;
  };

  UserInterface.addViewport = function(viewport) {
    this.viewports.push(viewport);
  };

  UserInterface.update = function(phaser) {
    var PAN_X_SPEED = 10.0;
    var PAN_Y_SPEED = 10.0;

    if (phaser.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      this.viewports[0].pan(-PAN_X_SPEED, 0);
      UserInterface.mouseMoveEvent.call(this, this.pointer, this.x, this.y)
    }

    if (phaser.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      this.viewports[0].pan(PAN_X_SPEED, 0);
      UserInterface.mouseMoveEvent.call(this, this.pointer, this.x, this.y)
    }

    if (phaser.input.keyboard.isDown(Phaser.Keyboard.UP)) {
      this.viewports[0].pan(0, -PAN_Y_SPEED);
      UserInterface.mouseMoveEvent.call(this, this.pointer, this.x, this.y)
    }

    if (phaser.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
      this.viewports[0].pan(0, PAN_Y_SPEED);
      UserInterface.mouseMoveEvent.call(this, this.pointer, this.x, this.y)
    }
  };
}
