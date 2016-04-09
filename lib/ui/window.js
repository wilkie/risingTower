/* This module implements a window.
 */

/*

   Window -> Screen
   Viewport -> (borderless) Window -> Screen

   Add a Window to a Window?

   Button -> Window
   Checkbox -> Window

   Button = function() {
   }

   Button.reposition()
   Button.events.onClick
   Checkbox.events etc

   */
var initUIWindow = function(UI) {
  var Window = UI.Window = function(phaser, x, y, width, height, style) {
    if (style === undefined) {
      style = Window.Style.Borderless;
    }

    this._style = style;
    this._boundingBox = new Phaser.Rectangle(x, y, width, height);

    this._group = phaser.make.group(null);

    this._innerBox = new Phaser.Rectangle(x, y, width, height);

    if (style == Window.Style.Bordered) {
      this._barLeft  = phaser.make.sprite(x, y, 'ui/bar/left');
      this._barRight = phaser.make.sprite(x+width, y, 'ui/bar/right');
      this._barRight.x -= this._barRight.width;
      this._bar      = phaser.make.tileSprite(
                         x + this._barLeft.width,
                         y,
                         width - this._barLeft.width - this._barRight.width,
                         this._barLeft.height,
                         'ui/bar');

      this._group.add(this._barLeft);
      this._group.add(this._barRight);
      this._group.add(this._bar);

      this._bar.inputEnabled = true;
      this._bar.input.enableDrag();
      this._bar.events.onDragStart.add(this.dragStart, this);
      this._bar.events.onDragUpdate.add(this.dragUpdate, this);
      this._bar.events.onDragStop.add(this.dragStop, this);

      this._barLeft.inputEnabled = true;
      this._barLeft.input.enableDrag();
      this._barLeft.events.onDragStart.add(this.dragStart, this);
      this._barLeft.events.onDragUpdate.add(this.dragUpdate, this);
      this._barLeft.events.onDragStop.add(this.dragStop, this);

      this._barRight.inputEnabled = true;
      this._barRight.input.enableDrag();
      this._barRight.events.onDragStart.add(this.dragStart, this);
      this._barRight.events.onDragUpdate.add(this.dragUpdate, this);
      this._barRight.events.onDragStop.add(this.dragStop, this);

      this._innerBox.y      += this._bar.height;
      this._innerBox.height -= this._bar.height;
    }

    this._inner = phaser.make.tileSprite(this._innerBox.x,
                                         this._innerBox.y,
                                         this._innerBox.width,
                                         this._innerBox.height,
                                         'ui/bg');

    this._group.add(this._inner);
  };

  Window.Style = {
    Borderless: 0,
    Bordered:   1,
    Sizable:    2
  };

  // Add default child add/remove
  Window.prototype.add            = UI.Screen.prototype.add;
  Window.prototype.remove         = UI.Screen.prototype.remove;

  // Add default bounds retrieval
  Window.prototype.getInnerBounds = UI.Screen.prototype.getInnerBounds;
  Window.prototype.getBounds      = UI.Screen.prototype.getBounds;

  // Add default mouse handling
  Window.prototype.mouseMoveEvent = UI.Screen.prototype.mouseMoveEvent;
  Window.prototype.mouseDownEvent = UI.Screen.prototype.mouseDownEvent;
  Window.prototype.mouseUpEvent   = UI.Screen.prototype.mouseUpEvent;

  Window.prototype.dragStart = function() {
  };

  Window.prototype.dragUpdate = function(sprite, pointer, x, y, snapPoint) {
    var self = this;
    var windowLeft = x;

    if (sprite === this._bar) {
      windowLeft -= this._barLeft.width;
    }
    else if (sprite === this._barLeft) {
    }
    else if (sprite === this._barRight) {
      windowLeft -= this._bar.width + this._barLeft.width;
    }

    this._boundingBox.x = windowLeft;
    this._boundingBox.y = y;

    this._barLeft.x = windowLeft;
    this._barLeft.y = y;

    this._barRight.x = windowLeft + this._boundingBox.width - this._barRight.width;
    this._barRight.y = y;

    this._bar.x = windowLeft + this._barLeft.width;
    this._bar.y = y;

    this._inner.x = windowLeft;
    this._inner.y = y + this._bar.height;

    this._windows.forEach(function(child) {
      child.reposition(self._boundingBox.x,
                       self._boundingBox.y + self._bar.height);
    });
  };

  Window.prototype.dragStop = function(sprite, pointer, x, y, snapPoint) {
  };

  Window.prototype.group = function() {
    return this._group;
  };

  Window.preload = function(phaser) {
    phaser.load.image('ui/bg',         'resources/ui/bg.png');
    phaser.load.image('ui/bar',        'resources/ui/bar.png');
    phaser.load.image('ui/bar/left',   'resources/ui/bar_left.png');
    phaser.load.image('ui/bar/right',  'resources/ui/bar_right.png');
    phaser.load.image('ui/bar/button', 'resources/ui/bar_button.png');
  };
};
