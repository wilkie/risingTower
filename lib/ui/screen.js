var initUIScreen = function(UI) {
  var Screen = UI.Screen = function(phaser, x, y, width, height) {
    // Add input callbacks
    phaser.input.addMoveCallback(this.mouseMoveEvent, this);
    phaser.input.onDown.add(this.mouseDownEvent, this);
    phaser.input.onUp.add(this.mouseUpEvent, this);

    this._boundingBox = new Phaser.Rectangle(x, y, width, height);
    this._innerBox    = new Phaser.Rectangle(x, y, width, height);

    this._group = phaser.make.group();
  };

  Screen.prototype.getBounds = function(item) {
    return this._boundingBox.clone();
  };

  Screen.prototype.getInnerBounds = function(item) {
    return this._innerBox.clone();
  };

  Screen.prototype.add = function(item) {
    if (this._windows === undefined) {
      this._windows = [];
    }
    if (item._parent_window) {
      item._parent_window.remove(item);
    };
    item._parent_window = this;
    this._windows.push(item);

    if (item.reposition) {
      var box = this.getBounds();
      if (this.getInnerBounds) {
        box = this.getInnerBounds();
      }
      item.reposition(box.x, box.y);
    }

    if (item.group) {
      this._group.add(item.group());
    }
  };

  Screen.prototype.remove = function(item) {
    if (this._windows === undefined) {
      this._windows = [];
    }

    if (item._parent_window) {
      item._parent_window = null;
    };

    var index = this._windows.indexOf(item);

    if (index >= 0) {
      this._windows.splice(index, 1);
    }
  };

  Screen.prototype.parent = function() {
    return this._parent_window;
  };

  Screen.prototype.mouseMoveEvent = function(pointer, screenX, screenY) {
    if (this._windows === undefined) {
      this._windows = [];
    }

    var hovered;
    this._windows.forEach(function(child) {
      if (child.getBounds) {
        if (child.getBounds().contains(screenX, screenY)) {
          if (child.mouseMoveEvent) {
            hovered = child;
          }
        }
      }
    });

    if (hovered) {
      hovered.mouseMoveEvent(pointer, screenX, screenY);
    }
  };

  Screen.prototype.mouseDownEvent = function(pointer, screenX, screenY) {
    if (this._windows === undefined) {
      this._windows = [];
    }

    var hovered;
    this._windows.forEach(function(child) {
      if (child.getBounds) {
        if (child.getBounds().contains(screenX, screenY)) {
          if (child.mouseDownEvent) {
            hovered = child;
          }
        }
      }
    });

    if (hovered) {
      hovered.mouseDownEvent(pointer, screenX, screenY);
    }
  };

  Screen.prototype.mouseUpEvent = function(pointer, screenX, screenY) {
    if (this._windows === undefined) {
      this._windows = [];
    }

    var hovered;
    this._windows.forEach(function(child) {
      if (child.getBounds) {
        if (child.getBounds().contains(screenX, screenY)) {
          if (child.mouseUpEvent) {
            hovered = child;
          }
        }
      }
    });

    if (hovered) {
      hovered.mouseUpEvent(pointer, screenX, screenY);
    }
  };
};
